// Master data covering recommended viewing routes by duration
// Loaded before app.js via <script src="./viewingRoutesMaster.js"></script>

const VIEWING_ROUTES = [
  {
    id: "route-1h",
    durationBadge: "약 60분 · 핵심 압축",
    title: "1시간 코스: 르네상스부터 바로크까지 절대 걸작 하이라이트",
    targetAudience: "짧은 시간 안에 알테 피나코텍의 상징적 대표작만 집중 관람하려는 분",
    summary:
      "1층(OG)의 핵심 대형 홀(Saal) 위주로 동선을 최소화하여, 알브레히트 뒤러·라파엘로·레오나르도 다 빈치·루벤스·렘브란트 등 미술사를 바꾼 거장들의 대표작만 빠르게 만나는 정예 코스입니다.",
    tips: [
      "중앙 계단을 올라 1층(OG) 동쪽 윙(Saal I~IV)에서 시작해 서쪽 윙(Saal VII~IX)으로 직진하는 동선입니다.",
      "작은 소전시실(Kabinett)은 과감히 생략하고 대형 홀(Saal) 중앙의 핵심 걸작에 집중하세요."
    ],
    steps: [
      {
        stepNumber: 1,
        roomLabel: "AP OG -> Saal I & II (독일·초기 네덜란드 르네상스)",
        estimatedTime: "15분",
        focusTitle: "북유럽 르네상스의 자의식과 정밀 묘사",
        description:
          "알브레히트 뒤러의 〈모피 코트를 입은 자화상〉과 〈사도 요한과 베드로〉, 로히어르 판 데르 베이던의 〈성 콜룸바 제단화〉, 알트도르퍼의 〈알렉산더 대왕의 전투〉를 감상합니다.",
        featuredArtists: ["Albrecht Dürer", "Rogier van der Weyden", "Albrecht Altdorfer", "Stefan Lochner"]
      },
      {
        stepNumber: 2,
        roomLabel: "AP OG -> Saal IV & V (이탈리아 전성기 & 베네치아 르네상스)",
        estimatedTime: "20분",
        focusTitle: "다 빈치, 라파엘로, 티치아노의 황금기",
        description:
          "레오나르도 다 빈치의 〈카네이션의 성모〉, 라파엘로의 〈카니자니의 성가족〉과 〈템피의 성모〉에서 완벽한 피라미드 구도를 확인한 뒤, Saal V로 이동해 티치아노의 〈카를 5세 초상〉과 〈가시면류관을 쓰신 그리스도〉의 강렬한 색채를 만납니다.",
        featuredArtists: ["Leonardo da Vinci", "Raffael", "Sandro Botticelli", "Tiziano Vecellio (Tizian)"]
      },
      {
        stepNumber: 3,
        roomLabel: "AP OG -> Saal VII (루벤스 홀)",
        estimatedTime: "15분",
        focusTitle: "세계 최대 규모의 루벤스 컬렉션",
        description:
          "알테 피나코텍의 백미인 거대한 루벤스 홀입니다. 압도적인 크기의 〈최후의 심판〉과 역동적인 〈아마존 전투〉, 화가 부부의 애정이 담긴 〈인동덩굴 정자의 자화상〉을 감상합니다.",
        featuredArtists: ["Peter Paul Rubens", "Anthonis van Dyck"]
      },
      {
        stepNumber: 4,
        roomLabel: "AP OG -> Saal IX (네덜란드 황금시대 & 렘브란트)",
        estimatedTime: "10분",
        focusTitle: "빛과 내면 심리의 거장 렘브란트",
        description:
          "렘브란트의 〈성가족〉과 〈십자가에서 내려지는 그리스도〉에서 어둠을 가르는 황금빛 명암법(키아로스쿠로)을 감상하며 1시간 코스를 마무리합니다.",
        featuredArtists: ["Rembrandt Harmensz. van Rijn", "Frans Hals"]
      }
    ]
  },
  {
    id: "route-2h",
    durationBadge: "약 120분 · 표준 정통",
    title: "2시간 코스: 서양 미술사 500년 연대기 정통 일주",
    targetAudience: "14세기 중세 말부터 18세기 로코코까지 미술사의 흐름을 균형 있게 감상하려는 분",
    summary:
      "1층(OG)의 주요 홀(Saal)과 핵심 소전시실(Kabinett)을 시대순으로 훑으며, 북유럽과 남유럽 회화의 양식 변화 및 스페인·프랑스·베네치아 거장들의 작품까지 폭넓게 아우르는 표준 추천 코스입니다.",
    tips: [
      "대형 홀(Saal) 감상 후 인접한 측면 소전시실(Kabinett)에 들러 세밀화와 초상화를 가까이서 감상하세요.",
      "중간 휴식이 필요하다면 Saal VII(루벤스 홀) 관람 후 카페테리아에서 잠시 쉬어가는 것이 좋습니다."
    ],
    steps: [
      {
        stepNumber: 1,
        roomLabel: "AP OG -> Saal I, II, IIa, IIb (플랑드르 & 독일 르네상스)",
        estimatedTime: "30분",
        focusTitle: "유화 기법의 탄생과 북유럽 거장들",
        description:
          "슈테판 로흐너의 황금빛 고딕 화풍에서 시작해 디르크 바우츠, 한스 멤링의 보석 같은 유화 질감을 살펴보고, 뒤러와 크라나흐, 피터르 브뤼헐의 농민 풍속화까지 폭넓게 감상합니다.",
        featuredArtists: ["Albrecht Dürer", "Pieter Bruegel d. Ä.", "Lucas Cranach d. Ä.", "Hans Memling"]
      },
      {
        stepNumber: 2,
        roomLabel: "AP OG -> Kabinett 1-4 & Saal IV, V (이탈리아 르네상스 & 매너리즘)",
        estimatedTime: "35분",
        focusTitle: "조토에서 엘 그레코까지 이탈리아 회화의 진화",
        description:
          "Kabinett의 조토·프라 안젤리코·보티첼리 소품들을 거쳐 Saal IV의 다 빈치·라파엘로, Saal V의 티치아노·틴토레토, 그리고 매너리즘의 극치를 보여주는 엘 그레코의 〈그리스도의 옷을 벗김〉을 감상합니다.",
        featuredArtists: ["Giotto di Bondone", "Fra Angelico", "Leonardo da Vinci", "Raffael", "Jacopo Tintoretto", "El Greco"]
      },
      {
        stepNumber: 3,
        roomLabel: "AP OG -> Saal VI, VII, VIII & Kabinett 11-12 (플랑드르 바로크)",
        estimatedTime: "30분",
        focusTitle: "루벤스 공방과 플랑드르 바로크의 화려함",
        description:
          "루벤스의 대작들과 더불어 수제자 반 다이크의 우아한 초상화, 야코프 요르단스의 생동감 넘치는 신화화, 얀 브뤼헐의 정교한 꽃 정물화를 비교하며 감상합니다.",
        featuredArtists: ["Peter Paul Rubens", "Anthonis van Dyck", "Jacob Jordaens", "Jan Brueghel d. Ä."]
      },
      {
        stepNumber: 4,
        roomLabel: "AP OG -> Saal IX, X, XII & Kabinett 20-22 (네덜란드·스페인·로코코)",
        estimatedTime: "25분",
        focusTitle: "시민의 일상과 18세기 우아한 살롱의 시대",
        description:
          "렘브란트·프란스 할스·라위스달의 네덜란드 회화를 본 뒤, 스페인의 벨라스케스·무리요, 프랑스 고전주의 푸생과 로코코의 부셰(〈퐁파두르 부인〉), 카날레토의 베네치아 풍경화로 여정을 마칩니다.",
        featuredArtists: ["Rembrandt Harmensz. van Rijn", "Diego Velázquez", "Bartolomé Esteban Murillo", "François Boucher", "Canaletto (Giovanni Antonio Canal)"]
      }
    ]
  },
  {
    id: "route-3h",
    durationBadge: "약 180분+ · 심층 완전정복",
    title: "3시간+ 코스: 1층 올드 마스터 + 지하층(EG) 19세기 근대 명화 완전정복",
    targetAudience: "노이 피나코테크(Neue Pinakothek) 임시전시 작품(고흐·모네·클림트·프리드리히)까지 모두 관람하려는 분",
    summary:
      "알테 피나코텍 1층(OG)의 14~18세기 거장들과 더불어, 현재 지하층(EG)에 특별 전시 중인 노이 피나코테크 소장 19세기 낭만주의·사실주의·인상주의·상징주의 걸작까지 완벽하게 아우르는 심층 코스입니다.",
    tips: [
      "체력 안배를 위해 1층(OG) 관람에 약 110분, 카페 휴식 20분, 지하층(EG) 관람에 약 50~60분을 배분하세요.",
      "지하층(EG)에서는 본 앱의 소장처 필터에서 '노이 피나코테크 임시전시(NP)'를 선택하면 현재 전시작을 바로 확인할 수 있습니다."
    ],
    steps: [
      {
        stepNumber: 1,
        roomLabel: "AP OG 전체 (동쪽 윙 -> 중앙 홀 -> 서쪽 윙)",
        estimatedTime: "110분",
        focusTitle: "14~18세기 올드 마스터 전관 심층 관람",
        description:
          "2시간 코스의 모든 전시실에 더해 작은 캐비닛 방들의 숨은 보석(헤라르트 다우의 극세밀화, 아드리안 브라우어르의 풍속화, 샤르댕의 고요한 정물화 등)까지 여유롭게 음미합니다.",
        featuredArtists: ["Albrecht Dürer", "Leonardo da Vinci", "Raffael", "Peter Paul Rubens", "Rembrandt Harmensz. van Rijn", "Jean-Baptiste Siméon Chardin"]
      },
      {
        stepNumber: 2,
        roomLabel: "AP EG -> Saal IIb, III & Kabinett 1, 4-7 (낭만주의 & 신고전주의)",
        estimatedTime: "25분",
        focusTitle: "지하층(EG) 이동: 독일 낭만주의와 비더마이어의 정서",
        description:
          "지하층으로 내려와 카스파 다비트 프리드리히의 명상적 풍경화, 터너와 들라크루아의 역동적 색채, 고야의 강렬한 필치, 그리고 카를 슈피츠베크의 유머러스한 소시민 풍속화를 감상합니다.",
        featuredArtists: ["Caspar David Friedrich", "Joseph Mallord William Turner", "Francisco José de Goya y Lucientes", "Carl Spitzweg"]
      },
      {
        stepNumber: 3,
        roomLabel: "AP EG -> Saal I, II, IIa & Kabinett 2 (사실주의·인상주의·세기말)",
        estimatedTime: "35분",
        focusTitle: "마네·모네·반 고흐·클림트로 이어지는 모더니즘의 여명",
        description:
          "쿠르베와 빌헬름 라이블의 사실주의를 거쳐 마네, 모네, 드가, 르누아르, 세잔의 빛과 색채 혁명을 만납니다. 마지막으로 반 고흐의 〈해바라기〉와 구스타프 클림트의 초상화로 600년 미술사 대장정을 마무리합니다.",
        featuredArtists: ["Édouard Manet", "Claude Monet", "Paul Cézanne", "Vincent van Gogh", "Gustav Klimt", "Egon Schiele"]
      }
    ]
  }
];