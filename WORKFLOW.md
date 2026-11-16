# 데이터 갱신 및 배포 워크플로우 (Data Update & Deployment Workflow)

이 문서는 외부 대화 기록이나 별도 가이드 없이도 뮌헨 알테 피나코텍(Alte Pinakothek)의 전시 배치 데이터를 갱신하고, 한글 도슨트 해설을 추가·병합하여 GitHub Pages 및 iOS PWA에 반영하는 전체 절차를 정의한 독립 실행 매뉴얼입니다.

---

## 1. 아키텍처 및 파일 구성 개요

이 저장소는 **로컬 Python 데이터 파이프라인**과 **GitHub Pages 정적 웹앱(PWA)**이 분리된 구조입니다.

    alte-pinakothek-guide/
    ├── [Git 추적 대상 - GitHub Pages 배포용]
    │   ├── index.html                  # iOS Safe Area 대응 모바일 퍼스트 메인 UI
    │   ├── app.js                      # 전시실 필터링, 검색, localStorage 캐시 동기화
    │   ├── sw.js                       # 오프라인 지원 및 버전 기반 캐시 갱신 Service Worker
    │   ├── artworks.json               # 수집 및 한글 해설 병합이 완료된 최종 전시작 데이터
    │   ├── version.json                # 데이터 업데이트 시각 및 총 작품 수 메타데이터
    │   ├── README.md                   # 프로젝트 개요 및 iOS 설치 가이드
    │   ├── WORKFLOW.md                 # 본 운영·배포 매뉴얼
    │   └── .gitignore                  # 로컬 전용 파일 제외 규칙
    │
    └── [로컬 전용 - .gitignore로 제외됨]
        ├── my_config.py                # 로컬 경로 및 API 요청 딜레이 설정
        ├── fetch_ap_artworks.py        # 공식 API(/api/search) 수집 및 Diff 병합 스크립트
        ├── enrich_korean_docent.py     # 한글 화가명 및 도슨트 해설 병합 스크립트
        ├── docent_ko_master.json       # 한글 도슨트 해설 원본 마스터 데이터베이스
        └── Archive/                    # 디버깅 및 후보 추출 유틸리티 (extract_candidates.py 등)

---

## 2. 로컬 실행 환경 요구사항

1. **Python 환경 및 필수 패키지**
   
       pip install requests

2. **로컬 필수 설정 파일 (`my_config.py`) 확인**
   프로젝트 루트에 아래 상수가 정의된 `my_config.py`가 있어야 합니다.

       import os

       BASE_DIR = os.path.dirname(os.path.abspath(__file__))
       OUTPUT_JSON_PATH = os.path.join(BASE_DIR, "artworks.json")
       VERSION_JSON_PATH = os.path.join(BASE_DIR, "version.json")
       REQUEST_DELAY_SEC = 0.5

---

## 3. 정기 데이터 갱신 및 한글 해설 추가 절차

### Step 1: 공식 API에서 최신 전시 배치 수집 (`fetch_ap_artworks.py`)
알테 피나코텍 내부(`AP OG`, `AP EG`, `AP Eingangshalle`)에 현재 전시 중인 작품 목록을 수집하여 `artworks.json`과 `version.json`을 갱신합니다.

    python -u ./fetch_ap_artworks.py

* **동작 방식:**
  * `https://www.sammlung.pinakothek.de/api/search`에 `filters={"locationCode":"AP","onDisplay":true}` 조건으로 `GET` 요청을 보냅니다.
  * 기존 `artworks.json`이 있으면 `inventory_id`를 대조하여 이미 입력된 `title_ko`, `artist_ko`, `description_ko`를 보존합니다.
  * 새로 전시된 작품(`new`)과 전시실이 바뀐 작품(`moved`)을 터미널에 출력합니다.

---

### Step 2: 신규 한글 도슨트 해설 작성 및 병합 (`enrich_korean_docent.py`)

#### A. 해설이 없는 작품(`inventory_id`) 조회
후보 추출 스크립트를 실행하여 미번역 작품 목록(`Archive/docent_candidates.txt`)을 확인합니다.

    python -u ./Archive/extract_candidates.py

