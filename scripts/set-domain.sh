#!/bin/bash
# ============================================================
# 切換網站網域
#
#   用法：  bash scripts/set-domain.sh newchimei.com.tw
#
# 會做三件事：
#   1. 把全站的 SEO 網址（canonical / og / JSON-LD / sitemap / robots）換成新網域
#   2. 建立 CNAME 檔（GitHub Pages 用來識別自訂網域）
#   3. 列出修改結果供確認
#
# 不會做的事：DNS 設定與 GitHub 後台設定仍需手動完成（見 README）
# ============================================================
set -euo pipefail

NEW_DOMAIN="${1:-}"
cd "$(dirname "$0")/.."

if [ -z "$NEW_DOMAIN" ]; then
  echo "請提供新網域，例如："
  echo "  bash scripts/set-domain.sh newchimei.com.tw"
  exit 1
fi

# 去掉使用者可能誤加的 https:// 與結尾斜線
NEW_DOMAIN="${NEW_DOMAIN#http://}"
NEW_DOMAIN="${NEW_DOMAIN#https://}"
NEW_DOMAIN="${NEW_DOMAIN%/}"

# 基本格式檢查
if ! printf '%s' "$NEW_DOMAIN" | grep -Eq '^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$'; then
  echo "✗ 網域格式看起來不對：$NEW_DOMAIN"
  echo "  正確範例：newchimei.com.tw 或 www.newchimei.com.tw"
  exit 1
fi

# 找出目前使用中的網域（以 index.html 的 canonical 為準）
OLD=$(grep -o 'rel="canonical" href="https://[^"]*' index.html | sed 's#rel="canonical" href="https://##; s#/$##')
if [ -z "$OLD" ]; then
  echo "✗ 找不到目前的網址設定，請確認 index.html 的 canonical 標籤存在"
  exit 1
fi

if [ "$OLD" = "$NEW_DOMAIN" ]; then
  echo "目前已經是 $NEW_DOMAIN，不需要變更。"
  exit 0
fi

echo "舊網址：$OLD"
echo "新網域：$NEW_DOMAIN"
echo

BEFORE=$( { grep -ro "$OLD" --include='*.html' --include='*.xml' --include='*.txt' --include='*.md' . || true; } | wc -l | tr -d ' ')
echo "找到 $BEFORE 處需要替換…"

# 替換（BSD sed 與 GNU sed 皆相容的寫法）
{ grep -rl "$OLD" --include='*.html' --include='*.xml' --include='*.txt' --include='*.md' . || true; } \
  | while read -r f; do
      sed -i.bak "s#$OLD#$NEW_DOMAIN#g" "$f" && rm -f "$f.bak"
    done

# CNAME：GitHub Pages 靠這個檔案認得自訂網域
printf '%s\n' "$NEW_DOMAIN" > CNAME
echo "已建立 CNAME 檔（內容：$NEW_DOMAIN）"

AFTER=$( { grep -ro "$OLD" --include='*.html' --include='*.xml' --include='*.txt' --include='*.md' . || true; } | wc -l | tr -d ' ')
echo
if [ "$AFTER" = "0" ]; then
  echo "✓ 完成：$BEFORE 處已全部替換，沒有殘留舊網址"
else
  echo "⚠ 仍有 $AFTER 處殘留舊網址，請手動檢查："
  grep -rn "$OLD" --include='*.html' --include='*.xml' --include='*.txt' --include='*.md' .
  exit 1
fi

echo
echo "接下來請執行："
echo "  git add -A && git commit -m \"切換自訂網域 $NEW_DOMAIN\" && git push"
echo
echo "然後完成 DNS 與 GitHub 後台設定（詳見 README「更換網域」章節）。"
