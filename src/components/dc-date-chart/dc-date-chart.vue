<template>
  <div class="dc-chart-container dc-date-chart-container">
    <div class="dc-chart dc-date-chart" :id="`chart-${_uid}`" />
  </div>
</template>

<script>
import { accessorFunc } from '../../dc-utils'
import { BaseChartMixin, DimensionMixin, GroupMixin, AxisMixin } from '../../mixins'

export default {
  name: 'DcDateChart',
  mixins: [BaseChartMixin, DimensionMixin, GroupMixin, AxisMixin],
  defaultOptions: {
    elastic: true,
    renderArea: true,
    limitTicksToNumDays: true, // limit the number of ticks to match the number of days under maxTicks
    useD3TimeDay: true, // if passed no dimensionConstructor or string, will use d3.timeDay to construct dimension
    snapDateCalculation: true,
    useUtcSnapping: false
  },
  methods: {
    getDateBounds () {
      const keyAccessor = accessorFunc(this.computedOptions.keyAccessor || (d => d.date))

      let top = new Date(keyAccessor(this.$options.dimension.top(1)[0]))
      let bottom = new Date(keyAccessor(this.$options.dimension.bottom(1)[0]))

      let { snapDateCalculation, useUtcSnapping } = this.computedOptions
      if (snapDateCalculation) {
        if (useUtcSnapping) {
          top.setUTCHours(0,0,0,0)
          bottom.setUTCHours(23, 59, 59, 999)
        } else {
          top.setHours(0,0,0,0)
          bottom.setHours(23, 59, 59, 999)
        }
      }
      // floor?
      let days = Math.ceil(Math.abs(this.daysDifference(top, bottom)))
      return { top, bottom, days }
    },
    daysDifference (d1, d2) {
      if (!d1 || !d2 || !d1.getTime || !d2.getTime) {
        return null
      }
      return (d2.getTime() - d1.getTime()) / 1000 / 60 / 60 / 24
    },
    createDimension () {
      // override DimensionMixin to include d3.timeDay defaults for this chart
      let { useD3TimeDay } = this.computedOptions
      const timeDay = d => this.$d3.timeDay(new Date(d))

      let dimensionAccessor = useD3TimeDay ? (d => timeDay(this.$dc.pluck('date')(d))) : dc.pluck('date')

      if (typeof this.dimensionConstructor === 'string') {
        dimensionAccessor = useD3TimeDay ? (d => timeDay(this.$dc.pluck(this.dimensionConstructor)(d))) : dc.pluck(this.dimensionConstructor)
      } else if (typeof this.dimensionConstructor === 'function') {
        dimensionAccessor = this.dimensionConstructor
      }
      return this.ndx.dimension(dimensionAccessor, this.dimensionIsArray)
    },
    createChart () {
      let { elastic, renderArea } = this.computedOptions
      this.$options.dimension = this.createDimension()
      let group = this.createGroup(this.$options.dimension)
      let { top, bottom, days } = this.getDateBounds()

      this.chart = new this.$dc.LineChart(`#chart-${this._uid}`)
        .dimension(this.$options.dimension)
        .group(group)
        .x(this.$d3.scaleTime().domain([bottom, top]))

      this.$super(BaseChartMixin).createChart()
      this.applyAxisOptions()

      if (elastic) {
        this.chart.elasticY(true)
      }
      if (renderArea) {
        this.chart.renderArea(true)
      }

      if (this.computedOptions.limitTicksToNumDays) {
        let maxTicks = this.computedAxisOptions.x?.ticks || 10
        this.chart.xAxis().ticks(Math.min(maxTicks, days))
      }
    }
  }
}
</script>

<style>

</style>