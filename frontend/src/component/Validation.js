export const validateLogin = (email, password) => {
    let errors = '';

    // 이메일 유효성 검사
    const emailPattern = /^[a-zA-Z0-9._%+-]{2,}$/;
    if (!emailPattern.test(email)) {
        errors += '특수문자는 사용 불가';
    }

    // 비밀번호 유효성 검사
    if (password.length < 6) {
        errors += '비밀번호는 6자리 이상이어야 합니다.';
    }

    return errors;
};