#### B. `docent_ko_master.json`에 해설 추가
프로젝트 루트의 `docent_ko_master.json` 파일을 열고 `inventory_id`를 키(Key)로 하여 아래 형식대로 항목을 추가합니다.

    {
      "7571": {
        "title_ko": "모피 코트를 입은 자화상",
        "description_ko": "[Saal I 핵심 걸작] 작품 설명...\n• 감상 포인트: 핵심 감상 요소..."
      }
    }

*(화가 한글 표기를 추가하려면 `enrich_korean_docent.py` 상단의 `ARTIST_KO_MAP` 딕셔너리에 `"영문/독문 작가명": "한글 표기"`를 추가합니다.)*

#### C. `artworks.json`에 한글 데이터 병합 실행

    python -u ./enrich_korean_docent.py

* 실행 후 터미널의 `total_korean_docents` 수치가 의도한 작품 수와 일치하는지 확인합니다.

---

### Step 3: Service Worker 캐시 버전 갱신 (`sw.js`)
아이폰 Safari PWA는 `sw.js`를 통해 정적 파일(`artworks.json` 포함)을 기기에 캐싱합니다. 데이터가 업데이트되었을 때 아이폰에서 구버전 캐시가 남지 않도록 **`sw.js` 최상단의 `STATIC_CACHE` 버전 번호를 반드시 1 올립니다.**

    // sw.js (1번째 줄)
    const STATIC_CACHE = "ap-docent-static-v3"; // 갱신할 때마다 v2 -> v3 -> v4 순으로 변경

`activate` 이벤트는 `ap-docent-static-`으로 시작하는 이전 캐시를 삭제하고, 요청은 현재 버전 캐시에서만 조회합니다. 따라서 오래된 앱 캐시가 최신 `artworks.json`을 가리는 일을 방지합니다.

    self.addEventListener("activate", (event) => {
      event.waitUntil(
        caches.keys().then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith(CACHE_PREFIX) && key !== STATIC_CACHE)
              .map((key) => caches.delete(key))
          )
        ).then(() => self.clients.claim())
      );
    });

---

## 4. Git 커밋 및 GitHub Pages 배포 명령어

### 일반적인 데이터/문서 업데이트 배포
로컬 작업 폴더(`alte-pinakothek-guide/`)에서 아래 명령어를 순서대로 실행합니다.

    # 1. 추적 대상 파일 확인 (.py 및 로컬 설정 파일이 나오지 않아야 정상)
    git status

    # 2. 변경된 웹앱 배포 파일 및 문서 스테이징
    git add index.html app.js sw.js artworks.json version.json README.md WORKFLOW.md .gitignore

    # 3. 커밋 생성 (날짜 또는 변경 내역 명시)
    git commit -m "Update exhibition data and Korean docent entries"

    # 4. 원격 main 브랜치로 푸시 (GitHub Pages 자동 빌드 트리거)
    git push origin main

### 원격 저장소와 커밋 이력이 충돌할 경우 (동기화 복구)
로컬이 최신 정답 데이터이고 원격 저장소 이력을 덮어써야 할 때만 사용합니다.

    git push -u origin main --force

---

## 5. 배포 완료 및 iOS 실기 검증 체크리스트

1. **GitHub Pages 빌드 상태 확인**
   * GitHub 저장소 상단 **`Actions`** 탭에서 최신 `pages build and deployment` 작업이 녹색(`Success`)으로 완료되었는지 확인합니다 (보통 푸시 후 1~2분 소요).
2. **아이폰(iOS Safari) 캐시 갱신 확인**
   * 아이폰에서 홈 화면 아이콘으로 앱을 실행하거나 Safari에서 배포 URL(`https://miyeonlee.github.io/alte-pinakothek-guide/`)을 엽니다.
   * Safari 화면을 아래로 당겨 **새로고침**을 1회 수행합니다.
   * 상단 상태 배지가 **`최신 동기화됨`**으로 표시되고, 하단 요약 줄의 `기준일`과 `한글 도슨트 해설 등록 작품만 보기` 필터 개수가 최신 수치와 일치하는지 확인합니다.