# Trading Desk RMS Demo

這是一個可部署到 Vercel 的操盤室多帳號風控管理系統 demo。

## 你電腦需要什麼

如果只是要上傳到 GitHub 並交給 Vercel 部署，最少需要：

- GitHub 帳號
- Vercel 帳號

如果要在自己電腦先預覽與修改，建議安裝：

- Node.js LTS
- Git

## 本機預覽

安裝 Node.js 後，在這個資料夾執行：

```bash
npm install
npm run dev
```

接著打開畫面顯示的本機網址。

## 部署到 Vercel

1. 把這個資料夾建立成 GitHub repository。
2. 到 Vercel 選擇 `Add New Project`。
3. 匯入該 GitHub repository。
4. Framework Preset 選 `Vite`。
5. Build Command 使用 `npm run build`。
6. Output Directory 使用 `dist`。

部署完成後，Vercel 會提供可分享的公開網址。

## Demo 狀態

目前是純前端互動展示，資料都是假資料。下單、風控確認、分頁切換都只在畫面中模擬，不會連到真實券商或送出任何交易。
