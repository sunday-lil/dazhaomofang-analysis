# 大招魔方学生端逆向分析（Dazhaomofang LiveStudent Reverse Engineering）

对「大招魔方学生端」v10.8.2（作业帮体系 Windows Electron 直播课客户端）的**互操作性 / 安全研究**分析。

> **性质声明**：本仓库为纯研究文档与技术观察，不含任何厂商源代码、二进制或资源文件；所有信息均来自对本地合法安装副本的静态分析，未绕过任何技术保护措施，未调用任何服务端接口。

## 内容

| 文件 | 说明 |
|---|---|
| [docs/大招魔方-逆向分析报告.md](docs/大招魔方-逆向分析报告.md) | 主报告（13 章）：架构、域名、HTTP 端点、IPC 通道、Hybrid 桥接 API、AI 视觉 SDK、MNN 模型、隐私与安全观察 |
| [tools/scan_urls.js](tools/scan_urls.js) | 通用工具：扫描目录内 JS 的 URL/域名并统计 |
| [tools/restore_sourcemap.js](tools/restore_sourcemap.js) | 通用工具：从 webpack sourcemap 的 `sourcesContent` 还原原始源码 |

## 核心发现速览

- 客户端无字节码/混淆保护，`app.asar` 为明文 webpack 包，且**误将 sourcemap 随生产包发布**
- 内置 MNN 离线 AI 推理：专注力 / 离席 / 坐姿 / 表情 / 手势 / 距离检测；SDK 返回 `is_upload` 标记表明**特定条件下学生摄像头画面可能被上传**（详见报告第 8、12 节）
- 硬编码凭据（AI 模型解密密钥、上传令牌、接口 authKey）可被直接提取（报告第 11 节，已脱敏）
- 渲染层代理请求可绕过同源策略；`PCTrySpawn/Exec` 系 IPC 存在潜在 RCE 面（报告第 12 节）

## 免责与合规

1. 本仓库仅用于**学习、研究与互操作性目的**，禁止商用、恶意利用或违法使用。
2. 「大招魔方」「作业帮」等名称与商标归权利人所有，引用仅用于识别分析对象。
3. 分析过程未修改、未再分发客户端本体；动态调试未产生持久化改动。
4. 建议厂商关注报告第 12 节的隐私与安全观察（含 sourcemap 误发布的供应链提示），欢迎通过官方渠道交流修正。

## 许可

本仓库内容以 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh) 发布，见 [LICENSE](LICENSE) 与 [NOTICE](NOTICE)。
