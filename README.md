# 小嘴 · 实时解说（live-narrator）

> 住在输入框下面的小小解说员：AI 一边干活，它一边用语音把正在发生的事讲给你听。

![小嘴 · 实时解说](docs/demo.png)

这是一个 **DeepSeek Harness（DSH）** 的 Web 客户端插件。它不做任何模型调用——只是把 agent 正在做的事（思考、调用工具、读文件、跑命令）翻译成一句人话，用浏览器自带的语音合成念出来。

## 它做什么

- **一条常驻的小横条**，贴在对话输入框正下方，不占对话区
- **开关**：点一下就开/关，状态记在 localStorage，刷新后还在
- **实时解说**：agent 每进入一个新动作，就把这件事写成一句短话念出来（不是把整个回答读一遍）
- **音色可选**：下拉里列出系统可用的语音，选完会念一句示例
- **可视化波形**：正在说话时，头像的嘴会动，右侧有跳动的电平
- **零后端**：没有服务端、没有网络请求、没有 API key

## 安装

### 本地链接安装（开发用）

```bash
dsh plugin --profile desktop add link:C:\path\to\live-narrator
```

然后重启一次 DSH（bundle 层要重启才组装）。

### 手动挂载

1. 把整个目录放到任意位置
2. 在 `~/.dsh/profiles/<profile>/package.json` 的 `dsh.profile.bundles` 里加入包名
3. 用 `link:` 依赖指向本地目录

> ⚠️ 包名现在是 `@local/live-narrator`，属于「本机私有链接」的写法。如果你想发到 npm 或让别人直接 `dsh plugin add`，把 `package.json` 的 `name` 改成 `dsh-live-narrator`（或你喜欢的名字）再发。

## 配置

插件在浏览器侧自己存两个键：

| 键 | 含义 |
|---|---|
| `dsh.live-narrator.enabled` | 是否开启解说（`1` / `0`） |
| `dsh.live-narrator.voice` | 选中的语音 URI，空 = 系统默认 |

没有 host 侧配置项，`index.js` 的 `apply()` 是空的——所有逻辑都在 `client.js` 里。

## 目录结构

```
live-narrator/
├── index.js           # Host 半边（空实现，只为满足 bundle 结构）
├── client.js          # 全部逻辑：渲染、状态机、语音合成
├── cordis.patch.yml   # bundle patch：把自己插进 profile 的配置树
├── locale/
│   ├── zh.json        # 中文文案
│   └── en.json
├── icon.svg           # 插件图标
└── package.json
```

## 开发

`client.js` 是浏览器侧模块，通过 `window.__ModuleLoader__.load({ id, factory })` 注册。改完后如果 `pnpm run dev:web` 在跑，客户端模块会热加载；否则刷新页面。

## License

MIT。见 [LICENSE](LICENSE)。
