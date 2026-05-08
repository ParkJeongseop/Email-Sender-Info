window.ESI = window.ESI || {};

window.ESI.PERSONAL_DOMAINS = new Set([
  "naver.com",
  "daum.net", "hanmail.net",
  "kakao.com",
  "nate.com",
  "korea.com",

  "gmail.com", "googlemail.com",
  "outlook.com", "hotmail.com", "live.com", "msn.com",
  "yahoo.com", "yahoo.co.kr", "yahoo.co.jp", "ymail.com",
  "icloud.com", "me.com", "mac.com",
  "proton.me", "protonmail.com", "pm.me",
  "aol.com",

  "yandex.com", "yandex.ru",
  "mail.ru",
  "qq.com", "163.com", "126.com",
  "gmx.com", "gmx.de", "gmx.net",
  "web.de", "t-online.de",
  "zoho.com",
  "tutanota.com", "tuta.com",
  "fastmail.com"
]);

window.ESI.isPersonalDomain = function (domain) {
  return window.ESI.PERSONAL_DOMAINS.has(domain);
};
