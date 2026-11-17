const CACHE_KEY = "ap_artworks_cache_v2";
let allArtworks = [];
let currentTab = "ARTWORKS"; // "ARTWORKS" | "MOVEMENTS" | "ARTISTS"
let selectedMovementFilter = "ALL";

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

function getFloorCategory(roomStr) {
  if (roomStr.startsWith("AP OG")) return "AP OG";
  if (roomStr.startsWith("AP EG")) return "AP EG";
  return "OTHER";
}

function simplifyRoomLabel(roomStr) {
  return roomStr.replace(/^AP\s+(OG|EG)\s*->\s*/, "");
}

// Helper function to determine masterpiece status from existing schema
function isMasterpiece(artwork) {
  return (
    artwork.needs_translation === false &&
    typeof artwork.description_ko === "string" &&
    artwork.description_ko.includes("핵심 걸작")
  );
}

// Helper function to identify Neue Pinakothek (NP) temporary exhibits
function isNeuePinakothek(artwork) {
  if (artwork.collection === "NP" || artwork.collection === "Neue Pinakothek") return true;
  if (artwork.collection === "AP") return false;
  return /^AP\s+EG\s*->\s*(Saal\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)|Kabinett\s+([1-9]|1[0-5]))(\b|$)/.test(
    artwork.room || ""
  );
}

// Inject highlight, NP loan badge, CC BY-SA 4.0 attribution, and Art History tab styles
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
    .ap-collection-select {
      margin-left: 12px;
      padding: 5px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background-color: #ffffff;
      color: #1e293b;
      font-size: 0.85rem;
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
    .ap-nav-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 14px 0 16px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
    }
    .ap-nav-tab-btn {
      padding: 8px 16px;
      border: 1px solid #cbd5e1;
      background-color: #f8fafc;
      color: #334155;
      border-radius: 8px;
      font-size: 0.9rem;
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
      margin-top: 8px;
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
      font-size: 1.15rem;
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

// Dynamically create masterpiece filter checkbox next to koOnlyCheckbox if missing in HTML
function ensureMasterpieceFilterControl() {
  if (document.getElementById("masterpieceOnlyCheckbox") || !koOnlyCheckbox) {
    return document.getElementById("masterpieceOnlyCheckbox");
  }

  const label = document.createElement("label");
  label.className = koOnlyCheckbox.parentElement?.className || "filter-checkbox";
  label.style.marginLeft = "12px";
  label.style.cursor = "pointer";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "masterpieceOnlyCheckbox";

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(" 핵심 걸작만 보기"));

  const parentLabel = koOnlyCheckbox.closest("label");
  if (parentLabel && parentLabel.parentNode) {
    parentLabel.parentNode.insertBefore(label, parentLabel.nextSibling);
  } else if (koOnlyCheckbox.parentNode) {
    koOnlyCheckbox.parentNode.insertBefore(label, koOnlyCheckbox.nextSibling);
  }

  return checkbox;
}

// Dynamically create collection filter dropdown ("ALL" | "AP" | "NP")
function ensureCollectionFilterControl() {
  if (document.getElementById("collectionSelect") || !koOnlyCheckbox) {
    return document.getElementById("collectionSelect");
  }

  const select = document.createElement("select");
  select.id = "collectionSelect";
  select.className = "ap-collection-select";
  select.setAttribute("aria-label", "소장처 필터");
  select.innerHTML = `
    <option value="ALL">전체 소장처 (AP + NP)</option>
    <option value="AP">알테 피나코테크 (14~18세기)</option>
    <option value="NP">노이 피나코테크 임시전시 (19세기)</option>
  `;

  const mpLabel = document.getElementById("masterpieceOnlyCheckbox")?.closest("label");
  const anchor = mpLabel || koOnlyCheckbox.closest("label") || koOnlyCheckbox;
  if (anchor && anchor.parentNode) {
    anchor.parentNode.insertBefore(select, anchor.nextSibling);
  }

  return select;
}

// Create navigation tabs ("작품 목록" | "미술 사조별 해설" | "작가별 개요") and guide container
function ensureNavigationAndGuideContainers() {
  if (document.getElementById("apNavTabs")) return;
  if (!artworkGrid || !artworkGrid.parentNode) return;

  const navBar = document.createElement("nav");
  navBar.id = "apNavTabs";
  navBar.className = "ap-nav-tabs";
  navBar.setAttribute("aria-label", "콘텐츠 보기 전환");

  const tabs = [
    { id: "ARTWORKS", label: "작품 목록" },
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

  const guideSection = document.createElement("section");
  guideSection.id = "apGuideSection";
  guideSection.className = "ap-guide-section";

  artworkGrid.parentNode.insertBefore(navBar, artworkGrid);
  artworkGrid.parentNode.insertBefore(guideSection, artworkGrid.nextSibling);
}

function switchTab(tabId) {
  currentTab = tabId;

  const tabBtns = document.querySelectorAll(".ap-nav-tab-btn");
  tabBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tabId === tabId);
  });

  const guideSection = document.getElementById("apGuideSection");
  const filterControls = [
    floorSelect,
    roomSelect,
    koOnlyCheckbox,
    document.getElementById("masterpieceOnlyCheckbox"),
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
    if (guideSection) guideSection.classList.add("active");
    filterControls.forEach((el) => {
      if (el) el.disabled = true;
    });
    renderArtHistoryGuide();
  }
}

