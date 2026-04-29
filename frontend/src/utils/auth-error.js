export function getAuthErrorMessage(error) {
  switch (error?.code) {
    case 'ACCOUNT_DISABLED': return '비활성화된 계정입니다. 관리자에게 문의하세요.';
    case 'UNAUTHORIZED': return '아이디 또는 비밀번호가 올바르지 않습니다.';
    case 'CONFLICT': return '이미 사용 중인 사용자 이름입니다.';
    default: return error?.message ?? '오류가 발생했습니다. 다시 시도해 주세요.';
  }
}
