# 新奇美診所官方網站

沉靜質感的醫美診所形象網站（參考 FORAM 風格）：靛藍 × 純白 × 品牌青，強化「新奇美診所」SEO。

## 品牌識別

英文名為 **New Chi Mei Clinic**。三大專科：美容醫學專科 Cosmetic Surgery、婦產專科 Obs & Gyn、家醫專科 Family Medicine。

LOGO 已向量化，放在 `assets/img/`：

| 檔案 | 用途 |
|---|---|
| `logo-ncm.svg` | NCM 字標（深色版，用於白底頁首） |
| `logo-ncm-light.svg` | NCM 字標（白色版，用於深色底） |
| `logo-lockup.svg` | 含 New Chi Mei Clinic 字樣的完整組合（深色版） |
| `logo-lockup-light.svg` | 完整組合（白色版，用於頁尾） |
| `favicon.svg` | 瀏覽器分頁圖示（深底＋品牌十字） |
| `og-cover.jpg` | 社群分享預覽圖（品牌卡） |

## 品牌色

全站色彩直接取樣自 LOGO：深底 `#021C29`（OKLCH 色相 233）與十字 `#40B9A8`（色相 182）。

| 用途 | 權杖 | 色值 |
|---|---|---|
| 主色／內文 | `--ink` | 靛藍 `#033247` |
| 標題 | `--ink-strong` | 深靛 `#002333` |
| 次要文字 | `--ink-soft` | 霧靛 `#3B5D70` |
| 淺色區塊底 | `--surface` | 淡靛 `#EFF5F9` |
| 深色區塊底 | `--surface-deep` | **LOGO 深底 `#021C29`** |
| 強調（淺底） | `--accent` | 品牌青加深 `#037F71` |
| 強調（深底） | `--accent-soft` | **LOGO 品牌青 `#40B9A8`** |

改色只需修改 `assets/css/style.css` 最上方的 `:root` 區塊，全站自動套用。
所有文字組合皆通過 WCAG AA 對比度檢驗（最低 4.51，標準 4.5）。

LINE 綠僅保留給「真正會開啟 LINE」的按鈕（聯絡頁加好友鈕、右下角浮動鈕）；
其餘導向站內的諮詢按鈕一律使用品牌靛藍。LINE 綠採加深版 `#04803A`
（官方綠 `#06C755` 配白字僅 2.26:1，對長輩不友善；加深後為 5.06:1）。

## 線上網址

正式網址：<https://mamibuyama.github.io/shinchimei-clinic/>
（GitHub Pages 免費託管，24 小時可瀏覽，不需要開著電腦）

## 更換網域（買了自己的網域後）

假設新網域是 `newchimei.com.tw`，把下面每一處的 `newchimei.com.tw` 換成你實際的網域。
四個步驟，順序不要顛倒。

### 步驟 1：到網域註冊商設定 DNS

登入你買網域的地方（GoDaddy、Gandi、Cloudflare、中華電信…），找到「DNS 設定」／
「網域名稱解析」，新增以下紀錄：

| 類型 | 主機名稱 | 指向 |
|---|---|---|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |
| CNAME | www | `mamibuyama.github.io` |

四筆 A 紀錄都要加（GitHub 的四台伺服器，其中一台故障時仍能連線）。
`@` 代表根網域本身；有些商家寫成空白或網域全名，依該介面的說明填即可。
CNAME 的值結尾有沒有句點都可以，依介面要求。

> 想額外支援 IPv6 的話，再加四筆 AAAA 指向 `2606:50c0:8000::153`、`2606:50c0:8001::153`、
> `2606:50c0:8002::153`、`2606:50c0:8003::153`。非必要，可略過。

DNS 生效通常要 10 分鐘到數小時。可用這個指令確認是否生效：

```bash
dig +short newchimei.com.tw
```

看到那四個 185.199.x.153 就代表好了。

### 步驟 2：更新網站裡的網址設定

在專案資料夾執行（把網域換成你的）：

```bash
bash scripts/set-domain.sh newchimei.com.tw
```

