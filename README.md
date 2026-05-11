# Email Sender Info

> Caller ID for your inbox — see a favicon and identity badge next to every sender across 8 mail providers including Gmail, Outlook, iCloud, and Yahoo.

## Features

For every email, the extension shows:

- 🏢 **Company mail** — the sender's brand favicon (Tesla, Samsung, Apple, …)
- 👤 **Personal mail** — favicon + a small "person" badge in the corner. Recognizes ~4,800 free / consumer / disposable providers including Gmail, Outlook, Yahoo, Proton, Naver, Daum, Kakao, Nate, etc.
- 🇰🇷 **Republic of Korea government** (`korea.kr`, `*.go.kr`, `*.mil.kr`) — favicon + 정부상징 emblem badge
- 🇺🇸 **United States government** (`.gov`, `.mil`, `.fed.us`, `state.XX.us`) — favicon + USA.gov emblem badge

Every supported service gets both list-view *and* detail-view coverage.

## Supported mail services

| | List view | Detail view |
|---|:---:|:---:|
| Gmail | ✅ | ✅ |
| Outlook (live.com / office.com / office365.com) | ✅ | ✅ |
| iCloud Mail | ✅ | ✅ |
| Yahoo Mail | ✅ | ✅ |
| Naver Mail | ✅ | ✅ |
| Daum Mail | ✅ | ✅ |
| Kakao Mail | ✅ | ✅ |
| Nate Mail | ✅ | ✅ |

## Architecture

```
src/
├── adapters/                # one file per mail service
│   ├── gmail.js
│   ├── naver.js
│   ├── daum.js              # also handles Kakao Mail
│   ├── nate.js
│   ├── outlook.js
│   ├── yahoo.js
│   ├── icloud.js            # isolated-world DOM injector
│   └── icloud-interceptor.js # MAIN-world fetch wrapper
├── lib/
│   ├── icon-builder.js      # builds the icon (favicon + optional badge)
│   └── personal-domains.js  # ~4,800-entry domain classifier
├── styles/common.css        # injected styles
└── background.js            # MV3 service worker (proxies favicons as data URLs)
```

Each adapter follows the same shape — a row selector, a sender-info extractor, and a `MutationObserver` that drives a `processAll()` pass.

**iCloud is the exception.** Apple keeps sender email addresses out of the rendered DOM entirely (only the display name is visible; the email lives in a `display: none` print-only DIV inside a cross-origin sandbox iframe). The iCloud adapter therefore runs a MAIN-world `fetch` interceptor that watches Apple's mail API responses (`mailws2/v1/thread/search`, `mailws2/v1/message/get`), pulls out the `(name, email)` pairs, and feeds the isolated-world adapter via a `CustomEvent` for matching against displayed names.

## Personal-mail domain list

