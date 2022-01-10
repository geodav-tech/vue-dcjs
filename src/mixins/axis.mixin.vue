<script>
export default {
  props: {
    /**
     * x: AxisOptions,
     * y: AxisOptions,
     *
     * AxisOptions: {
     *  x: scale,
     *  y: scale,
     *  ticks: number,
     *  format: string, number | d => value,
     *  values: number[],
     *  size: number
     * }
     */
    axisOptions: {
      // can also be in this.options
      type: Object
    }
  },
  methods: {
    applyAxisOptions() {
      let xAxisOptions = this.computedAxisOptions.x
      let yAxisOptions = this.computedAxisOptions.y
      if (!this.chart || (!xAxisOptions && !yAxisOptions)) {
        // nothing to apply to, or nothing to apply
        return
      }
      const xAxis = this.chart.xAxis?.()
      const yAxis = this.chart.yAxis?.()

      const applyTicks = (axis, ticks) => {
        if (ticks || ticks === 0) {
          axis.ticks(ticks)
        }
      }

      const applyFormat = (axis, format) => {
        if (typeof format === 'string') {
          axis.tickFormat(this.$d3.format(format))
        } else if (typeof format === 'number') {
          axis.tickFormat = this.$d3.format(`,.${format}f`)
        } else if (typeof format === 'function') {
          axis.tickFormat(format)
        }
      }

      const applyValues = (axis, values) => {
        if (values && Array.isArray(values)) {
          axis.tickValues(values)
        }
      }

      const applySize = (axis, size) => {
        if (size || size === 0) {
          axis.tickSize(size)
        }
      }

      if (xAxisOptions && xAxis) {
        applyTicks(xAxis, xAxisOptions.ticks)
        applyFormat(xAxis, xAxisOptions.format)
        applyValues(xAxis, xAxisOptions.values)
        applySize(xAxis, xAxisOptions.size)
        if (xAxisOptions.x && typeof this.chart.x === 'function') {
          this.chart.x(xAxisOptions.x(this.$options.dimension))
        }
      }

      if (yAxisOptions && yAxis) {
        applyTicks(yAxis, yAxisOptions.ticks)
        applyFormat(yAxis, yAxisOptions.format)
        applyValues(yAxis, yAxisOptions.values)
        applySize(yAxis, yAxisOptions.size)
        if (yAxisOptions.y && typeof this.chart.y === 'function') {
          this.chart.y(yAxisOptions.y(this.$options.dimension))
        }
      }
    }
  },
  computed: {
    computedAxisOptions() {
      let options = { x: null, y: null }
      if (this.computedOptions.xAxis) {
        options.x = Object.assign({}, this.computedOptions.xAxis)
      }
      if (this.computedOptions.yAxis) {
        options.y = Object.assign({}, this.computedOptions.yAxis)
      }
      if (this.axisOptions?.x) {
        options.x = Object.assign({}, options.x, this.axisOptions.x)
      }
      if (this.axisOptions?.y) {
        options.y = Object.assign({}, options.y, this.axisOptions.y)
      }
      return options
    }
  }
}
</script>
