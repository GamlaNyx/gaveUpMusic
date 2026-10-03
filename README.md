# 所以我放弃了音乐

这是 FCG 招新趣味题 Q3：玩家在 Windows XP 风格桌面中查看模拟专辑合约、追踪本地区块链浏览器记录，并通过购买专辑解锁歌词。

所有地址、交易、余额、函数调用和专辑 owner 都由前端本地状态模拟；项目不连接钱包、RPC、真实区块链或代币。

## 本地运行

需要 Node.js 24 或更高版本。运行 Playwright E2E 测试还需要安装 Google Chrome Stable。

```powershell
npm install
npm run dev -- --host 127.0.0.1
```

## 测试与构建

```powershell
npm test
npm run test:e2e
npm run build
```

`npm test` 运行地址路由、歌词权限、余额/owner 状态转换、桌面窗口和完整通关逻辑测试。`npm run test:e2e` 使用 Playwright Chromium 检查桌面通关和窄屏窗口布局。
