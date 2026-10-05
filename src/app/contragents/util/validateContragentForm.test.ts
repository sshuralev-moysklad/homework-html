import { validateInn, validateKpp } from './validateContragentForm';

describe('тесты validateInn', () => {
  it('возвращает true для 11 цифр', () => {
    expect(validateInn('07736570901')).toBe(true);
  });

  it('возвращает false для короткого значения', () => {
    expect(validateInn('1234567890')).toBe(false);
  });

  it('возвращает false для длинного значения', () => {
    expect(validateInn('123456789012')).toBe(false);
  });

  it('возвращает false для букв', () => {
    expect(validateInn('0773657090a')).toBe(false);
  });

  it('возвращает false для пустой строки', () => {
    expect(validateInn('')).toBe(false);
  });
});

describe('тесты ValidateKpp', () => {
  it('возвращает true для 9 цифр', () => {
    expect(validateKpp('773101001')).toBe(true);
  });

  it('возвращает false для короткого значения', () => {
    expect(validateKpp('12345678')).toBe(false);
  });

  it('возвращает false для длинного значения', () => {
    expect(validateKpp('1234567890')).toBe(false);
  });

  it('возвращает false для букв', () => {
    expect(validateKpp('77310100a')).toBe(false);
  });

  it('возвращает false для пустой строки', () => {
    expect(validateKpp('')).toBe(false);
  });
});
