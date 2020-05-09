前端的童鞋们vue-cli、webpack的项目可以使用proxyTable配置来进行跨域开发，但没有使用vue、webpack的项目呢？看来童鞋们还是一脸懵逼，还得求后端修改服务端header配置。

我们前端手握node利器，使用node进行接口转发，以后再也不用求爷爷告奶奶的求后端设置跨域啦。

废话不多说，我们直接开始吧。

#### 开始

1、先`npm init`初始化node项目  

2、使用express、http-proxy-middleware实现，`npm i express http-proxy-middleware -S`安装依赖。

3、在根目录新建app.js，在app.js使用express起了个3000端口的服务，express设置跨域，我们的请求通过`http://localhost:3000` 来访问目标服务器`http://localhost:8080`。


```javascript
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



```

4、使用`node app.js`启动服务。

#### 测试
新建个index.html，起个新的服务端口http://127.0.0.1:5500/index.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
    <script>
        $.ajax({
            type: 'post',
            url: 'http://localhost:3000/admin/polling/platformMsg',
            data: {},
            headers: {
                'Content-Type': 'application/json',
            },
            success: function (data) {
                console.log(data)
            },
            error: function (err) {
                console.log(err);
            }
        })
    </script>


</body>

</html>
```
index.html的请求`http://localhost:3000/admin/polling/platformMsg`实际上是请求到了目标服务器`http://localhost:8080/admin/polling/platformMsg`，接口数据返回成功。

#### 原理

`http://localhost:8080` 目标服务器，没有设置跨域，如果在客户端直接请求8080端口就会报跨域错误。  

`http://localhost:3000`  node中间间中转，因为设置了跨域，所以可以接收5500的请求，把5500的请求转发到8080服务器，8080服务器返回数据到3000，3000在返回给5500，就解决了跨域问题。
  
`http://localhost:5500`  客户端调用者  




