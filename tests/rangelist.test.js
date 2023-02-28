
import { RangeList } from '../src/rangelist.js';

describe('RangeList input param', () => {
  const rl = new RangeList();

  test('Range cannot be string', () => {
    expect(rl.add('range')).toBeFalsy();
    expect(rl.remove('range')).toBeFalsy();
  });

  test('Range cannot be object', () => {
    expect(rl.add({ being: 1, end: 2 })).toBeFalsy();
    expect(rl.remove({ being: 1, end: 2 })).toBeFalsy();
  });

  test('Length of range cannot less than 2', () => {
    expect(rl.add([])).toBeFalsy();
    expect(rl.remove([1])).toBeFalsy();
  });

  test('Length of range cannot greater than 2', () => {
    expect(rl.add([2,4,5])).toBeFalsy();
  });

  test('Element of range cannot be float or string', () => {
    expect(rl.add([1.1, 2.2])).toBeFalsy();
    expect(rl.remove(['1', '2'])).toBeFalsy();
  });

  test('Range must be array of two integer', () => {
    expect(rl.add([1, 2])).toBeTruthy();
    expect(rl.remove([3, 4])).toBeTruthy();
  });

  test('First element cannot be equal or greater than the second one', () => {
    expect(rl.add([1, 1])).toBeFalsy();
    expect(rl.remove([2, 1])).toBeFalsy();
  });

  test('First element must be less than the second one', () => {
    expect(rl.add([10, 20])).toBeTruthy();
    expect(rl.remove([12, 15])).toBeTruthy();
  });
});

describe('RangeList add/remove', () => {
  const rl = new RangeList();

  test.each([
    [[1, 1], ''],
    [[1, 5], '[1, 5)'],
    [[12, 14], '[1, 5) [12, 14)'],
    [[16, 19], '[1, 5) [12, 14) [16, 19)'],
    [[13, 17], '[1, 5) [12, 19)'],
    [[10, 20], '[1, 5) [10, 20)'],
    [[20, 20], '[1, 5) [10, 20)'],
    [[20, 21], '[1, 5) [10, 21)'],
    [[2, 4], '[1, 5) [10, 21)'],
    [[3, 8], '[1, 8) [10, 21)'],
  ])('Add [%i] should be %i', (val, expected) => {
    rl.add(val);
    expect(rl.toString()).toBe(expected);
  });

  test.each([
    [[10, 10], '[1, 8) [10, 21)'],
    [[10, 11], '[1, 8) [11, 21)'],
    [[15, 17], '[1, 8) [11, 15) [17, 21)'],
    [[3, 19], '[1, 3) [19, 21)'],
    [[-100, 100], ''],
  ])('Remove [%i] should be %i', (val, expected) => {
    rl.remove(val);
    expect(rl.toString()).toBe(expected);
  });
});
