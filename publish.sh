#!/bin/bash
set -euo pipefail

# 배포 패키지 생성
# Chrome Web Store에 업로드할 zip을 만듭니다.
# 런타임에 필요한 파일만 담고 README / scripts / icons/icon.svg 등은 제외합니다.

OUT="email-sender-info.zip"
FILES=(_locales icons manifest.json src)

rm -f "$OUT"
zip -r "$OUT" "${FILES[@]}" -x "icons/icon.svg"

echo "Done: $OUT"
