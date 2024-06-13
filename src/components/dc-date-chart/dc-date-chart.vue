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
    snapDateCalculation: false,
    useUtcSnapping: false,
    fakeGroupingSettings: null // { startDate, endDate, fillValue }
  },
  methods: {
    getDateBounds() {
      const keyAccessor = accessorFunc(this.computedOptions.keyAccessor || ((d) => d?.date))

      let top = new Date(keyAccessor(this.$options.dimension.top(1)[0]))
      let bottom = new Date(keyAccessor(this.$options.dimension.bottom(1)[0]))

      if (this.computedOptions.fakeGroupingSettings && this.computedOptions.fakeGroupingSettings.startDate && this.computedOptions.fakeGroupingSettings.endDate) {
        bottom = new Date(this.computedOptions.fakeGroupingSettings.startDate)
        top = new Date(this.computedOptions.fakeGroupingSettings.endDate)
      }

      let { snapDateCalculation, useUtcSnapping } = this.computedOptions
      if (snapDateCalculation) {
        if (useUtcSnapping) {
          top.setUTCHours(0, 0, 0, 0)
          bottom.setUTCHours(23, 59, 59, 999)
        } else {
          top.setHours(0, 0, 0, 0)
          bottom.setHours(23, 59, 59, 999)
        }
      }
      // floor?
      let days = Math.ceil(Math.abs(this.daysDifference(top, bottom)))
      return { top, bottom, days }
    },
    daysDifference(d1, d2) {
      if (!d1 || !d2 || !d1.getTime || !d2.getTime) {
        return null
      }
      return (d2.getTime() - d1.getTime()) / 1000 / 60 / 60 / 24
    },
    createDimension() {
      // override DimensionMixin to include d3.timeDay defaults for this chart
      let { useD3TimeDay } = this.computedOptions
      const timeDay = (d) => this.$d3.timeDay(new Date(d))

      let dimensionAccessor = useD3TimeDay ? (d) => timeDay(this.$dc.pluck('date')(d)) : this.$dc.pluck('date')

      if (typeof this.dimensionConstructor === 'string') {
        dimensionAccessor = useD3TimeDay
          ? (d) => timeDay(this.$dc.pluck(this.dimensionConstructor)(d))
          : this.$dc.pluck(this.dimensionConstructor)
      } else if (typeof this.dimensionConstructor === 'function') {
        dimensionAccessor = this.dimensionConstructor
      }
      return this.ndx.dimension(dimensionAccessor, this.dimensionIsArray)
    },
    // the user can specify a date range and fillValue to fill out any missing days from the data
    // this will zero-out any missing days making the chart look more accurate!
    fakeGroup (group, fakeGroupingSettings) {
      let startDate = new Date(fakeGroupingSettings.startDate)
      let endDate = new Date(fakeGroupingSettings.endDate)
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      return {
        all() {
          const original = group.all()
          const originalDays = original.map(kv => kv.key.toISOString())
          const result = []
          const fillValue = fakeGroupingSettings.fillValue || {}
          for (let i = 0; i <= days; i++) {
            const thisDate = new Date(startDate)
            thisDate.setDate(startDate.getDate() + i)

            if (originalDays.includes(thisDate.toISOString())) {
              continue // this date is already covered, we'll skip it
            }
            if (typeof fillValue === 'object') {
              result.push(Object.assign({}, fillValue, { date: thisDate }))
            } else  if (typeof fillValue === 'function') {
              result.push(fillValue(thisDate))
            }
          }
          // to draw the line left to right properly these MUST be sorted
          return original.concat(result).sort((a, b) => a.key - b.key)
        },
        domain () {
          return [startDate, endDate]
        }
      }
    },
    async createChart() {
      let { elastic, renderArea } = this.computedOptions
      this.$options.dimension = this.createDimension()
      let group = await this.createGroup(this.$options.dimension)
      if (this.computedOptions.fakeGroupingSettings && this.computedOptions.fakeGroupingSettings.startDate && this.computedOptions.fakeGroupingSettings.endDate) {
        group = this.fakeGroup(group, this.computedOptions.fakeGroupingSettings)
      }
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
