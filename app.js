const CACHE_KEY = "ap_artworks_cache_v1";
let allArtworks = [];

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

// Inject fallback highlight, badge, and CC BY-SA 4.0 attribution styles
function injectHighlightStyles() {
  if (document.getElementById("ap-highlight-styles")) return;
  const style = document.createElement("style");
  style.id = "ap-highlight-styles";
  style.textContent = `
    .card.is-masterpiece {
      border: 2px solid #b8860b;
      background: linear-gradient(to bottom, #fffdf5, #ffffff);
      box-shadow: 0 4px 12px rgba(184, 134, 11, 0.16);
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
    .badge-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
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
  const rooms = new Set();

  allArtworks.forEach((item) => {
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
}

function renderArtworks() {
  const floorVal = floorSelect.value;
  const roomVal = roomSelect.value;
  const query = searchInput.value.trim().toLowerCase();
  const koOnly = koOnlyCheckbox.checked;
  const mpCheckbox = document.getElementById("masterpieceOnlyCheckbox");
  const masterpieceOnly = mpCheckbox ? mpCheckbox.checked : false;

  const filtered = allArtworks.filter((item) => {
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
  countText.textContent = `${filtered.length}점 표시 (전체 ${allArtworks.length}점 · 핵심 걸작 ${masterpieceCount}점)`;
  artworkGrid.innerHTML = "";

  const fragment = document.createDocumentFragment();
  filtered.forEach((item) => {
    const highlight = isMasterpiece(item);

    const card = document.createElement("article");
    card.className = highlight ? "card is-masterpiece" : "card";
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

    if (highlight || item.description_ko) {
      const badgeRow = document.createElement("div");
      badgeRow.className = "badge-row";

      if (highlight) {
        const mpBadge = document.createElement("span");
        mpBadge.className = "masterpiece-tag";
        mpBadge.textContent = "★ 핵심 걸작";
        badgeRow.appendChild(mpBadge);
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
  document.getElementById("modalRoom").textContent = highlight
    ? `${item.room} · ★ 핵심 걸작`
    : item.room;

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
    descBox.textContent =
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
  injectHighlightStyles();
  const mpCheckbox = masterpieceOnlyCheckbox || ensureMasterpieceFilterControl();
  if (mpCheckbox) {
    mpCheckbox.onchange = renderArtworks;
  }
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