這會自動替換全站 37 處 SEO 網址（canonical／og／JSON-LD／sitemap.xml／robots.txt），
並建立 GitHub Pages 需要的 `CNAME` 檔。執行完會顯示替換結果，有殘留會直接報錯。

接著上傳：

```bash
git add -A && git commit -m "切換自訂網域" && git push
```

### 步驟 3：在 GitHub 後台指定網域

前往 <https://github.com/MamiBuyAma/shinchimei-clinic/settings/pages>：

1. **Custom domain** 欄位填入 `newchimei.com.tw`，按 **Save**
2. 等待下方出現綠色勾勾「DNS check successful」（DNS 未生效前會顯示錯誤，屬正常）
3. 憑證簽發完成後，**Enforce HTTPS** 的勾選框才會變成可勾選——勾起來

> 憑證簽發通常幾分鐘，最長可能到 24 小時。這段期間網站仍可用 http 開啟。

### 步驟 4：確認

```bash
curl -sI https://newchimei.com.tw | head -1
```

出現 `HTTP/2 200` 就完成了。舊的 `mamibuyama.github.io/shinchimei-clinic` 網址
會自動轉址到新網域，先前分享出去的連結不會失效。

### 換完之後別忘了

- [ ] LINE 官方帳號、Google 商家、名片、DM 上的網址一併更新
- [ ] Google Search Console 重新提交 `https://newchimei.com.tw/sitemap.xml`
- [ ] 若已有 Google Analytics，更新資源設定中的網址
- [ ] `CNAME` 檔請保留在專案裡，刪掉的話自訂網域會失效

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
| 自有品牌保養品（面膜） | `products/mask.html` |
| **專欄管理後台（部落格編輯器）** | `admin/index.html` |

## 醫美專欄更新流程

1. 開啟 `admin/index.html`，撰寫或編輯文章（支援標題階層、粗斜體、清單、引言、圖片、連結、HTML 原始碼）。
2. 按「儲存文章」→ 可用「前台預覽」在同一台電腦立即檢視。
3. 確認後按「⬇ 匯出發佈檔 posts-data.js」，將下載的檔案覆蓋 `assets/js/posts-data.js`，重新上傳網站即完成發佈。

> 編輯器將草稿存在瀏覽器 localStorage，僅本機可見；「匯出＋覆蓋檔案」才是正式發佈。

## 上線前待辦（已在頁面中預留欄位）

- [ ] 全站網域：買了自有網域後，依上方「更換網域」章節操作（有一鍵腳本）。
- [ ] LINE 官方帳號：將 `@newchimei` 與 `https://line.me/R/ti/p/@newchimei` 替換為實際 ID 與加好友連結（`contact.html` 與各頁 footer）。
- [ ] `contact.html`：放入 LINE QR Code 圖片、門診時間、交通資訊、Google 地圖 iframe。
- [ ] 各服務頁「（待填入）」療程項目：補上實際療程名稱、儀器、價格帶。
- [ ] 醫師姓名與照片（`doctors.html` 目前僅列資歷，未具名）。
- [ ] **面膜產品頁**（`products/mask.html`）：正式品名（目前暫定「NCM 舒緩保濕面膜」）、三張產品實拍、全成分表、容量／入數／效期／產地、化粧品產品登錄碼、售價。
- [ ] 圖片目前使用 Unsplash 示意圖，建議替換為診所實拍照。
- [ ] 地址目前寫「台中市西區忠明路一號」（原需求文字為「台中師西區」，已按台中市西區理解，若有誤請修正）。

## SEO 已內建

- 每頁獨立 title／description，均包含「新奇美診所」與在地關鍵字
- JSON-LD 結構化資料：MedicalClinic（首頁／聯絡）、Physician（醫師）、FAQPage（常見問題）、BlogPosting(文章）
- `sitemap.xml`、`robots.txt`（後台已設 noindex 並擋爬蟲）
- 語意化 HTML、圖片 alt 皆含品牌詞、`lang="zh-Hant-TW"`
