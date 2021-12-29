/**
 * 
 * @param {String | Function} accessor used for keyAccessor valueAccessor, label, title, etc.
 * @returns {Function} to use like this.chart.keyAccessor(accessorFunc(keyAccessor))
 */
export function accessorFunc(accessor) {
  return typeof accessor === 'function' ? accessor : d => d[accessor]
}
