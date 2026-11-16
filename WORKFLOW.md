# 데이터 갱신 및 빌드 워크플로우

이 문서는 뮌헨 알테 피나코텍(Alte Pinakothek)의 최신 전시 배치를 로컬 PC에서 수집·가공한 뒤, GitHub Pages 정적 웹앱에 배포하는 전체 데이터 파이프라인 절차를 설명합니다.

> **참고:** 모든 Python 스크립트(`*.py`)와 로컬 설정 파일(`my_config.py`)은 `.gitignore`에 의해 Git 추적에서 제외되며, 최종 산출물(`artworks.json`, `version.json`)만 원격 저장소에 반영됩니다.

---

## 1. 사전 환경 준비

로컬 작업 디렉토리(`AltePinakothek/`)에서 HTTP 요청 처리를 위한 `requests` 패키지가 설치되어 있어야 합니다.

```bash
pip install requests
```

---

## 2. 최신 전시작 데이터 수집 (`fetch_ap_artworks.py`)

바이에른 주립 회화 컬렉션 공식 API(`/api/search`)를 호출하여 현재 알테 피나코텍(`locationCode: "AP"`, `onDisplay: true`) 내부 전시실(`OG`, `EG`, 입구홀)에 전시 중인 작품 목록을 수집합니다.

```bash
python -u ./fetch_ap_artworks.py
```

* **처리 내용:**
  * 알테 피나코텍(`AP`) 외부 분관 및 대여 전시 항목 제외
  * 작가 정보 딕셔너리에서 표준 이름(`fullName`)만 추출
  * 기존 `artworks.json`이 존재할 경우 `inventory_id`를 기준으로 비교(Diff)하여, 기존에 작성된 한글 데이터(`title_ko`, `artist_ko`, `description_ko`)를 보존하고 신규 입고 및 전시실 이동(`room` 변경) 내역을 콘솔에 출력
* **출력 파일:** `artworks.json`, `version.json`

---

## 3. 한글 도슨트 해설 보강 (`enrich_korean_docent.py`)

수집된 `artworks.json`에 거장들의 한글 이름과 주요 대표작의 도슨트 해설을 일괄 병합합니다.

```bash
python -u ./enrich_korean_docent.py
```

* **신규 해설 추가 방법:**
  1. `enrich_korean_docent.py` 파일을 엽니다.
  2. 새로운 화가 이름을 매핑하려면 `ARTIST_KO_MAP` 딕셔너리에 `"영문/독문명": "한글명"`을 추가합니다.
  3. 특정 작품의 해설을 추가하려면 `artworks.json`에서 해당 작품의 `inventory_id`를 확인한 뒤, `CURATED_DOCENT_DATA` 딕셔너리에 아래 형식으로 추가합니다.
     ```python
     "작품_inventory_id": {
         "title_ko": "한글 작품명",
         "description_ko": "[전시실] 작품 배경 및 감상 포인트 설명...",
     },
     ```
  4. 스크립트를 다시 실행하여 `artworks.json`에 반영합니다.

---

## 4. GitHub Pages 배포 및 반영

갱신된 데이터 파일과 웹앱 정적 파일을 원격 저장소(`main` 브랜치)에 푸시하면 GitHub Pages가 자동으로 새 버전을 배포합니다.

```bash
git add index.html app.js sw.js artworks.json version.json README.md WORKFLOW.md .gitignore
git commit -m "Update Alte Pinakothek exhibition data"
git push origin main
```

---

## 5. 클라이언트(아이폰) 캐시 갱신 안내

* 앱 실행 시 `app.js`가 백그라운드에서 최신 `artworks.json`을 조회하여 `localStorage` 캐시를 자동으로 덮어씁니다.
* 만약 Service Worker(`sw.js`) 자체의 정적 자산 캐시를 즉시 강제 갱신해야 할 경우, `sw.js` 상단의 `STATIC_CACHE` 버전 문자열(예: `ap-docent-static-v1` → `v2`)을 변경한 뒤 푸시합니다.