Based on [Kikobeats/free-email-domains](https://github.com/Kikobeats/free-email-domains) (~4,800 entries, MIT). We contributed 22 Korean providers (`daum.net`, `kakao.com`, `nate.com`, `chol.com`, `hitel.net`, `nownuri.net`, …) back to the upstream maintainer's `postinstall.mjs` patch list. A couple of privacy-focused entries (`tutanota.com`, `tuta.com`) sit in `src/lib/personal-domains.js` as local supplements.

## Privacy

- Favicons are fetched from `www.google.com/s2/favicons` — either directly by the page, or via the extension's background service worker (rendered as a `data:` URL) for sites whose CSP blocks the direct fetch (iCloud).
- The extension does **not** read email bodies, attachments, or recipient lists beyond what the page already shows for the sender display name and address.
- No analytics, no telemetry, no remote server.

## Development

### Adding a new mail service

1. Open the service's inbox in Chrome and inspect the DOM.
2. Identify the row selector and where the sender's email lives (a `[title*='@']`, an `aria-label`, an embedded URL pattern, or — if the address is hidden — an API endpoint that returns it).
3. Create `src/adapters/<service>.js` following the shape used by `gmail.js` or `naver.js`.
4. Register a `content_scripts` entry in `manifest.json` with the matching host pattern.

### Regenerate icons

```bash
npm install --no-save @resvg/resvg-js
node scripts/build-icons.mjs
```

The source is `icons/icon.svg`; outputs go to `icons/icon{16,48,128}.png`.

## Credits

- Personal-mail domain list — [Kikobeats/free-email-domains](https://github.com/Kikobeats/free-email-domains) (MIT)
- Favicon source — Google's `s2/favicons` service

## License

MIT

---

# Email Sender Info (한국어)

> 받은편지함의 Caller ID — Gmail, 네이버메일, 다음메일, 카카오메일, iCloud 등 8개 메일 서비스의 모든 발신자 옆에 favicon과 식별 뱃지를 표시합니다.

## 기능

각 메일에서 보여줍니다:

- 🏢 **회사 메일** — 발신 도메인의 브랜드 favicon (테슬라, 삼성, 애플 등)
- 👤 **개인 메일** — favicon + 우하단에 작은 "사람" 뱃지. Gmail, Outlook, Yahoo, Proton, 네이버, 다음, 카카오, 네이트 등 약 4,800개 무료/소비자/일회용 제공자 인식.
- 🇰🇷 **대한민국 정부** (`korea.kr`, `*.go.kr`, `*.mil.kr`) — favicon + 정부상징 엠블럼 뱃지
- 🇺🇸 **미국 정부** (`.gov`, `.mil`, `.fed.us`, `state.XX.us`) — favicon + USA.gov 엠블럼 뱃지

지원되는 모든 서비스에서 리스트 뷰와 상세 뷰 모두 처리됩니다.

## 지원 메일 서비스

| | 리스트 뷰 | 상세 뷰 |
|---|:---:|:---:|
| Gmail | ✅ | ✅ |
| Outlook (live.com / office.com / office365.com) | ✅ | ✅ |
| iCloud Mail | ✅ | ✅ |
| Yahoo Mail | ✅ | ✅ |
| 네이버 메일 | ✅ | ✅ |
| 다음 메일 | ✅ | ✅ |
| 카카오 메일 | ✅ | ✅ |
| 네이트 메일 | ✅ | ✅ |

## 아키텍처

```
src/
├── adapters/                # 메일 서비스별 한 파일씩
│   ├── gmail.js
│   ├── naver.js
│   ├── daum.js              # 카카오 메일도 처리
│   ├── nate.js
│   ├── outlook.js
│   ├── yahoo.js
│   ├── icloud.js            # isolated-world DOM 주입기
│   └── icloud-interceptor.js # MAIN-world fetch 래퍼
├── lib/
│   ├── icon-builder.js      # 아이콘 빌더 (favicon + 옵션 뱃지)
│   └── personal-domains.js  # 약 4,800개 도메인 분류기
├── styles/common.css        # 주입 스타일
└── background.js            # MV3 service worker (favicon을 data URL로 프록시)
```

각 어댑터는 같은 구조 — row selector, 발신자 정보 추출기, `MutationObserver`로 구동되는 `processAll()` pass.

**iCloud만 예외.** Apple은 발신자 이메일 주소를 렌더링된 DOM에 노출하지 않습니다 (보이는 부분에는 이름만, 이메일은 cross-origin sandbox iframe 안의 `display: none` 인쇄용 DIV에만 존재). 그래서 iCloud 어댑터는 MAIN-world `fetch` 인터셉터를 띄워 Apple 메일 API 응답(`mailws2/v1/thread/search`, `mailws2/v1/message/get`)에서 `(name, email)` 쌍을 추출하고, `CustomEvent`로 isolated-world 어댑터에 전달해 표시된 이름과 매칭시킵니다.

## 개인 메일 도메인 리스트

[Kikobeats/free-email-domains](https://github.com/Kikobeats/free-email-domains) (~4,800 항목, MIT) 기반. 한국 메일 제공자 22개 (`daum.net`, `kakao.com`, `nate.com`, `chol.com`, `hitel.net`, `nownuri.net` 등)를 upstream 유지보수자의 `postinstall.mjs` 패치 리스트에 contribute. 프라이버시 중심 일부 (`tutanota.com`, `tuta.com`)는 로컬 supplement로 `src/lib/personal-domains.js`에 추가.

## 프라이버시

- favicon은 `www.google.com/s2/favicons` 에서 가져옴 — 페이지에서 직접 또는 (CSP가 직접 fetch를 막는 iCloud 등에서는) 확장의 background service worker가 `data:` URL로 변환.
- 메일 본문, 첨부, 수신자 목록 등을 **읽지 않음**. 페이지에 이미 표시된 발신자 이름과 주소만 사용.
- 분석/원격 전송 없음.

## 개발

### 새 메일 서비스 추가

1. Chrome에서 해당 서비스의 받은편지함을 열고 DOM 조사
2. row selector와 발신자 이메일 위치 파악 (`[title*='@']`, `aria-label`, 임베드된 URL 패턴, 또는 — 주소가 숨겨져 있다면 — 반환하는 API endpoint)
3. `src/adapters/<service>.js`를 `gmail.js` 또는 `naver.js`와 같은 구조로 작성
4. `manifest.json`에 매칭 host 패턴의 `content_scripts` entry 등록

### 아이콘 재생성

```bash
npm install --no-save @resvg/resvg-js
node scripts/build-icons.mjs
```

소스는 `icons/icon.svg`; 출력은 `icons/icon{16,48,128}.png`.

## 크레딧

- 개인 메일 도메인 리스트 — [Kikobeats/free-email-domains](https://github.com/Kikobeats/free-email-domains) (MIT)
- Favicon 소스 — Google `s2/favicons`

## 라이선스

MIT
