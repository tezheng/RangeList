
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
  ])('Add %p should be %p', (val, expected) => {
    rl.add(val);
    expect(rl.toString()).toBe(expected);
  });

  test.each([
    [[10, 10], '[1, 8) [10, 21)'],
    [[10, 11], '[1, 8) [11, 21)'],
    [[15, 17], '[1, 8) [11, 15) [17, 21)'],
    [[3, 19], '[1, 3) [19, 21)'],
    [[-100, 100], ''],
  ])('Remove %p should be %p', (val, expected) => {
    rl.remove(val);
    expect(rl.toString()).toBe(expected);
  });
});

describe('RangeList query/intersect', () => {
  const rl = new RangeList();
  rl.add([1, 5]);
  rl.add([12, 16]);
  rl.add([20, 25]);
  rl.add([30, 40]);

  test('Invalid input should return empty range', () => {
    expect(rl.has([])).toBeFalsy();
    expect(rl.has([1])).toBeFalsy();
    expect(rl.has([1, 2, 3])).toBeFalsy();
    expect(rl.has([1, -1])).toBeFalsy();
    expect(rl.has([1, 1])).toBeFalsy();
    expect(rl.has(['1', '2'])).toBeFalsy();

    expect(rl.intersect([])).toBe(null);
    expect(rl.intersect([1])).toBe(null);
    expect(rl.intersect([1, 2, 3])).toBe(null);
    expect(rl.intersect([1, 1])).toBe(null);
    expect(rl.intersect([1, -1])).toBe(null);
    expect(rl.intersect(['1', '2'])).toBe(null);
  });

  test.each([
    [[2, 3], true],
    [[13, 15], true],
    [[12, 16], true],
    [[21, 25], true],
    [[0, 2], false],
    [[30, 41], false],
    [[10, 32], false],
  ])('Query %p should be %p', (range, expected) => {
    expect(rl.has(range)).toBe(expected);
  });

  test.each([
    [[2, 3], '[2, 3)'],
    [[12, 16], '[12, 16)'],
    [[21, 25], '[21, 25)'],
    [[100, 200], null],
    [[0, 2], '[1, 2)'],
    [[29, 41], '[30, 40)'],
    [[10, 32], '[12, 16) [20, 25) [30, 32)'],
  ])('Intersect with %p should be %p', (range, expected) => {
    const result = rl.intersect(range);
    if (result) {
      expect(result.toString()).toBe(expected);
    } else {
      expect(result).toBeNull();
    }
  });
});
