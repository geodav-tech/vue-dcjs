/**
 *
 * @param {String | Function} accessor used for keyAccessor valueAccessor, label, title, etc.
 * @returns {Function} to use like this.chart.keyAccessor(accessorFunc(keyAccessor))
 */
export function accessorFunc(accessor) {
  return typeof accessor === 'function' ? accessor : (d) => d[accessor]
}

/**
 *
 * @param {Number} target the value you wish to ensure is within the bounds
 * @param {Number} minValue the minimum returned value (inclusive)
 * @param {Number} maxValue the maximum returned value (inclusive)
 * @returns {Number} the target value, limited to the bounds provided by min/max inclusively
 */
export function constrain(target, minValue = -Infinity, maxValue = Infinity) {
  return Math.max(minValue, Math.min(target, maxValue))
}

/**
 *
 * @param {Array} array 2d+ array
 * @returns  1d array
 */
export function flat(array) {
  if (!Array.isArray(array)) {
    return []
  }
  return array.reduce((acc, val) => acc.concat(val), [])
}
