// Мини-сервер на Node.js: npm run serve → http://localhost:3000
const http = require("http"), fs = require("fs"), path = require("path");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
const allowed = ["index.html", "style.css", "script.js"];
http.createServer((req, res) => {
  const name = req.url === "/" ? "index.html" : req.url.slice(1).split("?")[0];
  if (!allowed.includes(name)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "Content-Type": types[path.extname(name)] + "; charset=utf-8" });
  fs.createReadStream(path.join(__dirname, name)).pipe(res);
}).listen(3000, () => console.log("SkySplit: http://localhost:3000"));
