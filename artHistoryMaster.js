// Master data covering all art movements and artists in the translated Korean collection
// Loaded before app.js via standard <script src="./artHistoryMaster.js"></script>

const ART_MOVEMENTS = [
  {
    id: "early-italian-renaissance",
    nameKo: "초기 이탈리아 르네상스 (트레첸토 ~ 콰트로첸토)",
    nameEn: "Early Italian Renaissance",
    period: "14세기 초 ~ 15세기 말",
    rooms: "Kabinett 1-2, Kabinett 4, Saal II, Saal IV",
    summary:
      "중세 비잔틴·고딕의 평면적인 금박 양식에서 벗어나 인간 중심의 입체적 공간감, 선원근법, 해부학적 비례를 확립한 시기입니다.",
    characteristics: [
      "조토의 입체적 인물 표현과 공간감 도입",
      "피렌체 화파 중심의 수학적 선원근법과 조화로운 비례",
      "안토넬로 다 메시나를 통한 북유럽 유화 기법의 이탈리아 유입"
    ]
  },
  {
    id: "high-renaissance",
    nameKo: "이탈리아 전성기 르네상스",
    nameEn: "High Renaissance",
    period: "15세기 말 ~ 16세기 초",
    rooms: "Saal IV",
    summary:
      "레오나르도 다 빈치, 라파엘로 등으로 대표되는 시기로, 이상적인 인체 비례와 피라미드 구도, 스푸마토 기법을 통해 고전적 균형미의 정점에 도달했습니다.",
    characteristics: [
      "스푸마토(Sfumato)와 대기 원근법을 통한 자연스러운 명암 전환",
      "안정적인 피라미드 구도와 인물 간의 유기적인 시선 처리",
      "종교적 숭고함과 인간적 따뜻함의 완벽한 조화"
    ]
  },
  {
    id: "venetian-renaissance-mannerism",
    nameKo: "베네치아 르네상스 & 매너리즘",
    nameEn: "Venetian Renaissance & Mannerism",
    period: "16세기",
    rooms: "Saal V, Kabinett 4",
    summary:
      "피렌체의 소묘(Disegno) 중심 화풍과 달리 풍부한 색채(Colore)와 빛, 붓질의 질감을 중시한 베네치아 화파와, 의도적 비례 왜곡 및 극적 구도를 추구한 매너리즘이 전개되었습니다.",
    characteristics: [
      "티치아노의 자유로운 임파스토(두꺼운 붓터치)와 깊이 있는 색채",
      "틴토레토의 대각선 구도와 연극적 조명 연출",
      "엘 그레코의 길게 늘어진 인체 비례와 강렬한 영적 색채 대비"
    ]
  },
  {
    id: "early-netherlandish",
    nameKo: "초기 네덜란드 회화 (플랑드르 악파)",
    nameEn: "Early Netherlandish Painting",
    period: "15세기 ~ 16세기 초",
    rooms: "Saal I, Saal IIa, Saal IIb",
    summary:
      "유화 기법을 완성하여 보석처럼 투명한 발색과 극세밀한 질감 묘사를 이루었으며, 일상 사물 속에 깊은 기독교적 상징(위장된 상징주의)을 담아냈습니다.",
    characteristics: [
      "유화 물감의 다층 글레이징을 통한 벨벳·금속·보석의 정밀 묘사",
      "작품 속 작은 거울, 꽃, 해골 등에 부여된 도상학적 상징",
      "날개 달린 제단화(삼면화·이면화) 형식의 발전"
    ]
  },
  {
    id: "german-renaissance-danube",
    nameKo: "독일 르네상스 & 도나우 화파",
    nameEn: "German Renaissance & Danube School",
    period: "15세기 말 ~ 16세기 중반",
    rooms: "Saal I, Saal II, Saal IV, Saal V, Kabinett 9",
    summary:
      "알브레히트 뒤러를 중심으로 이탈리아 르네상스의 인문주의와 비례 이론을 수용하는 한편, 북유럽 특유의 격정적인 종교적 표현력과 순수 풍경화 장르를 개척했습니다.",
    characteristics: [
      "뒤러의 예술가 자의식 확립 및 정밀한 초상·판화 기법",
      "그뤼네발트의 비극적이고 표현주의적인 수난 묘사",
      "알트도르퍼를 필두로 한 도나우 화파의 서양 최초 순수 풍경화 탄생"
    ]
  },
  {
    id: "flemish-baroque",
    nameKo: "플랑드르 바로크",
    nameEn: "Flemish Baroque",
    period: "17세기",
    rooms: "Saal VI, Saal VII, Saal VIII, Kabinett 11, Kabinett 12",
    summary:
      "가톨릭 반종교개혁의 영향 아래 페테르 파울 루벤스를 중심으로 역동적인 대각선 구도, 관능적인 육체 표현, 화려한 색채와 웅장한 스케일이 꽃피웠습니다.",
    characteristics: [
      "루벤스의 소용돌이치는 역동적 구도와 대규모 공방 분업 시스템",
      "반 다이크의 우아하고 세련된 귀족 초상화 양식",
      "스네이더르스의 풍요로운 정물·동물화 및 브라우어르의 농민 풍속화"
    ]
  },
  {
    id: "dutch-golden-age",
    nameKo: "네덜란드 황금시대 회화",
    nameEn: "Dutch Golden Age Painting",
    period: "17세기",
    rooms: "Saal V, Saal IX, Saal XI, Kabinett 20, Kabinett 21, Kabinett 22",
    summary:
      "개신교 공화국과 부유한 시민 계급의 성장을 배경으로, 종교화 대신 초상화·풍경화·풍속화·정물화가 독립 장르로 발전했으며 렘브란트가 빛과 내면 심리의 깊이를 탐구했습니다.",
    characteristics: [
      "렘브란트의 극적인 명암 대비(키아로스쿠로)와 인간 내면 성찰",
      "프란스 할스의 생동감 넘치는 붓질과 라위스달의 서사적 풍경화",
      "얀 스테인·헤라르트 다우의 시민 일상 풍속화와 극세밀 묘사"
    ]
  },
  {
    id: "spanish-golden-age-classicism",
    nameKo: "스페인 황금시대 & 프랑스 고전주의",
    nameEn: "Spanish Golden Age & French Classicism",
    period: "17세기",
    rooms: "Saal VI, Saal IX, Saal X, EG Saal XII, EG Saal XIII",
    summary:
      "스페인의 사실주의적 통찰과 따뜻한 종교적 정서(벨라스케스, 무리요), 그리고 고대 그리스·로마의 질서와 이성을 계승한 프랑스 고전주의(푸생, 클로드 로랭)가 병행했습니다.",
    characteristics: [
      "벨라스케스의 대담한 필치와 시각적 사실주의",
      "무리요의 서정적인 종교화 및 세비야 거리 소년 장르화",
      "푸생·로랭의 조화로운 이상적 풍경화와 고전 신화 해석"
    ]
  },
  {
    id: "rococo-veduta",
    nameKo: "로코코 & 베네치아 베두타",
    nameEn: "Rococo & Venetian Veduta",
    period: "18세기",
    rooms: "Saal X, Saal XII, Saal XIIb, EG Saal XIII",
    summary:
      "바로크의 장엄함에서 벗어나 귀족 살롱의 우아하고 경쾌한 감각미(부셰, 프라고나르)와 시민 일상의 고요한 정취(샤르댕), 베네치아 도시 풍경화(카날레토, 과르디)가 유행했습니다.",
    characteristics: [
      "부셰·프라고나르의 파스텔 톤 색채와 우아한 곡선미",
      "티에폴로의 밝고 연극적인 천장화·제단화 화풍",
      "카날레토·과르디의 정밀하고 생동감 있는 베네치아 도시 풍경(베두타)"
    ]
  },
  {
    id: "neoclassicism-romanticism",
    nameKo: "낭만주의 & 신고전주의 (노이 피나코테크 임시전시)",
    nameEn: "Romanticism & Neoclassicism",
    period: "18세기 말 ~ 19세기 중반",
    rooms: "AP EG Saal IIb, Saal III, Kabinett 1, 4-7",
    summary:
      "고대 그리스·로마의 균형미와 계몽주의적 초상화를 추구한 신고전주의(카노바, 게인즈버러, 그라프)와, 자연의 숭고함·인간의 내면 감정·격정적 서사를 탐구한 낭만주의(프리드리히, 터너, 들라크루아, 고야)가 전개된 시기입니다.",
    characteristics: [
      "카스파 다비트 프리드리히·카를 로트만의 숭고하고 명상적인 독일 풍경화",
      "터너·컨스터블의 빛과 대기의 역동적 자연 표현 및 고야·들라크루아의 격정적 필치",
      "슈틸러·슈피츠베크·발트뮐러 등 비더마이어 시대의 정밀 초상화와 소시민적 해학"
    ]
  },
  {
    id: "realism-biedermeier",
    nameKo: "사실주의 & 독일 근대 회화 (노이 피나코테크 임시전시)",
    nameEn: "Realism & 19th-Century German Painting",
    period: "19세기 중반 ~ 후반",
    rooms: "AP EG Saal II, Saal IIa, Kabinett 3-4",
    summary:
      "이상화된 신화 대신 눈앞의 현실과 농민의 노동, 자연을 있는 그대로 직시한 프랑스 사실주의·바르비종 화파(쿠르베, 밀레, 도미에)와 순수 회화성을 추구한 독일 근대 거장(멘첼, 라이블, 뵈클린)이 활약했습니다.",
    characteristics: [
      "귀스타브 쿠르베의 거친 나이프 질감과 가식 없는 현실 묘사",
      "밀레·도비니 등 바르비종 화파의 서정적 농촌 풍경과 야외 사생 전통",
      "아돌프 폰 멘첼·빌헬름 라이블의 예리한 현실 관찰력과 순수 회화적 붓질"
    ]
  },
  {
    id: "impressionism-post-impressionism",
    nameKo: "인상주의 & 후기인상주의 (노이 피나코테크 임시전시)",
    nameEn: "Impressionism & Post-Impressionism",
    period: "19세기 후반 ~ 20세기 초",
    rooms: "AP EG Saal I, Saal II, Saal IIa, Saal XI, Kabinett 2",
    summary:
      "시시각각 변하는 자연광과 대기의 인상을 분할된 색채로 포착한 인상주의(마네, 모네, 드가, 르누아르, 리버만)와, 견고한 조형성·강렬한 내면 감정·색채 이론을 탐구한 후기인상주의(세잔, 반 고흐, 고갱, 시냐크)가 근대 미술의 문을 열었습니다.",
    characteristics: [
      "마네·모네의 야외 빛 포착과 대담한 필촉, 독일 인상주의(리버만·코린트)로의 확산",
      "폴 세잔의 구조적 화면 구성과 시냐크·세간티니의 분할주의적 색채 광학",
      "빈센트 반 고흐의 강렬한 원색 대비와 소용돌이치는 임파스토 붓질"
    ]
  },
  {
    id: "symbolism-jugendstil",
    nameKo: "상징주의, 유겐트슈틸 & 초기 모더니즘 (노이 피나코테크 임시전시)",
    nameEn: "Symbolism, Jugendstil & Early Modernism",
    period: "19세기 말 ~ 20세기 초",
    rooms: "AP EG Saal I, Saal II, Kabinett 2",
    summary:
      "보이는 현실 너머의 꿈·심리·신화적 상징을 탐구한 세기말 상징주의·유겐트슈틸(클림트, 슈투크, 앙소르, 호들러)과, 근대 조각의 혁신(로댕) 및 표현주의·입체주의(에곤 실레, 피카소)로 이어지는 전환기 걸작들을 아우릅니다.",
    characteristics: [
      "구스타프 클림트의 화려한 장식성과 섬세한 심리적 초상화",
      "로댕·마욜의 근대 조각 혁신과 앙소르·호들러의 강렬한 상징주의",
      "에곤 실레의 신경증적 표현주의 선묘와 파블로 피카소의 청색시대 초기작"
    ]
  }
];

