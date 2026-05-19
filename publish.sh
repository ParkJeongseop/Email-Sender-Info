#!/bin/bash
set -euo pipefail

# 배포 패키지 생성
#
# Edge/Chrome과 Firefox는 MV3 background 요구가 상충합니다:
#   - Edge/Chrome: background.scripts 를 거부 (service_worker 만 허용)
#   - Firefox AMO: service_worker 만 있으면 거부 (scripts 필수)
# 따라서 단일 manifest로는 불가능하고, 브라우저별 zip을 따로 만듭니다.
#
# manifest.json 원본은 service_worker + scripts 를 모두 보유합니다
# (압축 해제 상태로 양쪽 브라우저에서 개발 로드가 되도록).
#   - Chrome/Edge 패키지: jq 로 background.scripts 제거
#   - Firefox 패키지: 원본 그대로
#
# 필요 도구: zip, jq  (WSL 에서 실행하세요)

SRC=(_locales icons src)

build() {
  local out=$1 jq_filter=$2
  local stage abs_out
  stage=$(mktemp -d)
  abs_out="$(pwd)/$out"

  cp -r "${SRC[@]}" "$stage/"
  rm -f "$stage/icons/icon.svg"          # SVG 소스는 패키지에서 제외
  jq "$jq_filter" manifest.json > "$stage/manifest.json"

  rm -f "$abs_out"
  ( cd "$stage" && zip -qr "$abs_out" . )
  rm -rf "$stage"
  echo "Done: $out"
}

build email-sender-info-chrome.zip  'del(.background.scripts)'
build email-sender-info-firefox.zip '.'
