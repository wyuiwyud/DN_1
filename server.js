const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8090;
const PUBLIC_DIR = '/home/wyuiwyud/POLY-GAME';

http.createServer((req, res) => {
    let safeUrl = req.url.split('?')[0];
    let filePath = path.join(PUBLIC_DIR, safeUrl === '/' ? 'index.html' : safeUrl);
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        let ext = path.extname(filePath);
        let contentType = 'text/html';
        if (ext === '.js') contentType = 'text/javascript';
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.json') contentType = 'application/json';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.jpg') contentType = 'image/jpeg';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(fs.readFileSync(filePath));
    } else {
        res.writeHead(404);
        res.end('404 Not Found');
    }
}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
