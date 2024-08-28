interface Patterns {
  [key: string]: RegExp;
}

interface ErrorMessages {
  [key: string]: string;
}

const form = document.getElementById('signupForm') as HTMLFormElement;
const inputs = form.querySelectorAll('input');

const patterns: Patterns = {
  name: /^[가-힣]{2,4}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
  phone: /^01[016789]-\d{3,4}-\d{4}$/,
  address: /^.{10,}$/,
};

const errorMessages: ErrorMessages = {
  name: '이름은 2~4자의 한글이어야 합니다.',
  email: '올바른 이메일 형식이 아닙니다.',
  password: '비밀번호는 8자 이상이며, 숫자, 소문자, 대문자, 특수문자를 포함해야 합니다.',
  confirmPassword: '비밀번호가 일치하지 않습니다.',
  phone: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)',
  address: '주소는 10자 이상이어야 합니다.',
};

const validateInput = <T extends HTMLInputElement>(input: T): boolean => {
  const errorElement = document.getElementById(input.id + 'Error') as HTMLElement;
  let isValid = true;

  if (input.id === 'confirmPassword') {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    isValid = input.value === passwordInput.value;
  } else if (patterns[input.id]) {
    isValid = patterns[input.id].test(input.value);
  }

  !isValid ? (errorElement.textContent = errorMessages[input.id]) : (errorElement.textContent = '');

  return isValid;
};

const validateForm = (): boolean => {
  let isValid = true;
  inputs.forEach((input) => {
    if (!validateInput(input)) {
      isValid = false;
    }
  });
  return isValid;
};

inputs.forEach((input) => {
  input.addEventListener('input', function (this: HTMLInputElement) {
    validateInput(this);
  });
});

form.addEventListener('submit', function (e: Event) {
  e.preventDefault();
  if (validateForm()) {
    // 실행으로 변경해 주삼
    alert('회원가입 완료 후 로그인 페이지로 이동');
    form.reset();
  }
});