// Ensure global CC BY-SA 4.0 attribution & non-official disclaimer footer exists
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

function populateRoomOptions() {
  const selectedFloor = floorSelect.value;
  const selectedCollection = document.getElementById("collectionSelect")?.value || "ALL";
  const prevRoom = roomSelect.value;
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

  const sortedRooms = Array.from(rooms).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  roomSelect.innerHTML = '<option value="ALL">전체 전시실 (' + sortedRooms.length + "개)</option>";

  sortedRooms.forEach((room) => {
    const opt = document.createElement("option");
    opt.value = room;
    opt.textContent = selectedFloor === "ALL" ? room.replace(/^AP\s+/, "") : simplifyRoomLabel(room);
    roomSelect.appendChild(opt);
  });

  if (rooms.has(prevRoom)) {
    roomSelect.value = prevRoom;
  }
}

function createWorkChipElement(work) {
  const highlight = isMasterpiece(work);
  const isNp = isNeuePinakothek(work);

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
  titleEl.textContent = (highlight ? "★ " : "") + (work.title_ko || work.title_en);

  const metaEl = document.createElement("div");
  metaEl.className = "ap-work-chip-meta";
  const npPrefix = isNp ? "[NP] " : "";
  metaEl.textContent = `${npPrefix}${work.artist_ko || work.artist_en} · ${simplifyRoomLabel(work.room)}`;

  info.appendChild(titleEl);
  info.appendChild(metaEl);
  chip.appendChild(info);

  return chip;
}

function renderArtHistoryGuide() {
  const guideSection = document.getElementById("apGuideSection");
  if (!guideSection) return;

  if (typeof ART_MOVEMENTS === "undefined" || typeof ARTISTS_MASTER === "undefined") {
    guideSection.innerHTML =
      '<div class="ap-guide-card">artHistoryMaster.js 데이터가 로드되지 않았습니다. index.html에 스크립트를 추가해주세요.</div>';
    return;
  }

  const query = searchInput.value.trim().toLowerCase();

  // Include translated works AND Neue Pinakothek temporary works (even if pending Korean translation)
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

function renderArtworks() {
  if (currentTab !== "ARTWORKS") {
    renderArtHistoryGuide();
    return;
  }

  const floorVal = floorSelect.value;
  const roomVal = roomSelect.value;
  const query = searchInput.value.trim().toLowerCase();
  const koOnly = koOnlyCheckbox.checked;
  const mpCheckbox = document.getElementById("masterpieceOnlyCheckbox");
  const masterpieceOnly = mpCheckbox ? mpCheckbox.checked : false;
  const collectionVal = document.getElementById("collectionSelect")?.value || "ALL";

  const filtered = allArtworks.filter((item) => {
    const isNp = isNeuePinakothek(item);
    if (collectionVal === "AP" && isNp) return false;
    if (collectionVal === "NP" && !isNp) return false;
    if (floorVal !== "ALL" && getFloorCategory(item.room) !== floorVal) return false;
    if (roomVal !== "ALL" && item.room !== roomVal) return false;
    if (koOnly && !item.description_ko) return false;
    if (masterpieceOnly && !isMasterpiece(item)) return false;

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
  const npCount = filtered.filter(isNeuePinakothek).length;
  countText.textContent = `${filtered.length}점 표시 (전체 ${allArtworks.length}점 · NP 임시전시 ${npCount}점 · 핵심 걸작 ${masterpieceCount}점)`;
  artworkGrid.innerHTML = "";

  const fragment = document.createDocumentFragment();
  filtered.forEach((item) => {
    const highlight = isMasterpiece(item);
    const isNp = isNeuePinakothek(item);

    const card = document.createElement("article");
    card.className = [
      "card",
      highlight ? "is-masterpiece" : "",
      isNp ? "is-np-loan" : ""
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
    const roomTag = document.createElement("span");
    roomTag.className = "room-tag";
    roomTag.textContent = item.room.replace(/^AP\s+/, "");

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = item.title_ko ? `${item.title_ko} (${item.title_en})` : item.title_en;

    topDiv.appendChild(roomTag);
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
        koBadge.textContent = "● 한글 해설 제공";
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

// Render or update CC BY-SA 4.0 credit caption directly beneath modalImg
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

function openModal(item) {
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

  const linkEl = document.getElementById("modalLink");
  if (item.detail_url) {
    linkEl.href = item.detail_url;
    linkEl.style.display = "inline-block";
  } else {
    linkEl.style.display = "none";
  }

  detailModal.classList.add("open");
}

closeModalBtn.onclick = () => detailModal.classList.remove("open");
detailModal.onclick = (e) => {
  if (e.target === detailModal) detailModal.classList.remove("open");
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
  injectAppStyles();
  const mpCheckbox = masterpieceOnlyCheckbox || ensureMasterpieceFilterControl();
  if (mpCheckbox) {
    mpCheckbox.onchange = renderArtworks;
  }
  const colSelect = ensureCollectionFilterControl();
  if (colSelect) {
    colSelect.onchange = () => {
      populateRoomOptions();
      renderArtworks();
    };
  }
  ensureNavigationAndGuideContainers();
  ensureLicenseFooter();

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