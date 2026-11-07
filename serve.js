const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = __dirname;
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.txt', 'text/plain; charset=utf-8']
]);

http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }

  const filePath = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  const relativePath = path.relative(root, filePath);
  if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
    response.writeHead(403).end();
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError) {
      if (statError.code !== 'ENOENT') console.error(statError);
      response.writeHead(statError.code === 'ENOENT' ? 404 : 500).end();
      return;
    }
    if (!stats.isFile()) {
      response.writeHead(404).end();
      return;
    }

    response.writeHead(200, {
      'Content-Length': stats.size,
      'Content-Type': contentTypes.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff'
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', (error) => {
      console.error(error);
      if (response.headersSent) response.destroy(error);
      else response.writeHead(500).end();
    });
    stream.pipe(response);
  });
}).listen(8000, '127.0.0.1', () => {
  console.log('HKK Cardmaker is available at http://localhost:8000/');
});
