<script>
export default {
  name: 'AxisMixin',
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
  data () {
    return {
      autoTickHandler: null
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
        if (xAxisOptions.tilt) {
          this.$d3.select(this.chart.anchor()).classed('tilted-x-axis', true)
        }
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

      if (yAxis && this.computedAxisOptions.autoTicks && this.ndx) {
        this.ndx.onChange(evt => {
          if (evt === 'filtered') {
            const maxTicks = Math.max(yAxisOptions?.ticks || 0, 10)
            const valueAccessor = this.chart?.valueAccessor()
            const group = this.chart?.group()
            const top = group?.top?.(1)?.[0]
            let maxValue = maxTicks
            try {
              maxValue = Math.ceil(valueAccessor(top))
            } catch {
              maxValue = maxTicks
            }
            const ticks = Math.min(maxTicks, Math.max(1, maxValue))
            yAxis.ticks(ticks)
          }
        })
      }
    }
  },
  computed: {
    computedAxisOptions() {
      return {
        x: Object.assign({}, this.computedOptions?.xAxis, this.axisOptions?.x),
        y:  Object.assign({}, this.computedOptions?.yAxis, this.axisOptions?.y),
        autoTicks: this.computedOptions?.autoTicks || this.axisOptions?.autoTicks || false
      }
    }
  },
  beforeDestroy () {
    if (this.autoTickHandler) {
      this.autoTickHandler()
    }
  }
}
</script>

<style>
.dc-chart.tilted-x-axis .axis.x .tick text{
  text-anchor: end;
  transform: rotate(-33deg) translate(-4px, -2px);
}

</style>