const ARTISTS_MASTER = [
  {
    artistKo: "조토 디 본도네",
    artistEn: "Giotto di Bondone",
    lifespan: "ca. 1267 - 1337",
    origin: "이탈리아 (피렌체)",
    movementId: "early-italian-renaissance",
    bio: "중세 고딕의 평면적 양식을 깨고 인물의 입체감과 감정, 공간의 깊이를 도입하여 서양 근대 회화의 아버지로 불리는 혁신가입니다."
  },
  {
    artistKo: "프라 안젤리코",
    artistEn: "Fra Angelico",
    lifespan: "ca. 1395 - 1455",
    origin: "이탈리아 (피렌체)",
    movementId: "early-italian-renaissance",
    bio: "피렌체 산 마르코 수도원의 도미니코회 수도사 화가로, 맑고 투명한 색채와 경건하고 시적인 종교화로 유명합니다."
  },
  {
    artistKo: "프라 필리포 리피",
    artistEn: "Fra Filippo Lippi",
    lifespan: "ca. 1406 - 1469",
    origin: "이탈리아 (피렌체)",
    movementId: "early-italian-renaissance",
    bio: "보티첼리의 스승이자 초기 피렌체 르네상스의 거장으로, 성모자와 천사를 현실적이고 우아한 인간적 모습으로 묘사했습니다."
  },
  {
    artistKo: "안토넬로 다 메시나",
    artistEn: "Antonello da Messina",
    lifespan: "ca. 1430 - 1479",
    origin: "이탈리아 (시칠리아)",
    movementId: "early-italian-renaissance",
    bio: "북유럽 플랑드르의 정교한 유화 기법을 이탈리아 베네치아에 전파하여 이탈리아 르네상스 회화의 색채와 명암 표현을 혁신했습니다."
  },
  {
    artistKo: "산드로 보티첼리",
    artistEn: "Sandro Botticelli",
    lifespan: "1445 - 1510",
    origin: "이탈리아 (피렌체)",
    movementId: "early-italian-renaissance",
    bio: "피렌체 메디치 가문의 후원 아래 우아한 선율과 시적인 신화화를 남겼으며, 말년에는 사보나롤라의 영향으로 격정적인 종교화를 그렸습니다."
  },
  {
    artistKo: "도메니코 기를란다요",
    artistEn: "Domenico Ghirlandaio",
    lifespan: "1449 - 1494",
    origin: "이탈리아 (피렌체)",
    movementId: "early-italian-renaissance",
    bio: "미켈란젤로의 스승으로, 피렌체 부르주아 사회의 풍요로움과 질서 정연한 르네상스 건축 구도를 대제단화와 프레스코에 담아냈습니다."
  },
  {
    artistKo: "피에트로 페루지노",
    artistEn: "Pietro Perugino",
    lifespan: "ca. 1448 - 1523",
    origin: "이탈리아 (움브리아)",
    movementId: "early-italian-renaissance",
    bio: "라파엘로의 스승으로, 좌우 대칭의 고전적 아치 건축과 고요하고 투명한 이탈리아 중부 풍경을 배경으로 한 명상적 종교화를 확립했습니다."
  },
  {
    artistKo: "레오나르도 다 빈치",
    artistEn: "Leonardo da Vinci",
    lifespan: "1452 - 1519",
    origin: "이탈리아 (피렌체)",
    movementId: "high-renaissance",
    bio: "전성기 르네상스를 연 만능 천재로, 윤곽선을 부드럽게 녹이는 스푸마토 기법과 대기 원근법을 통해 회화에 심리적 깊이와 자연주의를 부여했습니다."
  },
  {
    artistKo: "라파엘로 산치오",
    artistEn: "Raffael",
    lifespan: "1483 - 1520",
    origin: "이탈리아 (우르비노)",
    movementId: "high-renaissance",
    bio: "피렌체와 로마에서 활약하며 완벽한 피라미드 구도와 우아한 성모자상, 조화로운 색채로 서양 고전주의 회화의 표준을 세웠습니다."
  },
  {
    artistKo: "티치아노 베첼리오",
    artistEn: "Tiziano Vecellio (Tizian)",
    lifespan: "ca. 1488 - 1576",
    origin: "이탈리아 (베네치아)",
    movementId: "venetian-renaissance-mannerism",
    bio: "16세기 베네치아 화파의 절대적 거장으로, 화려한 색채와 대담한 붓터치로 군주 초상화와 종교화, 신화화의 새로운 지평을 열었습니다."
  },
  {
    artistKo: "로렌초 로토",
    artistEn: "Lorenzo Lotto",
    lifespan: "ca. 1480 - 1556",
    origin: "이탈리아 (베네치아)",
    movementId: "venetian-renaissance-mannerism",
    bio: "베네치아 화파의 독창적인 화가로, 인물의 섬세한 내면 심리와 비대칭적 구도, 서정적인 빛의 표현에서 고유한 개성을 발휘했습니다."
  },
  {
    artistKo: "야코포 틴토레토",
    artistEn: "Jacopo Tintoretto",
    lifespan: "1518 - 1594",
    origin: "이탈리아 (베네치아)",
    movementId: "venetian-renaissance-mannerism",
    bio: "미켈란젤로의 소묘와 티치아노의 색채를 결합하여 극적인 대각선 구도와 역동적인 빛의 대비로 매너리즘과 바로크의 가교 역할을 했습니다."
  },
  {
    artistKo: "엘 그레코",
    artistEn: "El Greco",
    lifespan: "1541 - 1614",
    origin: "그리스 크레타 / 스페인 톨레도",
    movementId: "venetian-renaissance-mannerism",
    bio: "비잔틴 이콘과 베네치아 색채를 흡수한 뒤 스페인 톨레도에서 길게 늘어진 인체와 초자연적인 빛으로 독보적인 신비주의 화풍을 완성했습니다."
  },
  {
    artistKo: "로히어르 판 데르 베이던",
    artistEn: "Rogier van der Weyden",
    lifespan: "ca. 1399 - 1464",
    origin: "플랑드르 (투르네/브뤼셀)",
    movementId: "early-netherlandish",
    bio: "초기 네덜란드 회화의 거장으로, 선명한 색채와 극세밀한 질감 묘사 속에 인물의 깊은 종교적 감정과 드라마를 결합했습니다."
  },
  {
    artistKo: "디르크 바우츠",
    artistEn: "Dieric Bouts d. Ä.",
    lifespan: "ca. 1410 - 1475",
    origin: "네덜란드 / 플랑드르 (뢰번)",
    movementId: "early-netherlandish",
    bio: "절제된 표정과 고요하고 엄숙한 분위기, 그리고 북유럽 풍경에 대한 섬세한 빛의 관찰로 유명한 초기 네덜란드 거장입니다."
  },
  {
    artistKo: "한스 멤링",
    artistEn: "Hans Memling",
    lifespan: "ca. 1435 - 1494",
    origin: "독일 / 플랑드르 (브뤼헤)",
    movementId: "early-netherlandish",
    bio: "브뤼헤에서 활동하며 온화하고 서정적인 성모자상과 정교한 파노라마식 서사 회화로 유럽 전역에서 큰 인기를 누렸습니다."
  },
  {
    artistKo: "퀸텐 마시스",
    artistEn: "Quinten Massys",
    lifespan: "1466 - 1530",
    origin: "플랑드르 (안트베르펜)",
    movementId: "early-netherlandish",
    bio: "안트베르펜 화파의 창시자로, 전통적인 플랑드르 세밀화 기법에 이탈리아 르네상스의 조형미와 인문주의적 감수성을 결합했습니다."
  },
  {
    artistKo: "얀 호사르트 (마뷔즈)",
    artistEn: "Jan Gossaert gen. Mabuse",
    lifespan: "ca. 1478 - 1532",
    origin: "플랑드르",
    movementId: "early-netherlandish",
    bio: "로마 유학 후 고전 신화 주제와 이탈리아식 르네상스 건축, 입체적인 누드 표현을 플랑드르 회화에 도입한 북유럽 로마니즘의 선구자입니다."
  },
  {
    artistKo: "피터르 브뤼헐 (아버지)",
    artistEn: "Pieter Bruegel d. Ä.",
    lifespan: "ca. 1525 - 1569",
    origin: "플랑드르 (안트베르펜/브뤼셀)",
    movementId: "early-netherlandish",
    bio: "농민들의 일상과 속담, 자연의 계절 변화를 예리한 풍자와 깊은 인간애로 그려내어 북유럽 풍속화의 독보적 경지를 열었습니다."
  },
  {
    artistKo: "슈테판 로흐너",
    artistEn: "Stefan Lochner",
    lifespan: "ca. 1410 - 1451",
    origin: "독일 (쾰른)",
    movementId: "german-renaissance-danube",
    bio: "국제 고딕 양식의 정점을 이룬 쾰른 화파의 거장으로, 황금빛 배경과 온화하고 서정적인 성모·천사 묘사로 유명합니다."
  },
  {
    artistKo: "미하엘 파허",
    artistEn: "Michael Pacher",
    lifespan: "ca. 1435 - 1498",
    origin: "티롤 (오스트리아/남티롤)",
    movementId: "german-renaissance-danube",
    bio: "후기 고딕 목조 제단화 장인이자 화가로, 북이탈리아 르네상스의 선원근법을 독일어권 회화에 선구적으로 도입했습니다."
  },
  {
    artistKo: "한스 홀바인 (아버지)",
    artistEn: "Hans Holbein d. Ä.",
    lifespan: "ca. 1465 - 1524",
    origin: "독일 (아우크스부르크)",
    movementId: "german-renaissance-danube",
    bio: "후기 고딕에서 독일 르네상스로의 전환을 이끈 아우크스부르크의 거장으로, 사실적인 인물 묘사와 르네상스 건축 모티프를 결합했습니다."
  },
  {
    artistKo: "한스 홀바인 (아들)",
    artistEn: "Hans Holbein d. J.",
    lifespan: "1497 - 1543",
    origin: "독일 / 스위스 / 영국",
    movementId: "german-renaissance-danube",
    bio: "북유럽 르네상스 초상화의 최고봉으로, 영국 헨리 8세의 궁정화가로 활동하며 인물의 외면과 내면을 냉철하고 정밀하게 포착했습니다."
  },
  {
    artistKo: "알브레히트 뒤러",
    artistEn: "Albrecht Dürer",
    lifespan: "1471 - 1528",
    origin: "독일 (뉘른베르크)",
    movementId: "german-renaissance-danube",
    bio: "독일 르네상스를 대표하는 위대한 화가이자 판화가로, 인체 비례 연구와 예술가의 자의식을 확립하며 북유럽 미술을 새로운 차원으로 끌어올렸습니다."
  },
  {
    artistKo: "루카스 크라나흐 (아버지)",
    artistEn: "Lucas Cranach d. Ä.",
    lifespan: "1472 - 1553",
    origin: "독일 (비텐베르크)",
    movementId: "german-renaissance-danube",
    bio: "작센 선제후의 궁정화가이자 마르틴 루터의 절친한 친구로, 강렬한 표현주의적 초기작과 우아한 개신교·신화 회화를 남겼습니다."
  },
  {
    artistKo: "마티아스 그뤼네발트",
    artistEn: "Matthias Grünewald",
    lifespan: "ca. 1475 - 1528",
    origin: "독일",
    movementId: "german-renaissance-danube",
    bio: "고전적 이상미 대신 격정적인 색채와 뒤틀린 형태, 처절한 종교적 영성을 통해 독일 표현주의의 선구가 된 독창적 거장입니다."
  },
  {
    artistKo: "알브레히트 알트도르퍼",
    artistEn: "Albrecht Altdorfer",
    lifespan: "ca. 1480 - 1538",
    origin: "독일 (레겐스부르크)",
    movementId: "german-renaissance-danube",
    bio: "도나우 화파의 중심 인물로, 서양 미술사 최초의 인물 없는 순수 풍경화를 그렸으며 웅장한 우주적 스케일의 역사화로 유명합니다."
  },
  {
    artistKo: "한스 발둥 그린",
    artistEn: "Hans Baldung gen. Grien",
    lifespan: "1484 - 1545",
    origin: "독일 (슈트라스부르크)",
    movementId: "german-renaissance-danube",
    bio: "알브레히트 뒤러의 가장 뛰어난 제자로, 대담한 색채 대비와 개성 넘치는 초상화, 신비롭고 환상적인 주제의 작품들을 남겼습니다."
  },
  {
    artistKo: "페테르 파울 루벤스",
    artistEn: "Peter Paul Rubens",
    lifespan: "1577 - 1640",
    origin: "플랑드르 (안트베르펜)",
    movementId: "flemish-baroque",
    bio: "17세기 북유럽 바로크의 제왕으로, 역동적인 구도와 풍요로운 색채, 방대한 스케일의 종교화·신화화·수렵화·초상화를 남겼습니다."
  },
  {
    artistKo: "안토니 반 다이크",
    artistEn: "Anthonis van Dyck",
    lifespan: "1599 - 1641",
    origin: "플랑드르 / 영국",
    movementId: "flemish-baroque",
    bio: "루벤스의 수제자이자 영국 찰스 1세의 궁정화가로, 기품 있고 우아한 귀족 초상화의 전형을 확립하여 18세기 영국 초상화에 지대한 영향을 미쳤습니다."
  },
  {
    artistKo: "야코프 요르단스",
    artistEn: "Jacob Jordaens",
    lifespan: "1593 - 1678",
    origin: "플랑드르 (안트베르펜)",
    movementId: "flemish-baroque",
    bio: "루벤스·반 다이크와 함께 플랑드르 바로크의 3대 거장으로 꼽히며, 서민적이고 활기찬 풍속화와 풍부한 색채의 대형 장식화로 유명합니다."
  },
  {
    artistKo: "프란스 스네이더르스",
    artistEn: "Frans Snyders",
    lifespan: "1579 - 1657",
    origin: "플랑드르 (안트베르펜)",
    movementId: "flemish-baroque",
    bio: "바로크 정물화와 동물화의 개척자로, 루벤스와 자주 협업했으며 풍요로운 시장 좌판과 역동적인 사냥 장면을 압도적인 스케일로 그렸습니다."
  },
  {
    artistKo: "얀 브뤼헐 (아버지)",
    artistEn: "Jan Brueghel d. Ä.",
    lifespan: "1568 - 1625",
    origin: "플랑드르 (안트베르펜)",
    movementId: "flemish-baroque",
    bio: "피터르 브뤼헐의 아들로 '꽃의 브뤼헐'이라 불렸으며, 보석처럼 정밀한 정물화와 풍경화로 루벤스와 수많은 공동 걸작을 남겼습니다."
  },
  {
    artistKo: "아드리안 브라우어르",
    artistEn: "Adriaen Brouwer",
    lifespan: "ca. 1605 - 1638",
    origin: "플랑드르 / 네덜란드",
    movementId: "flemish-baroque",
    bio: "선술집의 농민들과 인간의 오감·감정을 거침없는 붓질과 해학으로 포착하여 루벤스와 렘브란트 모두로부터 극찬을 받은 풍속화의 천재입니다."
  },
  {
    artistKo: "렘브란트 판 레인",
    artistEn: "Rembrandt Harmensz. van Rijn",
    lifespan: "1606 - 1669",
    origin: "네덜란드 (레이던/암스테르담)",
    movementId: "dutch-golden-age",
    bio: "네덜란드 황금시대의 최고 거장으로, 어둠 속에서 피어나는 황금빛 명암법과 깊은 인간적 연민을 담은 성경화·초상화를 남겼습니다."
  },
  {
    artistKo: "프란스 할스",
    artistEn: "Frans Hals",
    lifespan: "ca. 1582 - 1666",
    origin: "네덜란드 (하를렘)",
    movementId: "dutch-golden-age",
    bio: "빠르고 대담한 붓터치로 인물의 순간적인 표정과 생동감을 포착하여 19세기 인상주의 화가들에게까지 영감을 준 초상화의 거장입니다."
  },
  {
    artistKo: "야코프 판 라위스달",
    artistEn: "Jacob van Ruisdael",
    lifespan: "ca. 1628 - 1682",
    origin: "네덜란드 (하를렘/암스테르담)",
    movementId: "dutch-golden-age",
    bio: "네덜란드 사실주의 풍경화의 정점을 이룬 화가로, 웅장한 구름 하늘과 거친 자연의 생명력을 시적이고 드라마틱하게 표현했습니다."
  },
  {
    artistKo: "얀 스테인",
    artistEn: "Jan Steen",
    lifespan: "1626 - 1679",
    origin: "네덜란드 (레이던)",
    movementId: "dutch-golden-age",
    bio: "네덜란드 시민과 서민들의 유쾌하고 소란스러운 일상을 연극적인 구성과 날카로운 해학, 도덕적 우화로 풀어낸 풍속화의 대가입니다."
  },
  {
    artistKo: "헤라르트 다우",
    artistEn: "Gerard Dou",
    lifespan: "1613 - 1675",
    origin: "네덜란드 (레이던)",
    movementId: "dutch-golden-age",
    bio: "렘브란트의 첫 번째 제자로, 붓자국이 전혀 보이지 않을 만큼 매끄럽고 정교한 레이던 극세밀화파(페인스힐더르)를 창시했습니다."
  },
  {
    artistKo: "디에고 벨라스케스",
    artistEn: "Diego Velázquez",
    lifespan: "1599 - 1660",
    origin: "스페인 (세비야/마드리드)",
    movementId: "spanish-golden-age-classicism",
    bio: "스페인 황금시대의 최고 거장이자 펠리페 4세의 궁정화가로, 공기와 빛의 미묘한 효과를 포착하는 천재적 필치로 근대 회화에 큰 영향을 주었습니다."
  },
  {
    artistKo: "바르톨로메 에스테반 무리요",
    artistEn: "Bartolomé Esteban Murillo",
    lifespan: "1617 - 1682",
    origin: "스페인 (세비야)",
    movementId: "spanish-golden-age-classicism",
    bio: "세비야를 대표하는 바로크 화가로, 부드러운 빛과 따뜻한 색채를 통해 경건한 종교화와 거리 소년들의 순수한 일상을 그렸습니다."
  },
  {
    artistKo: "니콜라 푸생",
    artistEn: "Nicolas Poussin",
    lifespan: "1594 - 1665",
    origin: "프랑스 / 이탈리아 로마",
    movementId: "spanish-golden-age-classicism",
    bio: "17세기 프랑스 고전주의 회화의 창시자로, 로마에서 활동하며 고대 조각과 라파엘로의 질서를 계승한 이성적이고 조화로운 신화화를 그렸습니다."
  },
  {
    artistKo: "클로드 로랭",
    artistEn: "Claude Lorrain",
    lifespan: "ca. 1600 - 1682",
    origin: "프랑스 / 이탈리아 로마",
    movementId: "spanish-golden-age-classicism",
    bio: "로마 근교의 자연을 황금빛 태양 광선과 고전 유적 속에 이상화하여 서양 풍경화 미학에 지대한 영향을 미친 거장입니다."
  },
  {
    artistKo: "조반니 바티스타 티에폴로",
    artistEn: "Giovanni Battista Tiepolo",
    lifespan: "1696 - 1770",
    origin: "이탈리아 (베네치아)",
    movementId: "rococo-veduta",
    bio: "18세기 베네치아 로코코의 거장으로, 눈부신 햇살과 경쾌한 구도, 연극적인 화려함으로 유럽 궁전 장식화와 제단화의 정점을 이루었습니다."
  },
  {
    artistKo: "프랑수아 부셰",
    artistEn: "François Boucher",
    lifespan: "1703 - 1770",
    origin: "프랑스 (파리)",
    movementId: "rococo-veduta",
    bio: "루이 15세와 퐁파두르 부인의 총애를 받은 프랑스 로코코의 대표 화가로, 관능적이고 우아한 신화화와 화려한 초상화로 시대를 풍미했습니다."
  },
  {
    artistKo: "장오노레 프라고나르",
    artistEn: "Jean-Honoré Fragonard",
    lifespan: "1732 - 1806",
    origin: "프랑스 (파리)",
    movementId: "rococo-veduta",
    bio: "로코코 후기를 대표하는 화가로, 즉흥적이고 생동감 넘치는 붓질과 따뜻한 빛으로 사랑과 일상의 유쾌한 순간을 포착했습니다."
  },
  {
    artistKo: "장바티스트 시메옹 샤르댕",
    artistEn: "Jean-Baptiste Siméon Chardin",
    lifespan: "1699 - 1779",
    origin: "프랑스 (파리)",
    movementId: "rococo-veduta",
    bio: "화려한 귀족 취향의 로코코 시대 속에서 평범한 시민의 부엌과 소박한 정물을 고요하고 진실된 시선으로 그려낸 거장입니다."
  },
  {
    artistKo: "카날레토",
    artistEn: "Canaletto (Giovanni Antonio Canal)",
    lifespan: "1697 - 1768",
    origin: "이탈리아 (베네치아)",
    movementId: "rococo-veduta",
    bio: "18세기 베네치아 도시 풍경화(베두타)의 최고봉으로, 운하와 건축물의 웅장한 풍경을 정밀한 원근법과 맑은 빛으로 기록했습니다."
  },
  {
    artistKo: "프란체스코 과르디",
    artistEn: "Francesco Guardi",
    lifespan: "1712 - 1793",
    origin: "이탈리아 (베네치아)",
    movementId: "rococo-veduta",
    bio: "베네치아 공화국 황혼기의 화가로, 반짝이는 물결과 대기, 축제의 생동감을 자유롭고 시적인 붓터치로 담아냈습니다."
  },
  {
    artistKo: "프란시스코 데 고야",
    artistEn: "Francisco José de Goya y Lucientes",
    lifespan: "1746 - 1828",
    origin: "스페인",
    movementId: "neoclassicism-romanticism",
    bio: "궁정화가에서 출발해 인간 내면의 광기와 전쟁의 참상, 사회의 부조리를 대담하고 자유로운 붓질로 고발한 근대 회화의 선구자입니다."
  },
  {
    artistKo: "카스파 다비트 프리드리히",
    artistEn: "Caspar David Friedrich",
    lifespan: "1774 - 1840",
    origin: "독일 (드레스덴)",
    movementId: "neoclassicism-romanticism",
    bio: "독일 낭만주의 풍경화의 최고봉으로, 안개와 황혼, 고독한 자연 풍경 속에 인간의 유한성과 신비로운 숭고미를 투영했습니다."
  },
  {
    artistKo: "카를 슈피츠베크",
    artistEn: "Carl Spitzweg",
    lifespan: "1808 - 1885",
    origin: "독일 (뮌헨)",
    movementId: "neoclassicism-romanticism",
    bio: "뮌헨을 대표하는 비더마이어 시대의 화가로, 책벌레와 시인 등 소시민의 일상을 따뜻한 해학과 섬세한 빛의 표현으로 그렸습니다."
  },
  {
    artistKo: "귀스타브 쿠르베",
    artistEn: "Gustave Courbet",
    lifespan: "1819 - 1877",
    origin: "프랑스",
    movementId: "realism-biedermeier",
    bio: "낭만주의의 이상화를 거부하고 '나는 천사를 본 적이 없으므로 그리지 않는다'고 선언하며 사실주의 회화 운동을 이끈 거장입니다."
  },
  {
    artistKo: "빌헬름 라이블",
    artistEn: "Wilhelm Leibl",
    lifespan: "1844 - 1900",
    origin: "독일 (뮌헨)",
    movementId: "realism-biedermeier",
    bio: "쿠르베의 사실주의에 감화받아 바이에른 농민들의 모습을 일체의 감상이나 과장 없이 순수한 회화적 필치로 포착한 독일 사실주의의 거장입니다."
  },
  {
    artistKo: "에두아르 마네",
    artistEn: "Édouard Manet",
    lifespan: "1832 - 1883",
    origin: "프랑스 (파리)",
    movementId: "impressionism-post-impressionism",
    bio: "전통적인 명암 원근법을 깨고 평면적인 색채 대비와 현대 파리의 일상을 그려내며 인상주의 탄생에 결정적 영감을 준 모더니즘의 아버지입니다."
  },
  {
    artistKo: "클로드 모네",
    artistEn: "Claude Monet",
    lifespan: "1840 - 1926",
    origin: "프랑스 (파리/지베르니)",
    movementId: "impressionism-post-impressionism",
    bio: "빛에 따라 시시각각 변하는 자연의 색채를 야외에서 직접 포착하며 인상주의 양식을 창시하고 끝까지 탐구한 거장입니다."
  },
  {
    artistKo: "에드가 드가",
    artistEn: "Edgar Degas",
    lifespan: "1834 - 1917",
    origin: "프랑스 (파리)",
    movementId: "impressionism-post-impressionism",
    bio: "발레 무용수와 경마장, 도시인의 일상을 사진처럼 과감하게 잘린 구도와 역동적인 데생으로 포착한 인상주의의 거장입니다."
  },
  {
    artistKo: "피에르 오귀스트 르누아르",
    artistEn: "Pierre-Auguste Renoir",
    lifespan: "1841 - 1919",
    origin: "프랑스",
    movementId: "impressionism-post-impressionism",
    bio: "나뭇잎 사이로 부서지는 햇살과 인물의 따뜻한 피부 톤을 풍요롭고 화사한 색채로 그려낸 인상주의 대표 화가입니다."
  },
  {
    artistKo: "폴 세잔",
    artistEn: "Paul Cézanne",
    lifespan: "1839 - 1906",
    origin: "프랑스 (엑상프로방스)",
    movementId: "impressionism-post-impressionism",
    bio: "인상주의의 색채에 견고한 구조와 질서를 부여하여 '현대 회화의 아버지'로 불리며 입체주의 탄생의 토대를 마련했습니다."
  },
  {
    artistKo: "빈센트 반 고흐",
    artistEn: "Vincent van Gogh",
    lifespan: "1853 - 1890",
    origin: "네덜란드 / 프랑스",
    movementId: "impressionism-post-impressionism",
    bio: "강렬한 노란색과 푸른색의 대비, 역동적인 붓질을 통해 자연과 인간 내면의 격정적인 생명력을 표현한 후기인상주의의 거장입니다."
  },
  {
    artistKo: "폴 고갱",
    artistEn: "Paul Gauguin",
    lifespan: "1848 - 1903",
    origin: "프랑스 / 타히티",
    movementId: "impressionism-post-impressionism",
    bio: "서구 문명을 떠나 브르타뉴와 남태평양 타히티에서 원시적 생명력과 비자연주의적 순수 색채(종합주의)를 탐구했습니다."
  },
  {
    artistKo: "구스타프 클림트",
    artistEn: "Gustav Klimt",
    lifespan: "1862 - 1918",
    origin: "오스트리아 (빈)",
    movementId: "symbolism-jugendstil",
    bio: "빈 분리파의 초대 회장으로, 화려한 장식적 패턴과 우아한 선율, 인물의 섬세한 내면 심리를 결합한 세기말 미술의 거장입니다."
  },
  {
    artistKo: "프란츠 폰 슈투크",
    artistEn: "Franz von Stuck",
    lifespan: "1863 - 1928",
    origin: "독일 (뮌헨)",
    movementId: "symbolism-jugendstil",
    bio: "뮌헨 분리파의 공동 창립자이자 바실리 칸딘스키·파울 클레의 스승으로, 신화적·관능적 주제의 상징주의 회화로 명성을 떨쳤습니다."
  },
  {
    artistKo: "아돌프 멘첼",
    artistEn: "Adolph von Menzel",
    lifespan: "1815 - 1905",
    origin: "독일 (베를린)",
    movementId: "realism-biedermeier",
    bio: "19세기 독일 사실주의의 거장으로, 역사화뿐 아니라 빛과 일상 공간의 순간을 포착한 대담한 유화 습작으로 근대 회화를 앞당겼습니다."
  },
  {
    artistKo: "아르놀트 뵈클린",
    artistEn: "Arnold Böcklin",
    lifespan: "1827 - 1901",
    origin: "스위스 / 독일 (뮌헨)",
    movementId: "symbolism-jugendstil",
    bio: "신화적 존재와 몽환적인 풍경을 결합하여 삶과 죽음, 자연의 신비를 탐구한 독일어권 상징주의의 대표 화가입니다."
  },
  {
    artistKo: "안젤름 포이어바흐",
    artistEn: "Anselm Feuerbach",
    lifespan: "1829 - 1880",
    origin: "독일",
    movementId: "neoclassicism-romanticism",
    bio: "이탈리아 고전미술의 이상미를 계승하여 웅장하고 고요한 서사적·신화적 인물화를 남긴 독일 19세기 대표 화가입니다."
  },
  {
    artistKo: "한스 폰 마레",
    artistEn: "Hans von Marées",
    lifespan: "1837 - 1887",
    origin: "독일 / 이탈리아 로마",
    movementId: "symbolism-jugendstil",
    bio: "자연과 인간의 조화로운 이상향을 단순화된 조형미와 깊은 색채로 탐구하여 20세기 독일 모더니즘에 큰 영향을 주었습니다."
  },
  {
    artistKo: "카미유 피사로",
    artistEn: "Camille Pissarro",
    lifespan: "1830 - 1903",
    origin: "프랑스",
    movementId: "impressionism-post-impressionism",
    bio: "모든 인상주의 전시에 참여한 유일한 화가이자 세잔과 고갱의 스승으로, 시골 풍경과 파리 거리의 빛을 따뜻하게 담아냈습니다."
  },
  {
    artistKo: "알프레드 시슬레",
    artistEn: "Alfred Sisley",
    lifespan: "1839 - 1899",
    origin: "프랑스 / 영국",
    movementId: "impressionism-post-impressionism",
    bio: "일드프랑스 지역의 강변과 하늘, 계절의 미묘한 빛의 변화를 가장 순수한 인상주의적 감수성으로 포착한 풍경화가입니다."
  },
  {
    artistKo: "조르주 쇠라",
    artistEn: "Georges Seurat",
    lifespan: "1859 - 1891",
    origin: "프랑스 (파리)",
    movementId: "impressionism-post-impressionism",
    bio: "색채 광학 이론을 바탕으로 순수 색점을 병치하는 점묘법(신인상주의)을 창시하여 회화에 과학적 질서를 부여했습니다."
  },
  {
    artistKo: "앙리 드 툴루즈로트레크",
    artistEn: "Henri de Toulouse-Lautrec",
    lifespan: "1864 - 1901",
    origin: "프랑스 (파리)",
    movementId: "impressionism-post-impressionism",
    bio: "파리 몽마르트르의 카바레와 무희, 보헤미안들의 삶을 날카로운 관찰력과 대담한 선묘·색면으로 포착한 벨 에포크의 기록자입니다."
  },
  {
    artistKo: "막스 리버만",
    artistEn: "Max Liebermann",
    lifespan: "1847 - 1935",
    origin: "독일 (베를린)",
    movementId: "impressionism-post-impressionism",
    bio: "베를린 분리파를 이끈 독일 인상주의의 최고봉으로, 야외의 밝은 햇살 아래 시민의 여가와 정원 풍경을 경쾌한 붓질로 그렸습니다."
  },
  {
    artistKo: "로비스 코린트",
    artistEn: "Lovis Corinth",
    lifespan: "1858 - 1925",
    origin: "독일 (뮌헨/베를린)",
    movementId: "impressionism-post-impressionism",
    bio: "뮌헨과 베를린에서 활동하며 인상주의에서 출발해 말년에는 격정적이고 표현주의적인 붓터치로 독자적 경지를 이룬 거장입니다."
  },
  {
    artistKo: "막스 슬레포크트",
    artistEn: "Max Slevogt",
    lifespan: "1868 - 1932",
    origin: "독일 (뮌헨/베를린)",
    movementId: "impressionism-post-impressionism",
    bio: "리버만·코린트와 함께 독일 인상주의 3대 거장으로 꼽히며, 생동감 넘치는 빛의 표현과 역동적인 인물·풍경화로 유명합니다."
  },
  {
    artistKo: "위베르 로베르",
    artistEn: "Hubert Robert",
    lifespan: "1733 - 1808",
    origin: "프랑스 (파리)",
    movementId: "rococo-veduta",
    bio: "고대 로마의 폐허와 낭만적인 정원 풍경을 시적인 빛과 웅장한 스케일로 그려 '폐허의 로베르'라 불린 18세기 프랑스 풍경화가입니다."
  },
  {
    artistKo: "토머스 게인즈버러",
    artistEn: "Thomas Gainsborough",
    lifespan: "1727 - 1788",
    origin: "영국",
    movementId: "neoclassicism-romanticism",
    bio: "우아하고 경쾌한 붓질로 인물과 자연 풍경을 조화롭게 결합하여 18세기 영국 초상화와 풍경화의 전성기를 이끈 거장입니다."
  },
  {
    artistKo: "안겔리카 카우프만",
    artistEn: "Angelika Kauffmann",
    lifespan: "1741 - 1807",
    origin: "스위스 / 영국 / 로마",
    movementId: "neoclassicism-romanticism",
    bio: "영국 왕립미술원 창립 회원이자 로마에서 활약한 대표적 신고전주의 화가로, 섬세한 감수성의 초상화와 고전 역사화로 유럽 전역에서 명성을 떨쳤습니다."
  },
  {
    artistKo: "안토니오 카노바",
    artistEn: "Antonio Canova",
    lifespan: "1757 - 1822",
    origin: "이탈리아 (베네치아/로마)",
    movementId: "neoclassicism-romanticism",
    bio: "고대 그리스 조각의 이상적 균형미와 대리석의 매끄러운 관능미를 결합하여 유럽 신고전주의 조각의 절대적 기준을 세운 거장입니다."
  },
  {
    artistKo: "조지프 말로드 윌리엄 터너",
    artistEn: "Joseph Mallord William Turner",
    lifespan: "1775 - 1851",
    origin: "영국 (런던)",
    movementId: "neoclassicism-romanticism",
    bio: "폭풍우와 태양, 바다의 대기 효과를 형태가 녹아내릴 듯한 빛과 색채의 소용돌이로 표현하여 인상주의와 추상미술을 예견한 '빛의 화가'입니다."
  },
  {
    artistKo: "존 컨스터블",
    artistEn: "John Constable",
    lifespan: "1776 - 1837",
    origin: "영국",
    movementId: "neoclassicism-romanticism",
    bio: "고향 서퍽의 전원 풍경과 시시각각 변하는 구름·빛의 효과를 야외 유화 스케치로 생생하게 포착해 프랑스 낭만주의와 바르비종 화파에 영감을 주었습니다."
  },
  {
    artistKo: "외젠 들라크루아",
    artistEn: "Eugène Delacroix",
    lifespan: "1798 - 1863",
    origin: "프랑스 (파리)",
    movementId: "neoclassicism-romanticism",
    bio: "프랑스 낭만주의 회화의 기수로, 이국적인 주제와 역동적인 구도, 보색 대비를 활용한 강렬한 색채로 근대 색채 해방의 문을 열었습니다."
  },
  {
    artistKo: "테오도르 제리코",
    artistEn: "Théodore Géricault",
    lifespan: "1791 - 1824",
    origin: "프랑스",
    movementId: "neoclassicism-romanticism",
    bio: "극적인 명암 대비와 격정적인 생명력, 인간 심리의 극한에 대한 사실적 탐구로 프랑스 낭만주의 회화의 탄생을 알린 천재 화가입니다."
  },
  {
    artistKo: "카를 로트만",
    artistEn: "Carl Rottmann",
    lifespan: "1797 - 1850",
    origin: "독일 (하이델베르크/뮌헨)",
    movementId: "neoclassicism-romanticism",
    bio: "바이에른 국왕 루트비히 1세의 후원으로 이탈리아와 그리스의 장엄한 고전 풍경을 극적인 빛과 서사적 구도로 담아낸 뮌헨 낭만주의 거장입니다."
  },
  {
    artistKo: "카를 블레헨",
    artistEn: "Carl Blechen",
    lifespan: "1798 - 1840",
    origin: "독일 (베를린)",
    movementId: "neoclassicism-romanticism",
    bio: "낭만주의의 신비로운 자연관에 이탈리아의 눈부신 햇살과 즉흥적인 외광파적 붓질을 결합해 독일 근대 풍경화의 선구가 되었습니다."
  },
  {
    artistKo: "요제프 카를 슈틸러",
    artistEn: "Joseph Karl Stieler",
    lifespan: "1781 - 1858",
    origin: "독일 (뮌헨)",
    movementId: "neoclassicism-romanticism",
    bio: "바이에른 왕실 궁정화가로, 님펜부르크 궁전의 '미인 갤러리'와 괴테 초상화 등 세련되고 기품 있는 신고전주의·비더마이어 초상화로 유명합니다."
  },
  {
    artistKo: "장프랑수아 밀레",
    artistEn: "Jean-François Millet",
    lifespan: "1814 - 1875",
    origin: "프랑스 (바르비종)",
    movementId: "realism-biedermeier",
    bio: "바르비종 화파의 핵심 인물로, 대지 위에서 묵묵히 일하는 농민들의 고단한 노동과 경건한 존엄성을 숭고한 조형미로 그려냈습니다."
  },
  {
    artistKo: "오노레 도미에",
    artistEn: "Honoré Daumier",
    lifespan: "1808 - 1879",
    origin: "프랑스 (파리)",
    movementId: "realism-biedermeier",
    bio: "날카로운 사회 풍자 판화가이자 화가로, 굵은 윤곽선과 극적인 명암을 통해 서민의 애환과 인간 군상의 본질을 힘차게 포착했습니다."
  },
  {
    artistKo: "아르놀트 뵈클린",
    artistEn: "Arnold Böcklin",
    lifespan: "1827 - 1901",
    origin: "스위스 / 독일 (뮌헨)",
    movementId: "symbolism-jugendstil",
    bio: "신화적 존재와 몽환적인 풍경을 결합하여 삶과 죽음, 자연의 신비를 탐구한 독일어권 상징주의의 대표 화가입니다."
  },
  {
    artistKo: "폴 시냐크",
    artistEn: "Paul Signac",
    lifespan: "1863 - 1935",
    origin: "프랑스 (파리)",
    movementId: "impressionism-post-impressionism",
    bio: "조르주 쇠라와 함께 신인상주의(점묘법)를 이끈 화가로, 모자이크처럼 빛나는 순수 색채의 병치로 지중해와 항구의 눈부신 빛을 표현했습니다."
  },
  {
    artistKo: "조반니 세간티니",
    artistEn: "Giovanni Segantini",
    lifespan: "1858 - 1899",
    origin: "이탈리아 / 스위스 알프스",
    movementId: "impressionism-post-impressionism",
    bio: "알프스 고산 지대의 순수한 빛을 분할주의 기법으로 포착하는 동시에 자연과 모성, 죽음에 대한 상징주의적 서사를 결합한 거장입니다."
  },
  {
    artistKo: "오귀스트 로댕",
    artistEn: "Auguste Rodin",
    lifespan: "1840 - 1917",
    origin: "프랑스 (파리)",
    movementId: "symbolism-jugendstil",
    bio: "빛을 머금는 거친 표면 질감과 역동적인 인체 표현으로 고전 조각의 관습을 깨뜨린 현대 조각의 아버지입니다."
  },
  {
    artistKo: "제임스 앙소르",
    artistEn: "James Sidney Ensor",
    lifespan: "1860 - 1949",
    origin: "벨기에 (오스텐더)",
    movementId: "symbolism-jugendstil",
    bio: "가면과 해골, 기괴한 카니발 이미지를 강렬한 색채로 그려내어 20세기 표현주의와 초현실주의에 지대한 영향을 미친 벨기에 상징주의 거장입니다."
  },
  {
    artistKo: "페르디난트 호들러",
    artistEn: "Ferdinand Hodler",
    lifespan: "1853 - 1918",
    origin: "스위스",
    movementId: "symbolism-jugendstil",
    bio: "인물과 풍경의 리드미컬한 반복 구도(평행주의)와 기념비적인 선묘를 통해 삶의 순환과 자연의 영원성을 탐구한 상징주의 거장입니다."
  },
  {
    artistKo: "에곤 실레",
    artistEn: "Egon Schiele",
    lifespan: "1890 - 1918",
    origin: "오스트리아 (빈)",
    movementId: "symbolism-jugendstil",
    bio: "클림트의 후계자로 출발해 뒤틀린 인체와 날카롭고 거친 선묘를 통해 인간 내면의 불안과 고독, 실존적 고뇌를 적나라하게 드러낸 표현주의 천재입니다."
  },
  {
    artistKo: "파블로 피카소",
    artistEn: "Pablo Picasso",
    lifespan: "1881 - 1973",
    origin: "스페인 / 프랑스",
    movementId: "symbolism-jugendstil",
    bio: "20세기 현대 미술의 거장으로, 알테 피나코테크에 임시 전시 중인 청색시대(1903년) 걸작 〈마담 솔레르의 초상〉에서 우울하고 고귀한 시적 감수성을 보여줍니다."
  }
];