const todayInKorea = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const normal = (value = "") => String(value ?? "").normalize("NFKC").toLowerCase().trim();
const isDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
};

export function noticeStatus(notice, today = todayInKorea()) {
  if (!isDate(today) || !isDate(notice.start) || !isDate(notice.end) || notice.start > notice.end) return "unknown";
  if (today < notice.start) return "upcoming";
  return today > notice.end ? "closed" : "open";
}

const categoryLabels = {
  funding: "금융·자금", startup: "창업", operations: "경영·판로", export: "수출", training: "교육·고용", technology: "기술"
};
const audienceLabels = {
  founder: "예비창업 초기창업 청년 창업 준비", solo: "소상공인 자영업 개인사업 1인사업자", business: "중소기업 회사 법인", household: "개인 가구 프리랜서 복지 생활"
};
const statusLabels = { open: "접수기간 내", upcoming: "접수 예정", closed: "마감", unknown: "원문 확인 필요" };

export function findNotices(notices, { query = "", audience = "", region = "", category = "", status = "open" } = {}, today = todayInKorea()) {
  const words = normal(query).split(/\s+/).filter(Boolean);
  return notices.filter((notice) => {
    if (audience && !notice.audience?.includes(audience)) return false;
    if (region && notice.region !== "전국" && notice.region !== region) return false;
    if (category && notice.category !== category) return false;
    if (status !== "all" && noticeStatus(notice, today) !== status) return false;
    const content = normal([
      notice.title, notice.summary, notice.agency, notice.region, categoryLabels[notice.category],
      ...(notice.audience ?? []).map((item) => audienceLabels[item])
    ].join(" "));
    return words.every((word) => content.includes(word));
  }).sort((a, b) => (isDate(a.end) ? a.end : "9999-12-31").localeCompare(isDate(b.end) ? b.end : "9999-12-31"));
}

