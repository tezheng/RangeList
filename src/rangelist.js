// Task: Implement a class named 'RangeList'
// A pair of integers define a range, for example: [1, 5). This range includes
// integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

/**
 *
 * Find the insertion point of the value in a ordered array.
 * @param {Array<number>} arr - Array of integers, MUST NOT be empty
 * @param {number} target - the element to be inserted
 * @param {number} low - lower search bound, MUST BE in range of the arr
 * @param {number} high - upper search bound, MUST BE in range of the arr
 */
function binarySearchIndex(arr, target, low, high) {
  if (target <= arr[low]) {
    return low;
  }
  if (target > arr[high]) {
    return high + 1;
  }
  if (high - low === 1) {
    return high;
  }

  const mid = Math.floor((low + high) / 2);

  if (target < arr[mid]) {
    return binarySearchIndex(arr, target, low, mid);
  }
  if (target > arr[mid]) {
    return binarySearchIndex(arr, target, mid, high);
  }

  return mid;
}

/**
 *
 * Find the insertion point of the value in a ordered array
 * @param {Array<number>} arr - Array of integers
 * @param {number} value - the element to be inserted
 * @returns An index indicating where to insert the value
 */
function insertLeft(arr, value) {
  if (arr.length === 0) {
    return 0;
  }

  return binarySearchIndex(arr, value, 0, arr.length - 1);
}

/**
 *
 * Find the insertion point of the value in a ordered array. If an element with
 * the same value exists, return the index next to it
 * @param {Array<number>} arr - Array of integers
 * @param {number} value - the element to be inserted
 * @returns An index indicating where to insert the value
 */
function insertRight(arr, value) {
  if (arr.length === 0) {
    return 0;
  }

  const index = insertLeft(arr, value);
  return (index < arr.length && value === arr[index]) ? index + 1 : index;
}

/**
 *
 * RangeList is an aggregation of ranges, which are pairs of integers.
 * 
 */
class RangeList {
  /**
   *
   * Adds a range to the list
   * @param {Array<number>} range - Array of two integers that specify beginning
   * and end of range.
   * @returns True if the input is valid, false otherwise
   * 
   * @description
   * When adding a new range [x, y)
   * 1. if x falls into an existing range [a, b), [x, y) can be expanded to [a, y), and
   *    x will be dropped
   * 2. if y falls into an existing range [c, d), [x, y) can be expanded to [x, d), and
   *    y will be dropped
   * 3. Ranges within [x, y) will be dropped, if any
   * 4. [a, b)[x, y)[c, d), [a, y)[c, d), [a, b)[x, d), [a, d) are possible situations, if
   *    [a, b) contains x or is the left closest range to x and [c, d) contains y or is the
   *    right closest range to y.
   */
  add(range) {
    if (!RangeList.#validate(range)) {
      return false;
    }

    const [x, y] = range;
    const left = insertLeft(this.#rangeList, x);
    const right = insertRight(this.#rangeList, y);

    let newArr = this.#rangeList.slice(0, left);
    if (left % 2 === 0) {
      // x does not exist in a range
      newArr = newArr.concat(x);
    }
    if (right % 2 === 0) {
      // y does not exist in a range
      newArr = newArr.concat(y);
    }
    this.#rangeList = newArr.concat(this.#rangeList.slice(right, this.#rangeList.length));

    return true;
  }

  /**
   *
   * Removes a range from the list
   * @param {Array<number>} range - Array of two integers that specify beginning
   * and end of range.
   * @returns True if the input is valid, false otherwise
   */
  remove(range) {
    if (!RangeList.#validate(range)) {
      return false;
    }

    const [x, y] = range;
    const left = insertLeft(this.#rangeList, x);
    const right = insertRight(this.#rangeList, y);

    let newArr = this.#rangeList.slice(0, left);
    if (left % 2 === 1) {
      newArr = newArr.concat(x);
    }
    if (right % 2 === 1) {
      newArr = newArr.concat(y);
    }
    this.#rangeList = newArr.concat(this.#rangeList.slice(right, this.#rangeList.length));

    return true;
  }

  /**
   *
   * Convert the list of ranges in the range list to a string
   * @returns A string representation of the range list
   */
  toString() {
    return this.#rangeList.reduce(
      (strs, val, index, arr) => 
        (index % 2 === 0) ? strs.concat(`[${val}, ${arr[index + 1]})`) : strs
      , []
    ).join(' ');
  }

  // An ordered array of integers that represents ranges, the length of array
  // must be odd.
  // e.g. [1, 5, 10, 11, 100, 201] stands for [1, 5), [10, 11), [100, 201)
  #rangeList = [];

  /**
   *
   * Check if the range variable that the caller provide is valid
   * @param {Array<number>} range - A pair of integer
   * @returns True if the input is a valid range variable, false otherwise
   */
  static #validate(range) {
    // The input must be array which contains two elements
    if (!Array.isArray(range) || range.length !== 2) {
      return false
    }

    const [begin, end] = range;

    // Elements must be integer
    if (!Number.isInteger(begin) || !Number.isInteger(end)) {
      return false;
    }

    // First element must less than the second one
    if (begin >= end) {
      return false;
    }

    return true;
  }
}

export {
  RangeList,
  insertLeft,
  insertRight,
};
