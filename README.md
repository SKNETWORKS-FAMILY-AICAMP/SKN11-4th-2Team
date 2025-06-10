# SKN 11기 3차 프로젝트

## 👥 팀 소개
### 팀명 : 마파덜
### 👨‍🍼 프로젝트명
### 마파덜(MAPA-DUL)
‘Mother’와 ‘Father’를 위한, 육아의 부담을 덜어주는 웹서비스 및 AI 챗봇 플랫폼입니다.
<br><br>

### 팀 멤버

| 김형주 | 신준희 | 이현대 | 이현민 |
|:-----:|:-----:|:-----:|:-----:|
| <img src="./images/해핑.png" width="100"/> | <img src="./images/주네핑.png" width="100"/> | <img src="./images/똑똑핑.png" width="100"/> | <img src="./images/나그네핑.png" width="100"/> |
| [@형주핑](https://github.com/Kim-Hyeong-Ju) | [@준희핑](https://github.com/hybukimo) | [@현대핑](https://github.com/kicet3) | [@현민핑](https://github.com/hyunmin6109) |

<br><br>

## 프로젝트 개요


### 📆 프로젝트 기간
2025-05-26 ~ 2025-06-11
<br><br>

### 📌 프로젝트 소개

본 프로젝트는 육아에 익숙하지 않은 초보 부모님들을 위해 설계된 웹 기반 서비스이자 AI 챗봇입니다. 최소한의 질문만으로도 검증된 육아 정보를 신속하고 정확하게 제공하여, 부모님의 불안과 고민을 효과적으로 해소합니다.
<br><br><br>

### ❗ 프로젝트 필요성

- 저출산 현상이 지속되는 한국 사회에서, 초보 부모들은 육아 정보의 부족과 그로 인한 불안을 동시에 경험하고 있습니다.
- 특히 아이의 건강과 관련된 의료적 문제는 단순한 인터넷 검색만으로는 해결하기 어려워, 신뢰할 수 있는 전문적 조언의 필요성이 점점 커지고 있습니다.
- 이에 따라, 전문 정보를 쉽게 제공하는 웹서비스, 육아 특화 AI 챗봇, 그리고 공감과 지지를 주고받을 수 있는 부모 커뮤니티는 실질적인 해결책이 될 수 있습니다.
<br><br><br>

### 🎯 프로젝트 목표

- 초보 부모들이 겪는 육아 고민을 신속하고 정확하게 해결할 수 있도록 지원합니다.  
- 공신력 있는 문서를 기반으로 한 AI 챗봇을 구축하여 사용자 신뢰도를 확보합니다.  
- 누구나 쉽게 접근할 수 있는 웹 기반 플랫폼을 통해 육아 정보의 격차를 해소합니다.
<br><br><br>

## ⚒️ 기술 스택

| 카테고리 | 기술 스택 |
|:---------:|:-----------:|
| 사용 언어 | <img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white" height="20"/> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white" height="20"/> |
| 프레임 워크 | <img src="https://img.shields.io/badge/django-092E20?style=for-the-badge&logo=django&logoColor=white" height="20"/> <img src="https://img.shields.io/badge/fastapi-009688?style=for-the-badge&logo=next.js&logoColor=white" height="20"/> |
| Database | <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=next.js&logoColor=white" height="20"/> |
| LLM 모델 | <img src="https://img.shields.io/badge/exaone-A50034?style=for-the-badge&logo=lg&logoColor=white" height="20"/> |
| UI | <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" height="20"/>

<br><br>


## 시스템 아키텍쳐
<img src="./images/시스템 아키텍처.png" width="100%"/>
<br><br><br>

## 📜요구사항 명세서

<br><br><br>



## WBS

| Phase         | Task                     | 담당자      | 기간            | 진척율 |
| ------------- | ------------------------ | -------- | ------------- | --- |
| 모델 고도화        | 파인튜닝 재정비 및 개선            | 이현대 | 05.26 - 06.10 | 완료  |
|               | 테스트 및 결과 검증              | 이현대 | 06.06 - 06.10 | 완료  |
| 프론트엔드 구축      | UI/UX 설계                 | 이현대      | 05.26         | 완료  |
|               | 프론트엔드 구현        | 이현대 | 05.27 - 06.04 | 완료  |
|               | 프론트엔드 테스트 및 디버깅          | ALL      | 06.05          | 완료 |
| 백엔드 구축     | DB 모델 정의                | 이현대        | 05.26            | 완료 |
|               | 마이그레이션                | 신준희, 이현대 | 05.27             | 완료 |
|               | Django API 구현            | 신준희, 이현민 | 05.27 - 06.10     | 완료 |
|               | Fast API 구현             | 김형주         | 05.27 - 06.10     | 완료 |
|               | LangChain + Vector DB 연동 | 신준희      | 05.27 - 06.10       | 완료 |
|               | 마이그레이션        | 이현대      | 06.09         | 완료  |
| 프론트-백 연동 및 통합 | API 연동 및 통합 테스트          | ALL      | 06.09         | 예정  |
|               | WebSocket 기반 실시간 연동      | 김형주      | 06.09         | 예정  |
|               | 프론트 병합 (merge & 빌드)      | 김형주      | 06.09         | 예정  |
| 최종 문서화        | 서비스 구조 문서화 (README 등)    | 신준희      | 06.09 - 06.10 | 예정  |
|               | 배포 가이드 작성                | 이현민      | 06.09 - 06.10 | 예정  |
| 최종 발표         | 발표 및 시연                  | 이현대      | 06.10         | 예정  |

<br><br><br>



## 테스트 및 시연


<br><br><br>

## 프로젝트 회고

|   이름   |    내용    | 
|---------|------------|
|**김형주**|  |
|**신준희**|  |
|**이현대**|  |
|**이현민**|  |
