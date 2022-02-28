<template>
  <span class="dc-number-display" :id="`chart-${_uid}`"></span>
</template>

<script>
import { BaseChartMixin, GroupMixin } from '../../mixins'
import { accessorFunc } from '../../dc-utils'

export default {
  name: 'DcNumberDisplay',
  mixins: [BaseChartMixin, GroupMixin],
  methods: {
    async createChart() {
      const group = await this.createGroup(this.ndx, true)
      this.chart = new this.$dc.NumberDisplay(`#chart-${this._uid}`).group(group)

      this.chart.anchorName = () => {
        return `#chart-${this._uid}`
      }

      this.$super(BaseChartMixin).createChart()

      let { html, singular, plural, formatNumber, valueAccessor } = this.computedOptions

      // pass the unfiltered total the the valueAccessor to allow for percentages
      let unfilteredTotal = group.value()
      this.chart.valueAccessor((d, i) => accessorFunc(valueAccessor || ((d) => d))(d, i, unfilteredTotal))

      if (html) {
        this.chart.html(html)
      } else if (singular) {
        plural = plural || singular + 's'
        this.chart.html({ one: `%number ${singular}`, some: `%number ${plural}`, none: `%number ${plural}` })
      }

      if (formatNumber) {
        let format = typeof formatNumber === 'string' ? this.$d3.format(formatNumber) : formatNumber
        this.chart.formatNumber(format)
      }
    }
  }
}
</script>
