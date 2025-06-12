// 디버깅용 - 브라우저 콘솔에서 실행할 수 있는 함수들
// 개발자 도구 Console에서 다음을 실행해보세요:

// 1. 세션 스토리지 확인
function checkSessionStorage() {
  console.log('=== 세션 스토리지 상태 ===');
  console.log('access_token:', sessionStorage.getItem('access_token'));
  console.log('refresh_token:', sessionStorage.getItem('refresh_token'));
  console.log('user_data:', sessionStorage.getItem('user_data'));
  
  // AuthService 사용 (import가 가능한 경우)
  if (typeof AuthService !== 'undefined') {
    console.log('AuthService.getAccessToken():', AuthService.getAccessToken());
    console.log('AuthService.getUser():', AuthService.getUser());
  }
}

// 2. NextAuth 세션 확인 (next-auth/react가 로드된 경우)
async function checkNextAuthSession() {
  console.log('=== NextAuth 세션 상태 ===');
  try {
    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    console.log('전체 세션:', session);
    console.log('사용자:', session?.user);
    console.log('액세스 토큰:', session?.access);
    console.log('리프레시 토큰:', session?.refresh);
  } catch (error) {
    console.error('NextAuth 세션 확인 실패:', error);
  }
}

// 3. 수동으로 토큰 설정 (테스트용)
function setTestToken() {
  const testToken = 'test-token-for-debugging';
  sessionStorage.setItem('access_token', testToken);
  console.log('테스트 토큰 설정됨:', testToken);
}

// 사용법:
// checkSessionStorage();
// checkNextAuthSession();
// setTestToken();

console.log('디버깅 함수들이 로드되었습니다:');
console.log('- checkSessionStorage(): 세션 스토리지 상태 확인');
console.log('- checkNextAuthSession(): NextAuth 세션 상태 확인');
console.log('- setTestToken(): 테스트 토큰 설정');
