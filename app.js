const CACHE_KEY = "ap_artworks_cache_v1";
let allArtworks = [];

const floorSelect = document.getElementById("floorSelect");
const roomSelect = document.getElementById("roomSelect");
const searchInput = document.getElementById("searchInput");
const koOnlyCheckbox = document.getElementById("koOnlyCheckbox");
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
  roomSelect.innerHTML = '<option value="ALL">전체 전시실 (' + sortedRooms.length + '개)</option>';

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

  const filtered = allArtworks.filter((item) => {
    if (floorVal !== "ALL" && getFloorCategory(item.room) !== floorVal) return false;
    if (roomVal !== "ALL" && item.room !== roomVal) return false;
    if (koOnly && !item.description_ko) return false;

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

  countText.textContent = `${filtered.length}점 표시 (전체 ${allArtworks.length}점)`;
  artworkGrid.innerHTML = "";

  const fragment = document.createDocumentFragment();
  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
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

    if (item.description_ko) {
      const koBadge = document.createElement("div");
      koBadge.className = "ko-tag";
      koBadge.textContent = "● 한글 해설 제공";
      bottomDiv.appendChild(koBadge);
    }

    body.appendChild(topDiv);
    body.appendChild(bottomDiv);
    card.appendChild(img);
    card.appendChild(body);
    fragment.appendChild(card);
  });

  artworkGrid.appendChild(fragment);
}

function openModal(item) {
  document.getElementById("modalRoom").textContent = item.room;
  const modalImg = document.getElementById("modalImg");
  if (item.thumb_url) {
    modalImg.src = item.thumb_url;
    modalImg.style.display = "block";
  } else {
    modalImg.style.display = "none";
  }

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