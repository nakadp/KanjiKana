LIFF URL 

開発用 
https://miniapp.line.me/2010149887-XfijU5UN
審査用 
https://miniapp.line.me/2010149888-3qqdJA3A
本番用 
https://miniapp.line.me/2010149889-HPejnDqH

---

### 第一步：获取你的 LIFF ID

你现在拿到的是 Channel ID，而前端代码需要的是 **LIFF ID**。

1. 在 LINE Developers Console 的列表里，点击进入 **開発用 (ID: 2010149887)** 这个 Channel。
2. 在顶部菜单栏找到 **「LIFF」** 标签页并点击。
3. 在这个页面里，你会看到一个 **LIFF ID**。它的格式通常是你的 Channel ID 加上一段后缀，例如：`2010149887-Abcdefgh`。
4. **把这个 LIFF ID 复制下来**，这就是你前端代码的“钥匙”。

---

### 第二步：前端代码集成与环境启动

假设你使用的是当前主流的 Vite + React/Vue，或者是本地起的一个简单的 HTML 服务（运行在本地 `localhost:5173` 或 `localhost:3000`）。

1. **安装并写入代码**
在你的前端项目中安装 SDK：
```bash
npm install @line/liff

```


在你项目的主入口文件（比如 `App.jsx` 或 `main.js`）中写入初始化逻辑：
```javascript
import { useEffect, useState } from 'react';
import liff from '@line/liff';

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        // 替换成你刚刚复制的 開発用 LIFF ID
        await liff.init({ liffId: "2010149887-xxxxxx" });

        if (!liff.isLoggedIn()) {
          liff.login(); // 唤起授权登录
        } else {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          console.log("登录成功，用户信息:", userProfile);
        }
      } catch (error) {
        console.error("LIFF 初始化失败", error);
      }
    };
    initLiff();
  }, []);

  return (
    <div>
      <h1>日文扫读助手 - 开发版</h1>
      {profile ? (
        <div>
          <img src={profile.pictureUrl} alt="头像" width="50" style={{ borderRadius: '50%' }} />
          <p>欢迎你，{profile.displayName}</p>
        </div>
      ) : (
        <p>加载中...</p>
      )}
    </div>
  );
}

export default App;

```


2. **启动本地服务**
运行你的项目（例如 `npm run dev`），确保它能在本地浏览器通过 `http://localhost:5173` （或对应端口）正常访问。此时在电脑浏览器看大概率会报错，因为不在 LINE 环境内，这是正常的。

---

### 第三步：配置内网穿透 (ngrok) 与 Endpoint URL

LINE App 无法访问你电脑里的 `localhost`，必须给它一个公网 `https` 链接。

1. **安装并运行 ngrok**
如果你没装过 ngrok，去官网下载。然后在终端运行以下命令（把端口换成你前端实际运行的端口，比如 5173）：
```bash
ngrok http 5173

```


2. **复制公网链接**
运行后，终端会输出一段类似这样的信息：
`Forwarding  https://a1b2-c3d4.ngrok.app -> http://localhost:5173`
**复制那个 `https://...ngrok.app` 的链接。**
3. **回到 LINE Console 填入链接**
* 再次回到你的 **開発用 Channel** 的 **「LIFF」** 标签页。
* 点击右上角的 **Edit**。
* 找到 **Endpoint URL** 输入框，把刚才复制的 `https://...ngrok.app` 填进去。
* 点击底部的 **Update** 保存。



*(💡注意：每次重启 ngrok 域名都会变，你需要重新回到这里修改 Endpoint URL。)*

---

### 第四步：真机扫码调试

现在，你的手机可以连接到你电脑上的代码了！

1. **添加测试权限**
* 点击 Channel 顶部的 **「Roles」** 标签页。
* 确认你当前登录的 LINE 账号在 Admin 列表里。如果是用你的主号创建的，默认就有权限。


2. **获取 LIFF URL 并测试**
* 回到 **「LIFF」** 标签页。
* 页面最上方有一个 **LIFF URL**（格式永远是 `https://liff.line.me/2010149887-xxxxxx`）。
* **把这个链接复制，用微信/电脑版 LINE 发到你手机的 LINE 聊天对话框里**。
* 在手机 LINE 里点击这个链接。



如果一切顺利，手机上会弹出一个半屏的小程序窗口，首次打开会请求授权（获取头像和昵称），同意后，你就能看到你在本地代码里写的“日文扫读助手 - 开发版”以及你自己的 LINE 头像了！

> **高级调试建议**：如果你需要在真机上查看 Console 报错，可以在前端项目的 `index.html` 的 `<head>` 里引入 [vConsole](https://www.google.com/search?q=https://github.com/Tencent/vConsole) 脚本，这样手机小程序右下角就会多出一个绿色的 "vConsole" 按钮，点击就能看到所有的网络请求和打印日志了。