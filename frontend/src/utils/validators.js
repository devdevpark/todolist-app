export function validateUsername(username) {
  if (!username?.trim()) return '아이디를 입력해 주세요.';
  if (username.length < 4 || username.length > 20) return '아이디는 4~20자여야 합니다.';
  if (!/^[a-zA-Z0-9]+$/.test(username)) return '아이디는 영문과 숫자만 사용할 수 있습니다.';
  return null;
}

export function validatePassword(password) {
  if (!password?.trim()) return '비밀번호를 입력해 주세요.';
  if (password.length < 4) return '비밀번호는 4자 이상이어야 합니다.';
  return null;
}
