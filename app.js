const CACHE_KEY = "ap_artworks_cache_v2";
const WISHLIST_STORAGE_KEY = "ap_wishlist_v1";
const VISITED_STORAGE_KEY = "ap_visited_v1";

let allArtworks = [];
let currentTab = "ARTWORKS"; // "ARTWORKS" | "ROUTES" | "MOVEMENTS" | "ARTISTS"
let selectedMovementFilter = "ALL";
let selectedRouteId = "route-2h";

// Personal travel checklist sets (persisted in localStorage)
let wishlistIds = new Set();
let visitedIds = new Set();

// TTS state
let ttsRate = 1.0;

const floorSelect = document.getElementById("floorSelect");
const roomSelect = document.getElementById("roomSelect");
const searchInput = document.getElementById("searchInput");
const koOnlyCheckbox = document.getElementById("koOnlyCheckbox");
const masterpieceOnlyCheckbox = document.getElementById("masterpieceOnlyCheckbox");
const artworkGrid = document.getElementById("artworkGrid");
const countText = document.getElementById("countText");
const updatedText = document.getElementById("updatedText");
const statusBadge = document.getElementById("statusBadge");

const detailModal = document.getElementById("detailModal");
const closeModalBtn = document.getElementById("closeModalBtn");

// --- Personal Checklist Storage Helpers ---
function loadUserLists() {
  try {
    const rawWish = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (rawWish) wishlistIds = new Set(JSON.parse(rawWish));
  } catch (_) {
    wishlistIds = new Set();
  }
  try {
    const rawVisited = localStorage.getItem(VISITED_STORAGE_KEY);
    if (rawVisited) visitedIds = new Set(JSON.parse(rawVisited));
  } catch (_) {
    visitedIds = new Set();
  }
}

function saveUserLists() {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(Array.from(wishlistIds)));
    localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify(Array.from(visitedIds)));
  } catch (_) {}
}

function toggleWishlist(inventoryId, e) {
  if (e) e.stopPropagation();
  const id = String(inventoryId);
  if (wishlistIds.has(id)) {
    wishlistIds.delete(id);
  } else {
    wishlistIds.add(id);
  }
  saveUserLists();
  refreshCurrentView();
}

function toggleVisited(inventoryId, e) {
  if (e) e.stopPropagation();
  const id = String(inventoryId);
  if (visitedIds.has(id)) {
    visitedIds.delete(id);
  } else {
    visitedIds.add(id);
  }
  saveUserLists();
  refreshCurrentView();
}

function refreshCurrentView() {
  if (currentTab === "ARTWORKS") {
    renderArtworks();
  } else if (currentTab === "ROUTES") {
    renderViewingRoutes();
  } else {
    renderArtHistoryGuide();
  }
}

// --- Room & Artwork Classification Helpers ---
function getFloorCategory(roomStr) {
  if (roomStr.startsWith("AP OG")) return "AP OG";
  if (roomStr.startsWith("AP EG")) return "AP EG";
  return "OTHER";
}

function simplifyRoomLabel(roomStr) {
  return roomStr.replace(/^AP\s+(OG|EG)\s*->\s*/, "");
}

function isMasterpiece(artwork) {
  return (
    artwork.needs_translation === false &&
    typeof artwork.description_ko === "string" &&
    artwork.description_ko.includes("핵심 걸작")
  );
}

function isNeuePinakothek(artwork) {
  if (artwork.collection === "NP" || artwork.collection === "Neue Pinakothek") return true;
  if (artwork.collection === "AP") return false;
  return /^AP\s+EG\s*->\s*(Saal\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)|Kabinett\s+([1-9]|1[0-5]))(\b|$)/.test(
    artwork.room || ""
  );
}

// Roman numeral <-> Arabic helper for quick room jump
const ROMAN_MAP = {
  "1": ["i"],
  "2": ["ii", "iia", "iib"],
  "3": ["iii"],
  "4": ["iv"],
  "5": ["v"],
  "6": ["vi"],
  "7": ["vii"],
  "8": ["viii"],
  "9": ["ix"],
  "10": ["x"],
  "11": ["xi"],
  "12": ["xii", "xiib"],
  "13": ["xiii"]
};

