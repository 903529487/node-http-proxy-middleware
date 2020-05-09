const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    // 设置是否运行客户端设置 withCredentials
    // 即在不同域名下发出的请求也可以携带 cookie
    res.header("Access-Control-Allow-Credentials", true)
    // 第二个参数表示允许跨域的域名，* 代表所有域名  
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
    // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
});

var targetUrl = "http://localhost:8080";
// 拦截http://localhost:3000/admin/*  的请求，转到目标服务器:http://localhost:8080/admin/*   
app.use('/admin/*', createProxyMiddleware({ target: targetUrl, changeOrigin: true }));

app.use('/login', createProxyMiddleware({ target: targetUrl, changeOrigin: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//配置服务端口
app.listen(3000, () => {
    console.log(`localhost:3000${api}`);
});


