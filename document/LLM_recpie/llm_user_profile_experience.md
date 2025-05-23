# LLM 기반 사용자 특성(취향/기타사항) 추출 전략 도입 경험

## 문제 상황

체질 진단 후, 사용자와의 대화에서 취향·알레르기·선호/비선호 재료 등 다양한 특성을 추출해 맞춤 레시피를 제공하고자 했습니다. 하지만 기존 방식으로는 다음과 같은 문제가 있었습니다.

---

## 기존 시도와 한계

### 1. 키워드/엔티티 추출 기반(규칙/사전 기반)
- 미리 정의한 키워드(예: "맵다", "닭고기", "알레르기")와 매칭하여 특성 추출
- **문제점:**
  - 사용자가 다양한 표현(은유, 오타, 복합문장 등)으로 말할 경우 놓치는 정보가 많음
  - 새로운 취향/트렌드 반영이 어려움
  - 대화 맥락(이전 발화와의 연결, 부정/긍정 등) 파악이 미흡

### 2. 단순 규칙/정규표현식 기반
- "~을 좋아해요", "~은 싫어요" 등 패턴 매칭
- **문제점:**
  - 문장 구조가 조금만 달라져도 인식 실패
  - 복합 취향(예: "닭고기는 좋아하지만 튀긴 건 싫어요") 처리 어려움
  - 부정/이중 부정 등 자연어의 뉘앙스 반영 한계

---

## LLM 기반 접근으로의 전환

### 도입 배경
- 위 방식들은 실제 사용자 대화의 다양성과 맥락을 충분히 반영하지 못해, **정확한 특성 추출이 어려웠음**
- LLM은 자연어 이해력이 뛰어나고, 맥락·의도·감정 등도 파악 가능하다는 점에 주목

### LLM 활용 전략
- 일정 대화가 쌓이면, 전체 대화(또는 최근 대화)를 LLM에 입력하여
  - "이 사용자의 음식 취향, 알레르기, 선호/비선호 재료, 기타 특이사항을 표로 정리해줘" 등 프롬프트로 요약/구조화
- 예시 프롬프트:
  ```
  아래는 사용자와의 대화입니다. 이 사용자의 음식 취향, 알레르기, 선호하는 재료, 싫어하는 재료, 기타 특이사항을 표로 정리해줘.
  ---
  {대화 전체}
  ```
- LLM이 다양한 표현, 맥락, 부정/긍정, 복합 취향까지 자연스럽게 추출

---

## LLM 도입 후 효과

- **표현 다양성/복합성 대응:**
  - 사용자가 "맵고 짠 건 별로지만, 가끔은 매운 닭볶음탕이 땡겨요"처럼 말해도, LLM이 맥락을 이해해 정확히 구조화
- **신규 취향/트렌드 반영:**
  - 사전/규칙에 없는 새로운 재료, 조리법, 트렌드도 LLM이 자연스럽게 추출
- **대화 맥락/감정까지 반영:**
  - 이전 대화에서 언급된 내용, 감정 변화(예: "요즘은 건강식에 관심이 많아요") 등도 프로필에 반영
- **유지보수/확장성 향상:**
  - 규칙 추가/수정 없이 LLM 프롬프트만 조정하면 다양한 요구에 대응 가능

---

## 결론 및 어필 포인트

- 다양한 시도(키워드/규칙 기반)에서 한계를 경험한 후, LLM 기반 전략으로 전환하여 **사용자 특성 추출의 정확도와 유연성**을 크게 높일 수 있었습니다.
- 이 경험을 통해, 실제 서비스에서 LLM의 자연어 이해력과 맥락 파악 능력을 적극 활용하여, **맞춤형 레시피 추천의 품질을 한 단계 끌어올린 사례**임을 어필할 수 있습니다. 