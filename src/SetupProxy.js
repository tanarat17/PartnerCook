// src\SetupProxy.js

const { createProxyMiddleware} = require("http-proxy-middleware")


const apiProxy = createProxyMiddleware({
  target: 'https://notify-api.line.me/api/notify',
  changeOrigin: true,
});

// app.use(
//     createProxyMiddleware({
//       target: 'http://www.example.org/api',
//       changeOrigin: true,
//       pathFilter: '/api/proxy-only-this-path',
//     }),
//   );