// --- Styles Injection ---
function injectAppStyles() {
  if (document.getElementById("ap-extended-styles")) return;
  const style = document.createElement("style");
  style.id = "ap-extended-styles";
  style.textContent = `
    .card.is-masterpiece {
      border: 2px solid #b8860b;
      background: linear-gradient(to bottom, #fffdf5, #ffffff);
      box-shadow: 0 4px 12px rgba(184, 134, 11, 0.16);
    }
    .card.is-np-loan {
      border-left: 4px solid #0f766e;
    }
    .card.is-visited {
      opacity: 0.84;
      background-color: #f8fafc;
    }
    .card-top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 6px;
      margin-bottom: 4px;
    }
    .card-action-group {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }
    .mini-action-btn {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #475569;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 6px;
      cursor: pointer;
      line-height: 1.3;
    }
    .mini-action-btn.active-wish {
      background: #fef3c7;
      border-color: #f59e0b;
      color: #b45309;
    }
    .mini-action-btn.active-visited {
      background: #dcfce7;
      border-color: #16a34a;
      color: #15803d;
    }
    .masterpiece-tag {
      display: inline-block;
      background-color: #b8860b;
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      margin-top: 6px;
      margin-right: 6px;
    }
    .np-tag {
      display: inline-block;
      background-color: #0f766e;
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      margin-top: 6px;
      margin-right: 6px;
    }
    .extra-filter-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      margin-top: 4px;
    }
    .ap-collection-select {
      padding: 5px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background-color: #ffffff;
      color: #1e293b;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
    }
    .badge-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
    }
    /* Quick Room Jump Bar */
    .ap-quick-jump-bar {
      display: none;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      padding: 6px 8px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
    }
    .ap-quick-jump-bar.visible {
      display: flex;
    }
    .ap-quick-jump-label {
      font-size: 11px;
      font-weight: 700;
      color: #1d4ed8;
    }
    .ap-quick-jump-btn {
      border: 1px solid #3b82f6;
      background: #ffffff;
      color: #1e40af;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      padding: 3px 10px;
      cursor: pointer;
    }
    /* Adjacent Room Navigator */
    .ap-room-nav-bar {
      display: none;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin: 8px 16px 4px;
      padding: 8px 10px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
    }
    .ap-room-nav-bar.visible {
      display: flex;
    }
    .ap-room-nav-btn {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #1e293b;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 10px;
      cursor: pointer;
      white-space: nowrap;
      max-width: 36%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ap-room-nav-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .ap-room-nav-current {
      font-size: 12px;
      font-weight: 700;
      color: #1a365d;
      text-align: center;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* Navigation Tabs */
    .ap-nav-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 12px 16px 12px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
    }
    .ap-nav-tab-btn {
      padding: 7px 13px;
      border: 1px solid #cbd5e1;
      background-color: #f8fafc;
      color: #334155;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .ap-nav-tab-btn:hover {
      background-color: #e2e8f0;
    }
    .ap-nav-tab-btn.active {
      background-color: #1e293b;
      color: #ffffff;
      border-color: #1e293b;
    }
    .ap-guide-section {
      display: none;
      flex-direction: column;
      gap: 18px;
      margin: 8px 16px 0;
    }
    .ap-guide-section.active {
      display: flex;
    }
    .ap-movement-filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 6px;
    }
    .ap-filter-chip {
      padding: 5px 11px;
      border-radius: 999px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .ap-filter-chip.active {
      background: #1e293b;
      color: #ffffff;
      border-color: #1e293b;
    }
    .ap-guide-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
    }
    .ap-guide-card-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 10px;
    }
    .ap-guide-card-title {
      font-size: 1.12rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .ap-guide-card-sub {
      font-size: 0.85rem;
      color: #64748b;
      margin-top: 2px;
    }
    .ap-guide-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .ap-pill {
      font-size: 0.75rem;
      padding: 3px 9px;
      border-radius: 999px;
      background: #f1f5f9;
      color: #334155;
      font-weight: 600;
    }
    .ap-guide-summary {
      font-size: 0.92rem;
      color: #334155;
      line-height: 1.6;
      margin: 8px 0 12px;
    }
    .ap-guide-features {
      margin: 0 0 14px 18px;
      padding: 0;
      color: #475569;
      font-size: 0.86rem;
      line-height: 1.55;
    }
    .ap-linked-works-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }
    .ap-linked-works-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 8px;
    }
    .ap-work-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #f8fafc;
      cursor: pointer;
      transition: background 0.15s ease, border-color 0.15s ease;
    }
    .ap-work-chip:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
    .ap-work-chip.is-masterpiece {
      border-color: #d4af37;
      background: #fffdf5;
    }
    .ap-work-chip.is-np-loan {
      border-left: 3px solid #0f766e;
    }
    .ap-work-chip img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .ap-work-chip-info {
      min-width: 0;
      flex: 1;
    }
    .ap-work-chip-title {
      font-size: 0.82rem;
      font-weight: 600;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ap-work-chip-meta {
      font-size: 0.74rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Route Timeline Step */
    .ap-route-step {
      position: relative;
      padding: 14px 16px;
      margin-top: 12px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #1a365d;
    }
    .ap-route-step-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    }
    .ap-route-step-badge {
      font-size: 0.78rem;
      font-weight: 700;
      color: #ffffff;
      background: #1a365d;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .ap-route-step-room {
      font-size: 0.85rem;
      font-weight: 700;
      color: #1e293b;
    }
    .ap-route-step-title {
      font-size: 0.98rem;
      font-weight: 700;
      color: #0f172a;
      margin: 4px 0 6px;
    }
    .ap-route-step-desc {
      font-size: 0.88rem;
      color: #334155;
      line-height: 1.55;
      margin: 0 0 10px;
    }
    /* Modal Checklist & TTS Audio Player */
    .modal-personal-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }
    .modal-personal-btn {
      flex: 1;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #334155;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .modal-personal-btn.active-wish {
      background: #fef3c7;
      border-color: #f59e0b;
      color: #b45309;
    }
    .modal-personal-btn.active-visited {
      background: #dcfce7;
      border-color: #16a34a;
      color: #15803d;
    }
    .modal-tts-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      margin-bottom: 10px;
      padding: 8px 10px;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 8px;
    }
    .tts-btn {
      border: 1px solid #4f46e5;
      background: #4f46e5;
      color: #ffffff;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      padding: 5px 10px;
      cursor: pointer;
    }
    .tts-btn.secondary {
      background: #ffffff;
      color: #3730a3;
    }
    .tts-status {
      font-size: 11px;
      color: #4338ca;
      margin-left: auto;
      font-weight: 600;
    }
    .modal-credit-box {
      margin-top: 8px;
      margin-bottom: 12px;
      padding: 6px 10px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.78rem;
      color: #475569;
      line-height: 1.45;
    }
    .modal-credit-box a {
      color: #2563eb;
      text-decoration: underline;
    }
    .ap-license-footer {
      margin-top: 32px;
      padding: 18px 16px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 0.8rem;
      color: #64748b;
      line-height: 1.6;
    }
    .ap-license-footer a {
      color: #334155;
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);
}

// --- Dynamic Filter & Navigation UI Controls ---
function ensureExtendedFilterControls() {
  if (!koOnlyCheckbox) return;

  const parentLabel = koOnlyCheckbox.closest("label");
  const controlsContainer = parentLabel?.parentElement;
  if (!controlsContainer) return;

  let extraRow = document.getElementById("apExtraFilterRow");
  if (!extraRow) {
    extraRow = document.createElement("div");
    extraRow.id = "apExtraFilterRow";
    extraRow.className = "extra-filter-row";
    controlsContainer.appendChild(extraRow);
  }

  // 1. Masterpiece filter
  if (!document.getElementById("masterpieceOnlyCheckbox")) {
    const mpLabel = document.createElement("label");
    mpLabel.className = "filter-toggle";
    mpLabel.style.cursor = "pointer";
    const mpCb = document.createElement("input");
    mpCb.type = "checkbox";
    mpCb.id = "masterpieceOnlyCheckbox";
    mpCb.onchange = renderArtworks;
    mpLabel.appendChild(mpCb);
    mpLabel.appendChild(document.createTextNode(" 핵심 걸작만"));
    extraRow.appendChild(mpLabel);
  }

  // 2. Wishlist filter
  if (!document.getElementById("wishlistOnlyCheckbox")) {
    const wishLabel = document.createElement("label");
    wishLabel.className = "filter-toggle";
    wishLabel.style.cursor = "pointer";
    const wishCb = document.createElement("input");
    wishCb.type = "checkbox";
    wishCb.id = "wishlistOnlyCheckbox";
    wishCb.onchange = renderArtworks;
    wishLabel.appendChild(wishCb);
    wishLabel.appendChild(document.createTextNode(" ☆ 위시리스트만"));
    extraRow.appendChild(wishLabel);
  }

  // 3. Collection filter
  if (!document.getElementById("collectionSelect")) {
    const select = document.createElement("select");
    select.id = "collectionSelect";
    select.className = "ap-collection-select";
    select.setAttribute("aria-label", "소장처 필터");
    select.innerHTML = `
      <option value="ALL">전체 소장처 (AP + NP)</option>
      <option value="AP">알테 피나코테크 (14~18세기)</option>
      <option value="NP">노이 피나코테크 임시전시 (19세기)</option>
    `;
    select.onchange = () => {
      populateRoomOptions();
      renderArtworks();
    };
    extraRow.appendChild(select);
  }

  // 4. Quick Room Jump Bar right below searchInput
  if (!document.getElementById("apQuickJumpBar") && searchInput) {
    const jumpBar = document.createElement("div");
    jumpBar.id = "apQuickJumpBar";
    jumpBar.className = "ap-quick-jump-bar";
    searchInput.parentNode.insertBefore(jumpBar, searchInput.nextSibling);
  }
}

function ensureNavigationAndGuideContainers() {
  if (!artworkGrid || !artworkGrid.parentNode) return;

  if (!document.getElementById("apNavTabs")) {
    const navBar = document.createElement("nav");
    navBar.id = "apNavTabs";
    navBar.className = "ap-nav-tabs";
    navBar.setAttribute("aria-label", "콘텐츠 보기 전환");

    const tabs = [
      { id: "ARTWORKS", label: "작품 목록" },
      { id: "ROUTES", label: "추천 관람 동선" },
      { id: "MOVEMENTS", label: "미술 사조별 해설" },
      { id: "ARTISTS", label: "작가별 개요" }
    ];

    tabs.forEach((tab) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = tab.id === currentTab ? "ap-nav-tab-btn active" : "ap-nav-tab-btn";
      btn.dataset.tabId = tab.id;
      btn.textContent = tab.label;
      btn.onclick = () => switchTab(tab.id);
      navBar.appendChild(btn);
    });

    artworkGrid.parentNode.insertBefore(navBar, artworkGrid);
  }

  if (!document.getElementById("apRoomNavBar")) {
    const roomNav = document.createElement("div");
    roomNav.id = "apRoomNavBar";
    roomNav.className = "ap-room-nav-bar";
    artworkGrid.parentNode.insertBefore(roomNav, artworkGrid);
  }

  if (!document.getElementById("apGuideSection")) {
    const guideSection = document.createElement("section");
    guideSection.id = "apGuideSection";
    guideSection.className = "ap-guide-section";
    artworkGrid.parentNode.insertBefore(guideSection, artworkGrid.nextSibling);
  }
}

function switchTab(tabId) {
  currentTab = tabId;

  const tabBtns = document.querySelectorAll(".ap-nav-tab-btn");
  tabBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tabId === tabId);
  });

  const guideSection = document.getElementById("apGuideSection");
  const roomNav = document.getElementById("apRoomNavBar");
  const filterControls = [
    floorSelect,
    roomSelect,
    koOnlyCheckbox,
    document.getElementById("masterpieceOnlyCheckbox"),
    document.getElementById("wishlistOnlyCheckbox"),
    document.getElementById("collectionSelect")
  ];

  if (tabId === "ARTWORKS") {
    artworkGrid.style.display = "";
    if (guideSection) guideSection.classList.remove("active");
    filterControls.forEach((el) => {
      if (el) el.disabled = false;
    });
    renderArtworks();
  } else {
    artworkGrid.style.display = "none";
    if (roomNav) roomNav.classList.remove("visible");
    if (guideSection) guideSection.classList.add("active");
    filterControls.forEach((el) => {
      if (el) el.disabled = true;
    });
    if (tabId === "ROUTES") {
      renderViewingRoutes();
    } else {
      renderArtHistoryGuide();
    }
  }
}

function ensureLicenseFooter() {
  if (document.getElementById("apLicenseFooter")) return;

  const footer = document.createElement("footer");
  footer.id = "apLicenseFooter";
  footer.className = "ap-license-footer";
  footer.innerHTML = `
    <div>
      이미지 출처: <strong>Bayerische Staatsgemäldesammlungen</strong>
      (<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.ko" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>)
      · 원본 소장품 데이터:
      <a href="https://www.sammlung.pinakothek.de/en" target="_blank" rel="noopener noreferrer">Sammlung Pinakothek</a>
    </div>
    <div>
      본 페이지는 알테 피나코테크(Alte Pinakothek)의 공식 서비스가 아닌 개인 비영리 관람 가이드입니다.
    </div>
  `;

  const container = artworkGrid?.parentElement || document.body;
  container.appendChild(footer);
}

// --- Room Options, Quick Jump & Adjacent Room Navigation ---
function getSortedRoomsList(selectedFloor = "ALL", selectedCollection = "ALL") {
  const rooms = new Set();
  allArtworks.forEach((item) => {
    const isNp = isNeuePinakothek(item);
    if (selectedCollection === "AP" && isNp) return;
    if (selectedCollection === "NP" && !isNp) return;

    const floor = getFloorCategory(item.room);
    if (selectedFloor === "ALL" || floor === selectedFloor) {
      rooms.add(item.room);
    }
  });
  return Array.from(rooms).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function populateRoomOptions() {
  const selectedFloor = floorSelect.value;
  const selectedCollection = document.getElementById("collectionSelect")?.value || "ALL";
  const prevRoom = roomSelect.value;
  const sortedRooms = getSortedRoomsList(selectedFloor, selectedCollection);

  roomSelect.innerHTML = '<option value="ALL">전체 전시실 (' + sortedRooms.length + "개)</option>";

  sortedRooms.forEach((room) => {
    const opt = document.createElement("option");
    opt.value = room;
    opt.textContent = selectedFloor === "ALL" ? room.replace(/^AP\s+/, "") : simplifyRoomLabel(room);
    roomSelect.appendChild(opt);
  });

  if (sortedRooms.includes(prevRoom)) {
    roomSelect.value = prevRoom;
  }
}

function updateQuickRoomJumpBar(rawQuery) {
  const jumpBar = document.getElementById("apQuickJumpBar");
  if (!jumpBar) return;

  const q = rawQuery.trim().toLowerCase();
  if (!q || q.length > 15) {
    jumpBar.classList.remove("visible");
    jumpBar.innerHTML = "";
    return;
  }

  const allRooms = getSortedRoomsList("ALL", "ALL");
  const romanTargets = ROMAN_MAP[q] || [];

  const matchedRooms = allRooms.filter((room) => {
    const simple = simplifyRoomLabel(room).toLowerCase();
    if (simple.includes(q)) return true;
    if (romanTargets.length > 0) {
      return romanTargets.some((rom) => new RegExp(`\\bsaal\\s+${rom}\\b`, "i").test(simple));
    }
    return false;
  });

  if (matchedRooms.length === 0 || matchedRooms.length > 6) {
    jumpBar.classList.remove("visible");
    jumpBar.innerHTML = "";
    return;
  }

  jumpBar.innerHTML = '<span class="ap-quick-jump-label">전시실 빠른 이동:</span>';
  matchedRooms.forEach((room) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ap-quick-jump-btn";
    btn.textContent = room.replace(/^AP\s+/, "");
    btn.onclick = () => {
      if (currentTab !== "ARTWORKS") switchTab("ARTWORKS");
      floorSelect.value = "ALL";
      const colSel = document.getElementById("collectionSelect");
      if (colSel) colSel.value = "ALL";
      populateRoomOptions();
      roomSelect.value = room;
      searchInput.value = "";
      jumpBar.classList.remove("visible");
      renderArtworks();
    };
    jumpBar.appendChild(btn);
  });
  jumpBar.classList.add("visible");
}

function updateAdjacentRoomNav() {
  const navBar = document.getElementById("apRoomNavBar");
  if (!navBar) return;

  const currentRoom = roomSelect.value;
  if (currentTab !== "ARTWORKS" || currentRoom === "ALL") {
    navBar.classList.remove("visible");
    return;
  }

  const selectedFloor = floorSelect.value;
  const selectedCollection = document.getElementById("collectionSelect")?.value || "ALL";
  const rooms = getSortedRoomsList(selectedFloor, selectedCollection);
  const idx = rooms.indexOf(currentRoom);

  if (idx === -1) {
    navBar.classList.remove("visible");
    return;
  }

  const prevRoom = idx > 0 ? rooms[idx - 1] : null;
  const nextRoom = idx < rooms.length - 1 ? rooms[idx + 1] : null;

  navBar.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "ap-room-nav-btn";
  prevBtn.disabled = !prevRoom;
  prevBtn.textContent = prevRoom ? `← ${simplifyRoomLabel(prevRoom)}` : "← 첫 전시실";
  if (prevRoom) {
    prevBtn.onclick = () => {
      roomSelect.value = prevRoom;
      renderArtworks();
    };
  }

  const currentLabel = document.createElement("div");
  currentLabel.className = "ap-room-nav-current";
  currentLabel.textContent = currentRoom.replace(/^AP\s+/, "");

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "ap-room-nav-btn";
  nextBtn.disabled = !nextRoom;
  nextBtn.textContent = nextRoom ? `${simplifyRoomLabel(nextRoom)} →` : "마지막 전시실 →";
  if (nextRoom) {
    nextBtn.onclick = () => {
      roomSelect.value = nextRoom;
      renderArtworks();
    };
  }

  navBar.appendChild(prevBtn);
  navBar.appendChild(currentLabel);
  navBar.appendChild(nextBtn);
  navBar.classList.add("visible");
}

// --- Shared Work Chip for Guide & Route Tabs ---
function createWorkChipElement(work) {
  const highlight = isMasterpiece(work);
  const isNp = isNeuePinakothek(work);
  const idStr = String(work.inventory_id);
  const isWished = wishlistIds.has(idStr);
  const isDone = visitedIds.has(idStr);

  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = [
    "ap-work-chip",
    highlight ? "is-masterpiece" : "",
    isNp ? "is-np-loan" : ""
  ]
    .filter(Boolean)
    .join(" ");
  chip.onclick = () => openModal(work);

  if (work.thumb_url) {
    const thumb = document.createElement("img");
    thumb.loading = "lazy";
    thumb.src = work.thumb_url;
    thumb.alt = work.title_ko || work.title_en;
    chip.appendChild(thumb);
  }

  const info = document.createElement("div");
  info.className = "ap-work-chip-info";

  const titleEl = document.createElement("div");
  titleEl.className = "ap-work-chip-title";
  const statusPrefix = (isDone ? "✓ " : "") + (isWished ? "♥ " : highlight ? "★ " : "");
  titleEl.textContent = statusPrefix + (work.title_ko || work.title_en);

  const metaEl = document.createElement("div");
  metaEl.className = "ap-work-chip-meta";
  const npPrefix = isNp ? "[NP] " : "";
  metaEl.textContent = `${npPrefix}${work.artist_ko || work.artist_en} · ${simplifyRoomLabel(work.room)}`;

  info.appendChild(titleEl);
  info.appendChild(metaEl);
  chip.appendChild(info);

  return chip;
}

// --- Viewing Routes Tab ---
function renderViewingRoutes() {
  const guideSection = document.getElementById("apGuideSection");
  if (!guideSection) return;

  if (typeof VIEWING_ROUTES === "undefined") {
    guideSection.innerHTML =
      '<div class="ap-guide-card">viewingRoutesMaster.js 데이터가 로드되지 않았습니다. index.html에 스크립트를 추가해주세요.</div>';
    return;
  }

  const query = searchInput.value.trim().toLowerCase();
  guideSection.innerHTML = "";

  const selectorBar = document.createElement("div");
  selectorBar.className = "ap-movement-filter-bar";

  VIEWING_ROUTES.forEach((route) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = selectedRouteId === route.id ? "ap-filter-chip active" : "ap-filter-chip";
    btn.textContent = route.durationBadge;
    btn.onclick = () => {
      selectedRouteId = route.id;
      renderViewingRoutes();
    };
    selectorBar.appendChild(btn);
  });

  guideSection.appendChild(selectorBar);

  const activeRoute = VIEWING_ROUTES.find((r) => r.id === selectedRouteId) || VIEWING_ROUTES[0];
  countText.textContent = `${activeRoute.durationBadge} · 총 ${activeRoute.steps.length}개 구간 동선 (찜 ${wishlistIds.size}점 · 완료 ${visitedIds.size}점)`;

  const card = document.createElement("article");
  card.className = "ap-guide-card";

  const header = document.createElement("div");
  header.className = "ap-guide-card-header";

  const titleWrap = document.createElement("div");
  const h2 = document.createElement("h2");
  h2.className = "ap-guide-card-title";
  h2.textContent = activeRoute.title;

  const sub = document.createElement("div");
  sub.className = "ap-guide-card-sub";
  sub.textContent = `추천 대상: ${activeRoute.targetAudience}`;

  titleWrap.appendChild(h2);
  titleWrap.appendChild(sub);

  const badges = document.createElement("div");
  badges.className = "ap-guide-badges";
  badges.innerHTML = `<span class="ap-pill">${activeRoute.durationBadge}</span>`;

  header.appendChild(titleWrap);
  header.appendChild(badges);

  const summary = document.createElement("p");
  summary.className = "ap-guide-summary";
  summary.textContent = activeRoute.summary;

  const tipsList = document.createElement("ul");
  tipsList.className = "ap-guide-features";
  activeRoute.tips.forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });

  card.appendChild(header);
  card.appendChild(summary);
  card.appendChild(tipsList);

  activeRoute.steps.forEach((step) => {
    const stepBox = document.createElement("div");
    stepBox.className = "ap-route-step";

    const stepHeader = document.createElement("div");
    stepHeader.className = "ap-route-step-header";
    stepHeader.innerHTML = `
      <span class="ap-route-step-badge">STEP ${step.stepNumber} · ${step.estimatedTime}</span>
      <span class="ap-route-step-room">${step.roomLabel}</span>
    `;

    const stepTitle = document.createElement("div");
    stepTitle.className = "ap-route-step-title";
    stepTitle.textContent = step.focusTitle;

    const stepDesc = document.createElement("p");
    stepDesc.className = "ap-route-step-desc";
    stepDesc.textContent = step.description;

    stepBox.appendChild(stepHeader);
    stepBox.appendChild(stepTitle);
    stepBox.appendChild(stepDesc);

    const lowerArtists = step.featuredArtists.map((a) => a.toLowerCase());
    let matchedWorks = allArtworks.filter((art) => {
      const en = (art.artist_en || "").toLowerCase();
      if (!lowerArtists.includes(en)) return false;
      if (query) {
        const hay = [art.title_ko, art.title_en, art.artist_ko, art.artist_en, art.room]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      }
      return true;
    });

    matchedWorks.sort((a, b) => {
      const scoreA =
        (wishlistIds.has(String(a.inventory_id)) ? 4 : 0) +
        (isMasterpiece(a) ? 2 : 0) +
        (a.description_ko ? 1 : 0);
      const scoreB =
        (wishlistIds.has(String(b.inventory_id)) ? 4 : 0) +
        (isMasterpiece(b) ? 2 : 0) +
        (b.description_ko ? 1 : 0);
      return scoreB - scoreA;
    });
    const displayWorks = matchedWorks.slice(0, 6);

    if (displayWorks.length > 0) {
      const worksTitle = document.createElement("div");
      worksTitle.className = "ap-linked-works-title";
      worksTitle.textContent = `이 구간의 추천 전시작 (클릭 시 도슨트 해설 보기)`;

      const worksGrid = document.createElement("div");
      worksGrid.className = "ap-linked-works-grid";
      displayWorks.forEach((work) => {
        worksGrid.appendChild(createWorkChipElement(work));
      });

      stepBox.appendChild(worksTitle);
      stepBox.appendChild(worksGrid);
    }

    card.appendChild(stepBox);
  });

  guideSection.appendChild(card);
}

// --- Art History Guide Tab (Movements & Artists) ---
function renderArtHistoryGuide() {
  const guideSection = document.getElementById("apGuideSection");
  if (!guideSection) return;

  if (typeof ART_MOVEMENTS === "undefined" || typeof ARTISTS_MASTER === "undefined") {
    guideSection.innerHTML =
      '<div class="ap-guide-card">artHistoryMaster.js 데이터가 로드되지 않았습니다. index.html에 스크립트를 추가해주세요.</div>';
    return;
  }

  const query = searchInput.value.trim().toLowerCase();
  const guideEligibleWorks = allArtworks.filter(
    (art) => art.needs_translation === false || Boolean(art.description_ko) || isNeuePinakothek(art)
  );

  const artistToMovement = {};
  ARTISTS_MASTER.forEach((artist) => {
    if (artist.artistKo) artistToMovement[artist.artistKo] = artist.movementId;
    if (artist.artistEn) artistToMovement[artist.artistEn.toLowerCase()] = artist.movementId;
  });

  const getWorkMovementId = (art) =>
    artistToMovement[art.artist_ko] || artistToMovement[(art.artist_en || "").toLowerCase()];

  guideSection.innerHTML = "";

  if (currentTab === "MOVEMENTS") {
    const matchedMovements = ART_MOVEMENTS.filter((mov) => {
      if (!query) return true;
      const hay = [mov.nameKo, mov.nameEn, mov.period, mov.rooms, mov.summary, ...mov.characteristics]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });

    countText.textContent = `미술 사조 ${matchedMovements.length}개 표시 (연계 작품 ${guideEligibleWorks.length}점)`;

    matchedMovements.forEach((mov) => {
      const linkedWorks = guideEligibleWorks.filter((art) => getWorkMovementId(art) === mov.id);

      const card = document.createElement("article");
      card.className = "ap-guide-card";

      const header = document.createElement("div");
      header.className = "ap-guide-card-header";

      const titleWrap = document.createElement("div");
      const h2 = document.createElement("h2");
      h2.className = "ap-guide-card-title";
      h2.textContent = mov.nameKo;

      const sub = document.createElement("div");
      sub.className = "ap-guide-card-sub";
      sub.textContent = mov.nameEn;

      titleWrap.appendChild(h2);
      titleWrap.appendChild(sub);

      const badges = document.createElement("div");
      badges.className = "ap-guide-badges";
      badges.innerHTML = `
        <span class="ap-pill">${mov.period}</span>
        <span class="ap-pill">주요 전시실: ${mov.rooms}</span>
      `;

      header.appendChild(titleWrap);
      header.appendChild(badges);

      const summary = document.createElement("p");
      summary.className = "ap-guide-summary";
      summary.textContent = mov.summary;

      const ul = document.createElement("ul");
      ul.className = "ap-guide-features";
      mov.characteristics.forEach((feat) => {
        const li = document.createElement("li");
        li.textContent = feat;
        ul.appendChild(li);
      });

      card.appendChild(header);
      card.appendChild(summary);
      card.appendChild(ul);

      if (linkedWorks.length > 0) {
        const worksTitle = document.createElement("div");
        worksTitle.className = "ap-linked-works-title";
        worksTitle.textContent = `주요 전시작 (${linkedWorks.length}점 · 클릭 시 상세 정보 보기)`;

        const worksGrid = document.createElement("div");
        worksGrid.className = "ap-linked-works-grid";
        linkedWorks.forEach((work) => {
          worksGrid.appendChild(createWorkChipElement(work));
        });

        card.appendChild(worksTitle);
        card.appendChild(worksGrid);
      }

      guideSection.appendChild(card);
    });
  } else if (currentTab === "ARTISTS") {
    const filterBar = document.createElement("div");
    filterBar.className = "ap-movement-filter-bar";

    const allChip = document.createElement("button");
    allChip.type = "button";
    allChip.className = selectedMovementFilter === "ALL" ? "ap-filter-chip active" : "ap-filter-chip";
    allChip.textContent = `전체 사조 (${ARTISTS_MASTER.length}명)`;
    allChip.onclick = () => {
      selectedMovementFilter = "ALL";
      renderArtHistoryGuide();
    };
    filterBar.appendChild(allChip);

    ART_MOVEMENTS.forEach((mov) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = selectedMovementFilter === mov.id ? "ap-filter-chip active" : "ap-filter-chip";
      btn.textContent = mov.nameKo.split(" (")[0];
      btn.onclick = () => {
        selectedMovementFilter = mov.id;
        renderArtHistoryGuide();
      };
      filterBar.appendChild(btn);
    });

    guideSection.appendChild(filterBar);

    const matchedArtists = ARTISTS_MASTER.filter((artist) => {
      if (selectedMovementFilter !== "ALL" && artist.movementId !== selectedMovementFilter) {
        return false;
      }
      if (query) {
        const hay = [artist.artistKo, artist.artistEn, artist.origin, artist.bio].join(" ").toLowerCase();
        return hay.includes(query);
      }
      return true;
    });

    countText.textContent = `주요 작가 ${matchedArtists.length}명 표시 (전체 ${ARTISTS_MASTER.length}명)`;

    matchedArtists.forEach((artist) => {
      const movement = ART_MOVEMENTS.find((m) => m.id === artist.movementId);
      const artistWorks = guideEligibleWorks.filter(
        (art) =>
          art.artist_ko === artist.artistKo ||
          (art.artist_en && art.artist_en.toLowerCase() === artist.artistEn.toLowerCase())
      );

      const card = document.createElement("article");
      card.className = "ap-guide-card";

      const header = document.createElement("div");
      header.className = "ap-guide-card-header";

      const titleWrap = document.createElement("div");
      const h2 = document.createElement("h2");
      h2.className = "ap-guide-card-title";
      h2.textContent = artist.artistKo;

      const sub = document.createElement("div");
      sub.className = "ap-guide-card-sub";
      sub.textContent = `${artist.artistEn} (${artist.lifespan})`;

      titleWrap.appendChild(h2);
      titleWrap.appendChild(sub);

      const badges = document.createElement("div");
      badges.className = "ap-guide-badges";
      badges.innerHTML = `
        <span class="ap-pill">${artist.origin}</span>
        ${movement ? `<span class="ap-pill">${movement.nameKo.split(" (")[0]}</span>` : ""}
      `;

      header.appendChild(titleWrap);
      header.appendChild(badges);

      const bio = document.createElement("p");
      bio.className = "ap-guide-summary";
      bio.textContent = artist.bio;

      card.appendChild(header);
      card.appendChild(bio);

      if (artistWorks.length > 0) {
        const worksTitle = document.createElement("div");
        worksTitle.className = "ap-linked-works-title";
        worksTitle.textContent = `주요 전시작 (${artistWorks.length}점 · 클릭 시 상세 정보 보기)`;

        const worksGrid = document.createElement("div");
        worksGrid.className = "ap-linked-works-grid";
        artistWorks.forEach((work) => {
          worksGrid.appendChild(createWorkChipElement(work));
        });

        card.appendChild(worksTitle);
        card.appendChild(worksGrid);
      }

      guideSection.appendChild(card);
    });
  }
}

// --- Main Artworks List Tab ---
function renderArtworks() {
  updateQuickRoomJumpBar(searchInput.value);

  if (currentTab === "ROUTES") {
    renderViewingRoutes();
    return;
  }
  if (currentTab !== "ARTWORKS") {
    renderArtHistoryGuide();
    return;
  }

  updateAdjacentRoomNav();

  const floorVal = floorSelect.value;
  const roomVal = roomSelect.value;
  const query = searchInput.value.trim().toLowerCase();
  const koOnly = koOnlyCheckbox.checked;
  const mpCheckbox = document.getElementById("masterpieceOnlyCheckbox");
  const masterpieceOnly = mpCheckbox ? mpCheckbox.checked : false;
  const wishCheckbox = document.getElementById("wishlistOnlyCheckbox");
  const wishlistOnly = wishCheckbox ? wishCheckbox.checked : false;
  const collectionVal = document.getElementById("collectionSelect")?.value || "ALL";

  const filtered = allArtworks.filter((item) => {
    const isNp = isNeuePinakothek(item);
    const idStr = String(item.inventory_id);

    if (collectionVal === "AP" && isNp) return false;
    if (collectionVal === "NP" && !isNp) return false;
    if (floorVal !== "ALL" && getFloorCategory(item.room) !== floorVal) return false;
    if (roomVal !== "ALL" && item.room !== roomVal) return false;
    if (koOnly && !item.description_ko) return false;
    if (masterpieceOnly && !isMasterpiece(item)) return false;
    if (wishlistOnly && !wishlistIds.has(idStr)) return false;

    if (query) {
      const hay = [
        item.title_en,
        item.title_ko,
        item.artist_en,
        item.artist_ko,
        item.room,
        item.inventory_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  const masterpieceCount = filtered.filter(isMasterpiece).length;
  countText.textContent = `${filtered.length}점 표시 (전체 ${allArtworks.length}점 · 걸작 ${masterpieceCount}점 · 찜 ${wishlistIds.size}점 · 완료 ${visitedIds.size}점)`;
  artworkGrid.innerHTML = "";

  const fragment = document.createDocumentFragment();
  filtered.forEach((item) => {
    const highlight = isMasterpiece(item);
    const isNp = isNeuePinakothek(item);
    const idStr = String(item.inventory_id);
    const isWished = wishlistIds.has(idStr);
    const isDone = visitedIds.has(idStr);

    const card = document.createElement("article");
    card.className = [
      "card",
      highlight ? "is-masterpiece" : "",
      isNp ? "is-np-loan" : "",
      isDone ? "is-visited" : ""
    ]
      .filter(Boolean)
      .join(" ");
    card.onclick = () => openModal(item);

    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = item.thumb_url || "";
    img.alt = item.title_ko || item.title_en;

    const body = document.createElement("div");
    body.className = "card-body";

    const topDiv = document.createElement("div");

    const topRow = document.createElement("div");
    topRow.className = "card-top-row";

    const roomTag = document.createElement("span");
    roomTag.className = "room-tag";
    roomTag.textContent = item.room.replace(/^AP\s+/, "");

    const actionGroup = document.createElement("div");
    actionGroup.className = "card-action-group";

    const wishBtn = document.createElement("button");
    wishBtn.type = "button";
    wishBtn.className = isWished ? "mini-action-btn active-wish" : "mini-action-btn";
    wishBtn.textContent = isWished ? "★ 찜" : "☆ 찜";
    wishBtn.onclick = (e) => toggleWishlist(idStr, e);

    const doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.className = isDone ? "mini-action-btn active-visited" : "mini-action-btn";
    doneBtn.textContent = isDone ? "✓ 완료" : "관람";
    doneBtn.onclick = (e) => toggleVisited(idStr, e);

    actionGroup.appendChild(wishBtn);
    actionGroup.appendChild(doneBtn);

    topRow.appendChild(roomTag);
    topRow.appendChild(actionGroup);

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = item.title_ko ? `${item.title_ko} (${item.title_en})` : item.title_en;

    topDiv.appendChild(topRow);
    topDiv.appendChild(title);

    const bottomDiv = document.createElement("div");
    const artist = document.createElement("div");
    artist.className = "artist";
    const artistName = item.artist_ko ? `${item.artist_ko} (${item.artist_en})` : item.artist_en;
    artist.textContent = item.date_en ? `${artistName} · ${item.date_en}` : artistName;
    bottomDiv.appendChild(artist);

    if (highlight || isNp || item.description_ko) {
      const badgeRow = document.createElement("div");
      badgeRow.className = "badge-row";

      if (highlight) {
        const mpBadge = document.createElement("span");
        mpBadge.className = "masterpiece-tag";
        mpBadge.textContent = "★ 핵심 걸작";
        badgeRow.appendChild(mpBadge);
      }

      if (isNp) {
        const npBadge = document.createElement("span");
        npBadge.className = "np-tag";
        npBadge.textContent = "노이 피나코테크";
        badgeRow.appendChild(npBadge);
      }

      if (item.description_ko) {
        const koBadge = document.createElement("div");
        koBadge.className = "ko-tag";
        koBadge.textContent = "● 한글 해설";
        badgeRow.appendChild(koBadge);
      }

      bottomDiv.appendChild(badgeRow);
    }

    body.appendChild(topDiv);
    body.appendChild(bottomDiv);
    card.appendChild(img);
    card.appendChild(body);
    fragment.appendChild(card);
  });

  artworkGrid.appendChild(fragment);
}

// --- Modal: Credit, Personal Checklist & Offline TTS Audio Guide ---
function stopSpeech() {
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}

function updateModalCredit(item) {
  const modalImg = document.getElementById("modalImg");
  if (!modalImg || !modalImg.parentNode) return;

  let creditBox = document.getElementById("modalCreditBox");
  if (!creditBox) {
    creditBox = document.createElement("div");
    creditBox.id = "modalCreditBox";
    creditBox.className = "modal-credit-box";
    modalImg.parentNode.insertBefore(creditBox, modalImg.nextSibling);
  }

  if (!item.thumb_url) {
    creditBox.style.display = "none";
    return;
  }

  creditBox.style.display = "block";
  creditBox.innerHTML = "";
  creditBox.appendChild(document.createTextNode("이미지 출처: Bayerische Staatsgemäldesammlungen ("));

  const ccLink = document.createElement("a");
  ccLink.href = "https://creativecommons.org/licenses/by-sa/4.0/deed.ko";
  ccLink.target = "_blank";
  ccLink.rel = "noopener noreferrer";
  ccLink.textContent = "CC BY-SA 4.0";
  creditBox.appendChild(ccLink);

  creditBox.appendChild(document.createTextNode(")"));

  if (item.detail_url) {
    creditBox.appendChild(document.createTextNode(" · "));
    const sourceLink = document.createElement("a");
    sourceLink.href = item.detail_url;
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";
    sourceLink.textContent = "원 사이트 소장품 상세 보기";
    creditBox.appendChild(sourceLink);
  }
}

function renderModalPersonalBar(item) {
  const descBox = document.getElementById("modalDesc");
  if (!descBox || !descBox.parentNode) return;

  let bar = document.getElementById("modalPersonalBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "modalPersonalBar";
    bar.className = "modal-personal-bar";
    descBox.parentNode.insertBefore(bar, descBox);
  }

  const idStr = String(item.inventory_id);
  const updateButtons = () => {
    const isWished = wishlistIds.has(idStr);
    const isDone = visitedIds.has(idStr);
    bar.innerHTML = "";

    const wishBtn = document.createElement("button");
    wishBtn.type = "button";
    wishBtn.className = isWished ? "modal-personal-btn active-wish" : "modal-personal-btn";
    wishBtn.textContent = isWished ? "★ 위시리스트에 저장됨" : "☆ 위시리스트 찜하기";
    wishBtn.onclick = () => {
      toggleWishlist(idStr);
      updateButtons();
    };

    const doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.className = isDone ? "modal-personal-btn active-visited" : "modal-personal-btn";
    doneBtn.textContent = isDone ? "✓ 관람 완료 체크됨" : "○ 관람 완료 표시";
    doneBtn.onclick = () => {
      toggleVisited(idStr);
      updateButtons();
    };

    bar.appendChild(wishBtn);
    bar.appendChild(doneBtn);
  };

  updateButtons();
}

function renderModalTtsBar(item) {
  const descBox = document.getElementById("modalDesc");
  if (!descBox || !descBox.parentNode) return;

  let ttsBar = document.getElementById("modalTtsBar");
  if (!ttsBar) {
    ttsBar = document.createElement("div");
    ttsBar.id = "modalTtsBar";
    ttsBar.className = "modal-tts-bar";
    descBox.parentNode.insertBefore(ttsBar, descBox);
  }

  ttsBar.innerHTML = "";

  if (!("speechSynthesis" in window)) {
    ttsBar.innerHTML = '<span class="tts-status">이 브라우저에서는 음성 합성을 지원하지 않습니다.</span>';
    return;
  }

  const statusSpan = document.createElement("span");
  statusSpan.className = "tts-status";
  statusSpan.textContent = "오프라인 음성 가이드";

  const playBtn = document.createElement("button");
  playBtn.type = "button";
  playBtn.className = "tts-btn";
  playBtn.textContent = "▶ 음성 해설 듣기";

  const pauseBtn = document.createElement("button");
  pauseBtn.type = "button";
  pauseBtn.className = "tts-btn secondary";
  pauseBtn.textContent = "⏸ 일시정지";

  const stopBtn = document.createElement("button");
  stopBtn.type = "button";
  stopBtn.className = "tts-btn secondary";
  stopBtn.textContent = "■ 정지";

  const rateBtn = document.createElement("button");
  rateBtn.type = "button";
  rateBtn.className = "tts-btn secondary";
  rateBtn.textContent = `${ttsRate.toFixed(1)}x`;

  playBtn.onclick = () => {
    const synth = window.speechSynthesis;
    if (synth.paused) {
      synth.resume();
      statusSpan.textContent = "재생 중...";
      return;
    }

    synth.cancel();
    const titlePart = item.title_ko || item.title_en || "";
    const artistPart = item.artist_ko || item.artist_en || "";
    const bodyPart = descBox.textContent || "";
    const fullText = `${titlePart}. 작가: ${artistPart}. ${bodyPart}`;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "ko-KR";
    utterance.rate = ttsRate;

    const voices = synth.getVoices();
    const koVoice = voices.find((v) => v.lang && v.lang.toLowerCase().includes("ko"));
    if (koVoice) utterance.voice = koVoice;

    utterance.onstart = () => {
      statusSpan.textContent = "재생 중...";
    };
    utterance.onend = () => {
      statusSpan.textContent = "재생 완료";
    };
    utterance.onerror = () => {
      statusSpan.textContent = "재생 중단됨";
    };

    synth.speak(utterance);
  };

  pauseBtn.onclick = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking && !synth.paused) {
      synth.pause();
      statusSpan.textContent = "일시정지됨";
    }
  };

  stopBtn.onclick = () => {
    stopSpeech();
    statusSpan.textContent = "정지됨";
  };

  rateBtn.onclick = () => {
    ttsRate = ttsRate === 1.0 ? 1.2 : ttsRate === 1.2 ? 1.4 : 1.0;
    rateBtn.textContent = `${ttsRate.toFixed(1)}x`;
    if (window.speechSynthesis.speaking) {
      playBtn.click();
    }
  };

  ttsBar.appendChild(playBtn);
  ttsBar.appendChild(pauseBtn);
  ttsBar.appendChild(stopBtn);
  ttsBar.appendChild(rateBtn);
  ttsBar.appendChild(statusSpan);
}

function openModal(item) {
  stopSpeech();

  const highlight = isMasterpiece(item);
  const isNp = isNeuePinakothek(item);
  const originSuffix = isNp ? " · 노이 피나코테크 임시전시" : "";
  const mpSuffix = highlight ? " · ★ 핵심 걸작" : "";

  document.getElementById("modalRoom").textContent = `${item.room}${originSuffix}${mpSuffix}`;

  const modalImg = document.getElementById("modalImg");
  if (item.thumb_url) {
    modalImg.src = item.thumb_url;
    modalImg.style.display = "block";
  } else {
    modalImg.style.display = "none";
  }

  updateModalCredit(item);

  document.getElementById("modalTitle").textContent = item.title_ko
    ? `${item.title_ko}\n(${item.title_en})`
    : item.title_en;

  const artistLabel = item.artist_ko ? `${item.artist_ko} (${item.artist_en})` : item.artist_en;
  document.getElementById("modalArtist").textContent = `${artistLabel} · ${item.date_en || "연도 미상"} [ID: ${item.inventory_id}]`;

  const descBox = document.getElementById("modalDesc");
  if (item.description_ko) {
    descBox.textContent = item.description_ko;
  } else {
    const collectionNotice = isNp
      ? "노이 피나코테크(Neue Pinakothek) 소장품으로 현재 알테 피나코테크에 임시 전시 중인 작품입니다.\n"
      : "";
    descBox.textContent =
      collectionNotice +
      "아직 한글 도슨트 해설이 등록되지 않은 작품입니다.\n" +
      `현재 위치: ${item.room}\n` +
      "하단 공식 상세 페이지 링크에서 독일어/영어 원문 정보를 확인할 수 있습니다.";
  }

  renderModalPersonalBar(item);
  renderModalTtsBar(item);

  const linkEl = document.getElementById("modalLink");
  if (item.detail_url) {
    linkEl.href = item.detail_url;
    linkEl.style.display = "inline-block";
  } else {
    linkEl.style.display = "none";
  }

  detailModal.classList.add("open");
}

function closeModal() {
  stopSpeech();
  detailModal.classList.remove("open");
}

closeModalBtn.onclick = closeModal;
detailModal.onclick = (e) => {
  if (e.target === detailModal) closeModal();
};

floorSelect.onchange = () => {
  populateRoomOptions();
  renderArtworks();
};
roomSelect.onchange = renderArtworks;
searchInput.oninput = renderArtworks;
koOnlyCheckbox.onchange = renderArtworks;

function applyData(payload, sourceLabel) {
  allArtworks = payload.artworks || [];
  if (payload.updated_at) {
    updatedText.textContent = `기준일: ${payload.updated_at.slice(0, 10)}`;
  }
  statusBadge.textContent = sourceLabel;
  populateRoomOptions();
  renderArtworks();
}

async function initApp() {
  loadUserLists();
  injectAppStyles();
  ensureExtendedFilterControls();
  ensureNavigationAndGuideContainers();
  ensureLicenseFooter();

  // Preload browser speech voices for iOS Safari
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
  }

  // 1. Load cached JSON immediately for instant startup & offline resilience
  const cachedRaw = localStorage.getItem(CACHE_KEY);
  if (cachedRaw) {
    try {
      applyData(JSON.parse(cachedRaw), "오프라인 캐시");
    } catch (_) {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  // 2. Background fetch to check and update latest artworks.json
  try {
    const resp = await fetch("./artworks.json", { cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const freshData = await resp.json();
    localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
    applyData(freshData, "최신 동기화됨");
  } catch (err) {
    if (!cachedRaw) {
      statusBadge.textContent = "데이터 로드 실패";
    }
  }

  // Register Service Worker for offline PWA support
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

initApp();