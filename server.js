const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 80;
const DATA_FILE = path.join(__dirname, 'data', 'content.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Đảm bảo các thư mục tồn tại
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Hàm đọc dữ liệu an toàn
function loadContent() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.error('Lỗi đọc content.json:', e);
    }
    return {};
}

// Hàm lưu dữ liệu an toàn
function saveContent(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error('Lỗi ghi content.json:', e);
        return false;
    }
}

// Token đơn giản cho phiên đăng nhập
let activeTokens = new Set(['MODADEP_SECRET_KEY_8386']);

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Helper hàm đọc JSON body
    function getBody(callback) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            // Giới hạn payload 15MB để cho phép upload ảnh Base64
            if (body.length > 15 * 1024 * 1024) {
                res.writeHead(413, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dung lượng file quá lớn (tối đa 15MB)' }));
                req.destroy();
            }
        });
        req.on('end', () => {
            try {
                const data = body ? JSON.parse(body) : {};
                callback(data);
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Dữ liệu JSON không hợp lệ' }));
            }
        });
    }

    // ==========================================
    // API ENDPOINTS
    // ==========================================

    // 1. Lấy toàn bộ nội dung website (Public)
    if (pathname === '/api/content' && req.method === 'GET') {
        const content = loadContent();
        // Ẩn mật khẩu khi gửi ra ngoài
        const publicContent = { ...content };
        if (publicContent.admin) {
            delete publicContent.admin.password;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(publicContent));
        return;
    }

    // 2. Đăng nhập Quản Trị Viên
    if (pathname === '/api/login' && req.method === 'POST') {
        getBody(data => {
            const content = loadContent();
            const admin = content.admin || { username: 'admin', password: 'modadep8386' };
            if (data.username === admin.username && data.password === admin.password) {
                const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2);
                activeTokens.add(token);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, token, message: 'Đăng nhập thành công' }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' }));
            }
        });
        return;
    }

    // 3. Khách gửi yêu cầu báo giá từ Trang Chủ
    if (pathname === '/api/quote' && req.method === 'POST') {
        getBody(data => {
            if (!data.name || !data.phone) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, message: 'Vui lòng nhập họ tên và số điện thoại' }));
                return;
            }
            const content = loadContent();
            if (!content.quotes) content.quotes = [];

            const now = new Date();
            const dateStr = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            const newQuote = {
                id: Date.now(),
                name: data.name,
                phone: data.phone,
                item: data.item || 'Chưa chọn',
                address: data.address || '',
                note: data.note || '',
                createdAt: dateStr
            };
            content.quotes.unshift(newQuote);
            saveContent(content);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, message: 'Gửi yêu cầu báo giá thành công!' }));
        });
        return;
    }

    // 4. Lưu cập nhật toàn bộ nội dung website (Cần xác thực)
    if (pathname === '/api/content' && req.method === 'POST') {
        const auth = req.headers['authorization'];
        const token = auth ? auth.replace('Bearer ', '') : '';
        if (!activeTokens.has(token)) {
            res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false, message: 'Phiên làm việc hết hạn, vui lòng đăng nhập lại' }));
            return;
        }

        getBody(newContent => {
            const current = loadContent();
            // Giữ lại admin credentials và quotes nếu không gửi kèm
            if (!newContent.admin) newContent.admin = current.admin;
            if (!newContent.quotes) newContent.quotes = current.quotes || [];

            if (saveContent(newContent)) {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, message: 'Đã lưu tất cả thay đổi thành công!' }));
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, message: 'Lỗi ghi file vào máy chủ' }));
            }
        });
        return;
    }

    // 5. Upload hình ảnh (Nhận Base64 -> Lưu file vào /uploads)
    if (pathname === '/api/upload' && req.method === 'POST') {
        const auth = req.headers['authorization'];
        const token = auth ? auth.replace('Bearer ', '') : '';
        if (!activeTokens.has(token)) {
            res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false, message: 'Chưa đăng nhập' }));
            return;
        }

        getBody(data => {
            if (!data.base64) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, message: 'Không có dữ liệu ảnh' }));
                return;
            }

            try {
                // Tách định dạng và data base64
                const matches = data.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                let ext = '.jpg';
                let buffer;
                if (matches && matches.length === 3) {
                    const mime = matches[1];
                    if (mime.includes('png')) ext = '.png';
                    else if (mime.includes('webp')) ext = '.webp';
                    else if (mime.includes('gif')) ext = '.gif';
                    buffer = Buffer.from(matches[2], 'base64');
                } else {
                    buffer = Buffer.from(data.base64, 'base64');
                }

                const filename = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6) + ext;
                const filePath = path.join(UPLOADS_DIR, filename);
                fs.writeFileSync(filePath, buffer);

                const fileUrl = '/uploads/' + filename;
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, url: fileUrl }));
            } catch (err) {
                console.error('Lỗi lưu ảnh:', err);
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, message: 'Không thể lưu hình ảnh' }));
            }
        });
        return;
    }

    // 6. Đổi mật khẩu Admin
    if (pathname === '/api/change-password' && req.method === 'POST') {
        const auth = req.headers['authorization'];
        const token = auth ? auth.replace('Bearer ', '') : '';
        if (!activeTokens.has(token)) {
            res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false, message: 'Chưa đăng nhập' }));
            return;
        }

        getBody(data => {
            if (!data.newPassword || data.newPassword.length < 6) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' }));
                return;
            }
            const content = loadContent();
            if (!content.admin) content.admin = { username: 'admin' };
            content.admin.password = data.newPassword;
            if (data.newUsername) content.admin.username = data.newUsername;
            saveContent(content);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, message: 'Đổi mật khẩu thành công!' }));
        });
        return;
    }

    // ==========================================
    // PHỤC VỤ FILE TĨNH (STATIC FILES)
    // ==========================================

    // Xử lý route /admin
    if (pathname === '/admin' || pathname === '/admin/') {
        pathname = '/admin.html';
    }

    // Xử lý route /
    if (pathname === '/') {
        pathname = '/index.html';
    }

    let filePath;
    if (pathname.startsWith('/uploads/')) {
        filePath = path.join(UPLOADS_DIR, pathname.replace('/uploads/', ''));
    } else {
        filePath = path.join(__dirname, pathname);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Nếu không tìm thấy file, trả về index.html cho SPA
                fs.readFile(path.join(__dirname, 'index.html'), (errIndex, defaultHtml) => {
                    if (errIndex) {
                        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(defaultHtml);
                    }
                });
            } else {
                res.writeHead(500);
                res.end(`Lỗi máy chủ: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` WEBSITE MỘ ĐÁ ĐẸP ĐANG CHẠY TẠI: http://localhost:${PORT}`);
    console.log(` TRANG QUẢN TRỊ ADMIN TẠI:      http://localhost:${PORT}/admin`);
    console.log(` TÀI KHOẢN MẶC ĐỊNH: admin / modadep8386`);
    console.log(`=======================================================`);
});
