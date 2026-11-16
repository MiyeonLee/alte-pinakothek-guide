# Alte Pinakothek Korean Docent Web App (알테 피나코텍 한글 도슨트 웹앱)

뮌헨 알테 피나코텍(Alte Pinakothek)에 현재 전시 중인 작품 목록과 전시실 위치(`Saal`, `Kabinett`)를 바이에른 주립 회화 컬렉션 공식 데이터베이스(`sammlung.pinakothek.de`)에서 수집하고, 주요 대표작에 대한 한글 도슨트 해설을 제공하는 모바일 최적화 PWA(Progressive Web App)입니다.

---

## 주요 기능

* **실시간 전시 배치 반영:** 공식 컬렉션 검색 API(`/api/search`)를 통해 현재 알테 피나코텍(`AP`) 내부 전시실(`OG` 1층, `EG` 지하층, 입구홀)에 전시 중인 작품만 필터링하여 수집합니다.
* **전시실별 탐색 및 검색:** 층별(`1층 OG` / `지하층 EG`), 전시실별(`Saal I ~ XIIb`, `Kabinett 1-2 ~ 23`) 드롭다운 필터와 화가·작품명 통합 검색을 지원합니다.
* **한글 도슨트 해설 제공:** 주요 거장 이름 매핑 및 핵심 걸작의 배경지식과 감상 포인트를 한글로 제공합니다.
* **아이폰(iOS Safari) PWA 및 오프라인 지원:** Safari의 **"홈 화면에 추가"** 기능으로 네이티브 앱처럼 전체 화면 실행이 가능하며, `Service Worker`와 `localStorage` 캐싱을 통해 미술관 내부 약전파/오프라인 환경에서도 끊김 없이 작동합니다.

---

## 프로젝트 구조

```text
alte-pinakothek-guide/
├── index.html                  # iOS Safe Area 대응 모바일 퍼스트 메인 UI
├── app.js                      # 전시실 필터링, 검색, 백그라운드 캐시 동기화 로직
├── sw.js                       # 오프라인 동작을 위한 Service Worker
├── artworks.json               # 수집 및 한글 해설 병합이 완료된 전시작 데이터
├── version.json                # 데이터 업데이트 시각 및 총 작품 수 메타데이터
├── fetch_ap_artworks.py        # 공식 API 기반 전시작 수집 및 변경 감지(Diff) 스크립트
├── enrich_korean_docent.py     # 한글 화가명 및 주요 대표작 도슨트 해설 병합 스크립트
├── README.md
└── .gitignore