const pageSize = 3;
const add = (tag, label = "", className = "") => {
  const node = document.createElement(tag);
  node.textContent = label;
  if (className) node.className = className;
  return node;
};
const httpLink = (value) => {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password) return url;
  } catch {}
  return null;
};
const displayDate = (date) => isDate(date) ? date.replaceAll("-", ".") : "";
const save = (filename, value) => {
  const file = new Blob(["\uFEFF", value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = add("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const get = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const put = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};
const legacyAnchors = new Set([
  "ai-office", "solutions", "network", "intelligence", "countrySelect", "topicSelect", "refreshNews", "worldMap",
  "countryShortcuts", "countryName", "countryFocus", "officialLinks", "countryRequest", "newsStatus", "newsList",
  "newsFallback", "growth", "contentLang", "downloadContent", "contentSlots", "readinessForm", "briefGoal",
  "briefStage", "briefCountry", "briefResult", "briefTitle", "briefSteps", "useBrief", "faq", "memberRequest",
  "company", "target", "requestedService", "requestDetails", "prepareEmail", "requestStatus"
]);
const preferredAnchors = new Map([
  ["wmm-support-map-embed", "support-search"], ["region-readiness", "preparation"]
]);

function redirectLegacy() {
  const language = new URLSearchParams(window.location.search).get("lang");
  let anchor = window.location.hash.slice(1);
  try { anchor = decodeURIComponent(anchor); } catch {}
  if (language === "en" || legacyAnchors.has(anchor)) {
    window.location.replace("/home-details" + window.location.search + window.location.hash);
    return true;
  }
  const updated = preferredAnchors.get(anchor);
  if (updated) {
    window.history.replaceState(null, "", "#" + updated);
    document.getElementById(updated)?.scrollIntoView();
  }
  return false;
}

function start() {
  const $ = (id) => document.getElementById(id);
  const form = $("support-form");
  const results = $("support-results");
  const status = $("support-count");
  const more = $("support-more");
  const reset = $("support-reset");
  const checklist = [...$("preparation-checks").querySelectorAll("input")];
  const defaultChecklistKey = "wmm-home:preparation";
  let active = null;
  let catalog = null;
  let shown = pageSize;

  function updateProgress() {
    const checked = checklist.filter((item) => item.checked).map((item) => item.value);
    $("check-progress").textContent = checked.length + " / " + checklist.length + " 확인";
    put(defaultChecklistKey + (active ? ":" + active.id : ""), checked);
  }

  function selectNotice(notice = null) {
    active = notice;
    const link = $("selected-source");
    const source = httpLink(notice?.url);
    $("selected-notice").textContent = notice?.title ?? "위에서 관심 공고를 선택하면 준비표에 표시됩니다.";
    link.hidden = !source;
    if (source) link.href = source;
    const saved = get(defaultChecklistKey + (notice ? ":" + notice.id : ""), []);
    checklist.forEach((item) => { item.checked = Array.isArray(saved) && saved.includes(item.value); });
    updateProgress();
  }

  function noticeCard(notice) {
    const kind = noticeStatus(notice);
    const card = add("article", "", "notice-card");
    const meta = add("div", "", "notice-meta");
    meta.append(add("span", notice.region + " · " + (categoryLabels[notice.category] ?? notice.category)), add("span", statusLabels[kind]));
    const date = isDate(notice.start) && isDate(notice.end)
      ? displayDate(notice.start) + " – " + displayDate(notice.end) : "신청 일정은 원문에서 확인";
    card.append(meta, add("h3", notice.title), add("p", notice.agency + " · " + notice.summary, "notice-copy"), add("p", date, "notice-date"));
    const links = add("div", "", "notice-links");
    const source = httpLink(notice.url);
    if (source) {
      const link = add("a", "공식 원문 ↗", "text-link");
      link.href = source;
      links.append(link);
    }
    const prepare = add("button", "이 공고 준비하기", "button button-outline");
    prepare.type = "button";
    prepare.addEventListener("click", () => {
      selectNotice(notice);
      $("readiness").scrollIntoView({ block: "start" });
      checklist[0].focus({ preventScroll: true });
    });
    links.append(prepare);
    card.append(links);
    return card;
  }

  function render() {
    if (!catalog) return;
    const filters = Object.fromEntries(new FormData(form));
    const found = findNotices(catalog.notices, { ...filters, query: filters.q });
    status.textContent = found.length + "건 · 원문 확인일 " + displayDate(catalog.checkedOn);
    reset.hidden = !filters.q && !filters.audience && !filters.region && !filters.category && filters.status === "open";
    more.hidden = found.length <= shown;
    results.replaceChildren(...found.slice(0, shown).map(noticeCard));
    if (found.length) return;
    const empty = add("div", "", "empty-state");
    empty.append(add("h3", "이 조건에서 확인된 공고가 없습니다."), add("p", "조건을 바꾸거나 관련 기관의 전체 모집공고를 검색해 보세요."));
    const links = add("div", "", "source-strip");
    (catalog.portals ?? []).filter((portal) => !filters.audience || portal.audience.includes(filters.audience)).forEach((portal) => {
      const url = httpLink(portal.url);
      if (!url) return;
      const link = add("a", portal.name + " ↗");
      link.href = url;
      links.append(link);
    });
    if (links.childElementCount) empty.append(links);
    results.append(empty);
  }

  const runSearch = () => { shown = pageSize; render(); };
  form.addEventListener("submit", (event) => { event.preventDefault(); runSearch(); });
  form.addEventListener("change", runSearch);
  $("support-query").addEventListener("search", runSearch);
  reset.addEventListener("click", () => { form.reset(); runSearch(); $("support-query").focus(); });
  more.addEventListener("click", () => {
    const previous = shown;
    shown += pageSize;
    render();
    if (more.hidden) results.children[previous]?.querySelector("a, button")?.focus();
  });
  fetch("/support-map/assets/wmm-support-catalog.json", { signal: AbortSignal.timeout?.(10000) })
    .then((response) => {
      if (!response.ok) throw Error("catalog unavailable");
      return response.json();
    }).then((data) => {
      if (!Array.isArray(data.notices)) throw Error("invalid catalog");
      catalog = data;
      runSearch();
    }).catch(() => {
      status.textContent = "현재 공고 검색을 불러올 수 없습니다. 아래 공식 포털과 원문 대조 목록을 이용하세요.";
    });

  checklist.forEach((item) => item.addEventListener("change", updateProgress));
  selectNotice();
  $("download-checklist").addEventListener("click", () => {
    const items = checklist.map((item) => (item.checked ? "[x] " : "[ ] ") + item.parentElement.textContent.trim());
    save("WMM-지원사업-신청준비표.txt", [
      "WMM 지원사업 신청 준비표", active?.title ?? "공고명: __________________", active?.url ?? "", "",
      ...items, "", "최종 자격과 제출서류는 기관의 공식 공고에서 확인하세요."
    ].join("\r\n"));
  });

  $("business-plan").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    save("WMM-1장-사업계획서-초안.txt", [
      "WMM 1장 사업계획서 초안", "사업명: " + data.get("name").trim(), "",
      "1. 고객과 문제\n" + data.get("problem").trim(),
      "2. 해결 방법\n" + data.get("solution").trim(),
      "3. 시장과 실행 계획\n" + data.get("growth").trim(),
      "4. 팀과 검증 자료\n" + (data.get("team").trim() || "작성 필요"), "",
      "제출 전 공고별 신청 양식, 분량, 증빙과 마감 시각을 확인하세요."
    ].join("\r\n\r\n"));
    const message = $("plan-status");
    message.textContent = "초안 파일 다운로드를 시작했습니다.";
    message.hidden = false;
  });

  const inquiry = $("wmm-inquiry");
  const detailsField = inquiry.elements.details;
  document.querySelectorAll("[data-inquiry-topic]").forEach((link) => {
    link.addEventListener("click", () => {
      inquiry.elements.topic.value = link.dataset.inquiryTopic;
    });
  });
  detailsField.addEventListener("input", () => detailsField.setCustomValidity(""));
  const validateDraft = () => {
    detailsField.setCustomValidity(detailsField.value.trim() ? "" : "문의 내용을 입력해 주세요.");
    return inquiry.reportValidity();
  };
  const draft = () => {
    const data = new FormData(inquiry);
    return { topic: "WMM 상담 문의 - " + data.get("topic"), details: data.get("details").trim() };
  };
  inquiry.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateDraft()) return;
    const { topic, details } = draft();
    save("WMM-상담-요청-초안.txt", topic + "\r\n\r\n" + details);
    $("inquiry-status").textContent = "문의 초안 파일 다운로드를 시작했습니다.";
  });
  $("inquiry-email").addEventListener("click", (event) => {
    if (!validateDraft()) { event.preventDefault(); return; }
    const { topic, details } = draft();
    event.currentTarget.href = "mailto:73036396@naver.com?subject=" + encodeURIComponent(topic) + "&body=" + encodeURIComponent(details);
  });
  document.querySelectorAll(".local-draft").forEach((fieldset) => { fieldset.disabled = false; });

  const newsStatus = $("news-feed-status");
  fetch("/api/wmm?resource=grants", { signal: AbortSignal.timeout?.(8000) })
    .then((response) => {
      if (!response.ok) throw Error("feed unavailable");
      return response.json();
    }).then((data) => {
      const items = (data.items ?? []).flatMap((item) => {
        const url = httpLink(item.url);
        if (!url || !/^(?:[a-z0-9-]+\.)*mss\.go\.kr$/i.test(url.hostname) || !item.title) return [];
        const line = add("li");
        const link = add("a", item.title);
        link.href = url;
        line.append(link);
        if (/^\d{14}$/.test(item.publishedAt)) {
          const date = item.publishedAt;
          line.append(add("small", "발행 " + date.slice(0, 4) + "." + date.slice(4, 6) + "." + date.slice(6, 8) + " · 접수기간은 원문 확인"));
        }
        return [line];
      }).slice(0, 4);
      if (!items.length || data.stale) throw Error("feed unavailable");
      $("official-news").replaceChildren(...items);
      const checked = new Date(data.checkedAt);
      if (Number.isFinite(checked.valueOf())) {
        newsStatus.textContent = "피드 확인 " + new Intl.DateTimeFormat("ko-KR", {
          timeZone: "Asia/Seoul", dateStyle: "medium", timeStyle: "short"
        }).format(checked) + " (한국시간)";
      }
    }).catch(() => {
      newsStatus.textContent = "자동 조회를 사용할 수 없습니다. 공식 게시판에서 최신 공고를 확인하세요.";
    });
}

if (typeof document !== "undefined" && document.getElementById("support-form") && !redirectLegacy()) start();
