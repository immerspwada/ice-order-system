import { calculateTotal, validateForm } from '../form.js';

describe('calculateTotal', () => {
  it('should return correct total for items', () => {
    const items = [{ price: 10, qty: 2 }, { price: 5, qty: 3 }];
    expect(calculateTotal(items)).toBe(35);
  });

  it('should return 0 for empty list', () => {
    expect(calculateTotal([])).toBe(0);
  });
});

describe('validateForm', () => {
  it('should return false if name is empty', () => {
    const form = { name: '', phone: '1234567890' };
    expect(validateForm(form)).toBe(false);
  });

  it('should return true for valid form', () => {
    const form = { name: 'Hook', phone: '0987654321' };
    expect(validateForm(form)).toBe(true);
  });
});
