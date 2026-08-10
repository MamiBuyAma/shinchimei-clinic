# 新奇美診所官方網站

沉靜質感的醫美診所形象網站（參考 FORAM 風格）：靛藍 × 純白 × 群青，強化「新奇美診所」SEO。

## 品牌色

全站色彩皆由靛藍主色衍生，統一在 OKLCH 色相 268–272：

| 用途 | 權杖 | 色值 |
|---|---|---|
| 主色／內文 | `--ink` | 靛藍 `#1F2F60` |
| 標題 | `--ink-strong` | 深靛 `#131F4C` |
| 次要文字 | `--ink-soft` | 霧靛 `#465682` |
| 淺色區塊底 | `--surface` | 淡靛 `#F1F4FB` |
| 強調（淺底） | `--accent` | 群青 `#4C5FBE` |
| 強調（深底） | `--accent-soft` | 霧藍 `#9CB4FE` |

改色只需修改 `assets/css/style.css` 最上方的 `:root` 區塊，全站自動套用。
所有文字組合皆通過 WCAG AA 對比度檢驗（最低 5.18，標準 4.5）。

LINE 官方綠 `#06C755` 僅保留給「真正會開啟 LINE」的按鈕（聯絡頁加好友鈕、右下角浮動鈕）；
其餘導向站內的諮詢按鈕一律使用品牌靛藍。

## 線上網址

正式網址：<https://mamibuyama.github.io/shinchimei-clinic/>
（GitHub Pages 免費託管，24 小時可瀏覽，不需要開著電腦）

## 如何預覽

直接雙擊 `index.html` 即可在瀏覽器開啟；或在此資料夾執行：

```bash
python3 -m http.server 8735
```

再開啟 <http://localhost:8735>。

## 如何更新網站

修改任何檔案後，在此資料夾依序執行：

```bash
git add -A && git commit -m "更新內容" && git push
```

約 1 分鐘後線上網站自動更新。

## 網站架構

| 頁面 | 路徑 |
|---|---|
| 首頁 | `index.html` |
| 服務項目總覽 | `services/index.html` |
| 醫學美容（輪廓拉提／微整注射／光療雷射） | `services/aesthetic-medicine.html` |
| 婦產科 | `services/obstetrics-gynecology.html` |
| 家醫科 | `services/family-medicine.html` |
| 生髮治療 | `services/hair-restoration.html` |
| 體重控制 | `services/weight-management.html` |
| 醫師資歷 | `doctors.html` |
| 常見問題 | `faq.html` |
| LINE@ 諮詢・聯絡我們 | `contact.html` |
| 醫美專欄（列表／文章） | `blog/index.html`、`blog/post.html` |
| **專欄管理後台（部落格編輯器）** | `admin/index.html` |

## 醫美專欄更新流程

1. 開啟 `admin/index.html`，撰寫或編輯文章（支援標題階層、粗斜體、清單、引言、圖片、連結、HTML 原始碼）。
2. 按「儲存文章」→ 可用「前台預覽」在同一台電腦立即檢視。
3. 確認後按「⬇ 匯出發佈檔 posts-data.js」，將下載的檔案覆蓋 `assets/js/posts-data.js`，重新上傳網站即完成發佈。

> 編輯器將草稿存在瀏覽器 localStorage，僅本機可見；「匯出＋覆蓋檔案」才是正式發佈。

## 上線前待辦（已在頁面中預留欄位）

- [x] 全站網域：目前為 `https://mamibuyama.github.io/shinchimei-clinic/`。日後若購買自有網域，全站搜尋 `mamibuyama.github.io/shinchimei-clinic` 一次替換即可。
- [ ] LINE 官方帳號：將 `@shinchimei` 與 `https://line.me/R/ti/p/@shinchimei` 替換為實際 ID 與加好友連結（`contact.html` 與各頁 footer）。
- [ ] `contact.html`：放入 LINE QR Code 圖片、門診時間、交通資訊、Google 地圖 iframe。
- [ ] 各服務頁「（待填入）」療程項目：補上實際療程名稱、儀器、價格帶。
- [ ] 醫師姓名與照片（`doctors.html` 目前僅列資歷，未具名）。
- [ ] 圖片目前使用 Unsplash 示意圖，建議替換為診所實拍照。
- [ ] 地址目前寫「台中市西區忠明路一號」（原需求文字為「台中師西區」，已按台中市西區理解，若有誤請修正）。

## SEO 已內建

- 每頁獨立 title／description，均包含「新奇美診所」與在地關鍵字
- JSON-LD 結構化資料：MedicalClinic（首頁／聯絡）、Physician（醫師）、FAQPage（常見問題）、BlogPosting(文章）
- `sitemap.xml`、`robots.txt`（後台已設 noindex 並擋爬蟲）
- 語意化 HTML、圖片 alt 皆含品牌詞、`lang="zh-Hant-TW"`
