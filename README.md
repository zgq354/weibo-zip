# weibo-zip
把微博一键打包成 zip 文件、实现离线阅读的小玩具

## 文件格式
一条微博涉及到的主要内容会以 zip 文件的形式打包，目录结构安排如下：
```
.
├── pics/                   // 微博配图
    ├── xxxxxx.jpeg             // 缩略图
    ├── xxxxxx.large.jpeg       // 大图
    ├── xxxxxx.jpeg             // 缩略图
    ├── xxxxxx.large.jpeg       // 大图
    ├── .......
├── videos/                 // 微博插入视频
    ├── xxxxxx.mp4              // 标清视频
    ├── xxxxxx-hd.mp4           // 高清视频
    ├── .......
├── content.json            // 微博内容数据
└── interaction.json        // 评论，转发等互动内容
```

## 实现
1. 打包脚本：注入用户脚本([Userscript](https://en.wikipedia.org/wiki/Userscript))，将需要保存的数据保存成 `Blob`，用 `JSZip` 打包 `Blob` 并下载
2. 查看器：`React`，`TypeScript`，`Parcel` 打包，`JSZip` 解析文件，生成 Object URL，展示

查看器：[Weibo-Zip Viewer](https://zgq354.github.io/weibo-zip/)

## 打包脚本的限制
由于保存 zip 的过程是直接在前端注入代码实现的，前端 XHR 跨域请求配图、视频数据，会被浏览器 `CORS` 策略拦截。

这里采用本地搭建代理服务器的方式，给响应加入 `CORS` 相关响应头，绕过拦截。

选择以下两个工具配合实现：
1. [CORS Anywhere](https://github.com/Rob--W/cors-anywhere/): 快速解决 CORS 问题的代理
2. [Whistle](https://github.com/avwo/whistle): 本地提供 https 服务很麻烦，利用 `Whistle` 将浏览器的 https 请求转发至本地的 `CORS Anywhere` 服务

默认 whistle 规则：
```
cors.proxy 127.0.0.1:8888
```

## 使用步骤
1. 本地运行并配置好解决上述跨域问题的 `CORS Anywhere` 和 `Whistle`
2. 进入手机版微博详情页，打开 `DevTools` 在 `Console 面板` 粘贴 `scripts/save-weibo-zip.js` 中的代码，调用 `getWeiboZip()` 开始打包，随后会自动生成文件并下载至本地
3. 把得到的文件拖进查看器([Weibo-Zip Viewer](https://zgq354.github.io/weibo-zip/))，即可看到打包的微博的内容

## 开发
```
npm install
npm start
npm run build
```

## LICENSE
MIT
