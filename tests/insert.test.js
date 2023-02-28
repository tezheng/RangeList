
import {
  insertLeft,
  insertRight,
} from "../src/rangelist.js";

describe('InsertLeft', () => {
  test('Insert index of empty array should be 0', () => {
    expect(insertLeft([], 0)).toBe(0);
  });

  test.each([
    [0, 0],
    [1, 0],
    [2, 1],
  ])('Insert index of %i to [1] should be %i', (val, expected) => {
    expect(insertLeft([1], val)).toBe(expected);
  })

  const arr = [1, 5, 10, 11, 100, 201];
  test.each([
    [0, 0],
    [1, 0],
    [4, 1],
    [5, 1],
    [9, 2],
    [10, 2],
    [11, 3],
    [12, 4],
    [100, 4],
    [150, 5],
    [201, 5],
    [300, 6],
  ])(`Insert index of %i to [${arr}] should be %i`, (val, expected) => {
    expect(insertLeft(arr, val)).toBe(expected);
  })
});

describe('InsertRight', () => {
  test('Insert index of empty array should be 0', () => {
    expect(insertRight([], 0)).toBe(0);
  });

  test.each([
    [0, 0],
    [1, 1],
    [2, 1],
  ])('Insert index of %i to [1] should be %i', (val, expected) => {
    expect(insertRight([1], val)).toBe(expected);
  })

  const arr = [1, 5, 10, 11, 100, 201];
  test.each([
    [0, 0],
    [1, 1],
    [4, 1],
    [5, 2],
    [9, 2],
    [10, 3],
    [11, 4],
    [12, 4],
    [100, 5],
    [150, 5],
    [201, 6],
    [300, 6],
  ])(`Insert index of %i to [${arr}] should be %i`, (val, expected) => {
    expect(insertRight(arr, val)).toBe(expected);
  })
});
