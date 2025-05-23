아래는 레시피 생성 챗봇의 성능을 평가하기 위한 전반적인 전략들입니다. 자동화된 지표와 사람(휴먼)평가를 절묘하게 조합하여 다양한 관점에서 챗봇의 품질을 측정할 수 있도록 구성했습니다.

────────────────────────────────────  
1. 평가 준비 단계  
────────────────────────────────────  
1-1. 기준 데이터셋 구축  
  - 실제 사용자 입력(예: “여름에 먹기 좋은 한방 보양식 레시피 추천해줘”)과, 도메인 전문가(한의사·영양사)가 만든 ‘정답 레시피(골드 스탠다드)’ 쌍 쿼리–레시피를 수집  
  - 충분한 케이스(체질별, 식단 목적별, 재료 제약별 등)로 커버리지 확보  
  - 발화별로 메타데이터(체질 유형, 알러지, 열량 제한 등) 라벨링  

1-2. 평가 환경 구성  
  - 모델 A/B 버전별로 동일한 테스트 쿼리를 던질 수 있는 평가 파이프라인  
  - 자동 지표 계산 모듈과 휴먼 평가 플랫폼(설문지·웹 UI) 연동  

────────────────────────────────────  
2. 자동화된 정량적(Quantitative) 지표  
────────────────────────────────────  
2-1. 텍스트 유사도 기반 지표  
  - BLEU / ROUGE / METEOR: 생성문과 골드 스탠다드 레시피의 n-gram 겹침 비율  
  - BERTScore: 문장 임베딩 기반 어휘 유사도(의미적 일치도) 측정  
  - Sentence Mover’s Similarity / MoverScore: 전체 레시피 간 의미적 거리  

2-2. 도메인 특화 메트릭  
  - 재료 커버리지(Coverage): 골드 레시피에 등장하는 주요 재료(예: 인삼, 닭고기 등) 중 챗봇이 얼마나 포함했는지 비율  
  - 영양소 오차(Nutrition Error): 생성 레시피의 칼로리·단백질·탄수화물·지방 함량을 영양사 기준 레시피와 비교해 오차 계산  
  - 알러지/제약 위반률: 요청 시 제외해야 할 재료(알러지·종교·채식 등)를 생성 레시피가 얼마나 정확히 배제했는지  

2-3. 다양성 및 창의성  
  - Distinct-n: 생성된 레시피 내에서 중복되지 않는 n-gram 비율로 다양성 측정  
  - Novelty: 골드 데이터베이스에 없는 조합(예: 특정 한약재+새로운 조리법) 비율  

2-4. 응답 속도·안정성  
  - Latency: 평균 응답 시간 및 95백분위 응답 시간  
  - 안정성: 동일 쿼리에 대한 응답 실패율 또는 타임아웃 비율  

────────────────────────────────────  
3. 휴먼 평가(Human Evaluation)  
────────────────────────────────────  
3-1. 평가 항목 정의 (Likert 1~5점)  
  1) 적절성(Relevance)  
    - “체질·요청사항에 맞는 레시피인가?”  
  2) 완전성(Completeness)  
    - “조리 순서·재료·분량이 충분히 상세한가?”  
  3) 명료성(Clarity)  
    - “조리법 설명이 이해하기 쉬운가?”  
  4) 창의성(Creativity)  
    - “새롭고 흥미로운 아이디어가 포함되었는가?”  
  5) 신뢰성(Trustworthiness)  
    - “한방 식재료·효능 설명이 전문적으로 느껴지는가?”  

3-2. 평가자 구성  
  - 도메인 전문가(한의사·영양사)  
  - 일반 사용자(목적에 맞게 평가)  
  - 최소 3인 이상의 크로스 평가로 점수 평균  

3-3. 휴먼 평가 절차  
  - 블라인드 A/B 테스트: 서로 다른 모델 버전이 섞인 출력물을 사용자에게 랜덤 제공  
  - 평가 결과 통계화(평균·표준편차·유의미 차이 검정)  

────────────────────────────────────  
4. 온라인 실험(실사용 데이터 기반)  
────────────────────────────────────  
4-1. A/B 테스팅  
  - 프로덕션 환경에서 일정 트래픽을 두 그룹(신버전 vs 기존) 배분  
  - 클릭율(CTR), 레시피 저장률, 실제 레시피 실행(조회→북마크→장바구니→구매) 전환율 측정  

4-2. 사용자 만족도 설문  
  - 챗봇 대화 후 NPS(Net Promoter Score), CSAT(Customer Satisfaction) 조사  
  - 자유 응답 피드백 수집  

4-3. 롱텀 지표  
  - 재방문율·구독 전환율  
  - 사용자 이탈(이용 중단) 추적  

────────────────────────────────────  
5. 평가 결과 활용 및 개선 로드맵  
────────────────────────────────────  
5-1. 자동 지표 ↔ 휴먼 평가 간 상관관계 분석  
  - BLEU 등 기계 지표와 휴먼 적합도 점수 간의 상관관계 확인  
  - 상관 낮은 지표 교체 또는 보완  

5-2. 에러 케이스 클러스터링  
  - 성능이 낮았던 쿼리를 유형(재료 제약, 복합 질의, 간단 레시피 등)별로 분류  
  - 각 유형에 특화된 프롬프트·사전·후처리 전략 적용  

5-3. 주기적 재평가  
  - 모델 업데이트 시마다 동일 프로세스로 재실행  
  - 성능 향상 트렌드 모니터링  

────────────────────────────────────  
위 전략들을 조합하면 레시피 생성 챗봇의 **정확성·전문성·창의성·사용성·비즈니스 효과**를 다각도로 평가할 수 있습니다.  
필요에 따라 자동 평가 ↔ 휴먼 평가 비중, 온라인 실험 규모를 조정해가며 최적의 밸런스를 찾아가시기 바랍니다.
