# 마파덜 - 통합 인증 시스템

## 인증 시스템 개요

마파덜 프로젝트에서는 NextAuth.js를 사용한 통합된 소셜 로그인 시스템을 구현했습니다.

### 📋 주요 기능

- **통합 인증 페이지**: `/auth` 페이지에서 로그인과 회원가입을 모두 처리
- **소셜 로그인 지원**: Google, Naver 로그인 지원
- **Django 백엔드 연동**: NextAuth.js와 Django 백엔드 간 토큰 연동
- **자동 토큰 갱신**: JWT 토큰 자동 갱신 시스템
- **에러 처리**: 사용자 친화적인 에러 메시지 및 처리

### 🚀 사용 방법

#### 1. 기본 인증 페이지
```
/auth - 로그인/회원가입 통합 페이지
/auth?mode=signin - 로그인 모드로 시작
/auth?mode=signup - 회원가입 모드로 시작
```

#### 2. 기존 URL 호환성
기존 `/login`과 `/signup` URL은 자동으로 새로운 `/auth` 페이지로 리다이렉트됩니다.

#### 3. 콜백 URL 지원
```
/auth?callbackUrl=/profile - 로그인 후 특정 페이지로 이동
```

### 🔧 환경 변수 설정

`.env` 파일에 다음 환경 변수들이 설정되어야 합니다:

```env
# NextAuth.js
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Naver OAuth
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret

# Django Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 📁 파일 구조

```
app/
├── auth/
│   ├── page.tsx              # 통합 인증 페이지
│   ├── signin/page.tsx       # NextAuth 호환 로그인 페이지
│   ├── error/page.tsx        # 에러 페이지
│   └── callback/page.tsx     # 콜백 처리 페이지
├── login/page.tsx            # 기존 로그인 페이지 (리다이렉트)
├── signup/page.tsx           # 기존 회원가입 페이지 (리다이렉트)
└── api/auth/[...nextauth]/route.ts  # NextAuth.js 설정
```

### 🔄 인증 플로우

1. **사용자 접근**: `/auth` 페이지 방문
2. **소셜 로그인**: Google/Naver 중 선택
3. **OAuth 인증**: 선택한 제공자에서 인증 처리
4. **토큰 교환**: NextAuth.js가 Django 백엔드와 토큰 교환
5. **세션 생성**: 브라우저에 세션 저장
6. **리다이렉트**: 원래 요청한 페이지 또는 메인 페이지로 이동

### 🛡️ 보안 기능

- **CSRF 보호**: NextAuth.js 내장 CSRF 보호
- **세션 보안**: HTTP-only 쿠키 사용
- **토큰 갱신**: 자동 JWT 토큰 갱신
- **도메인 제한**: 프로덕션 환경에서 도메인 제한

### 🔍 에러 처리

- **OAuthCallback**: OAuth 콜백 처리 오류
- **AccessDenied**: 접근 거부 오류
- **RefreshAccessTokenError**: 토큰 갱신 오류
- **SessionRequired**: 로그인 필요 페이지 접근

### 📱 반응형 디자인

- **데스크톱**: 카드 형태의 인터페이스
- **모바일**: 전체 화면 최적화
- **탭 인터페이스**: 로그인/회원가입 간 쉬운 전환

### 🎨 UI/UX 특징

- **로딩 상태**: 각 소셜 로그인 버튼별 개별 로딩 표시
- **에러 표시**: 사용자 친화적인 에러 메시지
- **성공 피드백**: 로그인 성공 시 토스트 메시지
- **자동 리다이렉트**: 인증 완료 후 자동 페이지 이동

### 🔗 관련 링크

- [NextAuth.js 문서](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
