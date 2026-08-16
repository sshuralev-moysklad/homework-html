const INN_PATTERN = /^\d{11}$/;
const KPP_PATTERN = /^\d{9}$/;

export function validateInn(value: string): boolean {
  return INN_PATTERN.test(value);
}

export function validateKpp(value: string): boolean {
  return KPP_PATTERN.test(value);
}

export function validateInnField(value: string) {
  if (!validateInn((value ?? '').trim())) {
    return { message: 'ИНН должен содержать 11 цифр' };
  }
}

export function validateKppField(value: string) {
  if (!validateKpp((value ?? '').trim())) {
    return { message: 'КПП должен содержать 9 цифр' };
  }
}
