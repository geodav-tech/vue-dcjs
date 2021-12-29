<template>
  <div class="dc-chart-container">
    <div :id="`chart-${_uid}`" class="dc-chart dc-row-chart" :style="computedStyle"></div>
    <div v-if="computedOptions.scrollable" :id="`chart-${_uid}-axis`" class="dc-chart dc-axis-chart dc-row-axis-chart"></div>
  </div>
</template>

<script>
import BaseChartMixin from '../mixins/base-chart.mixin.vue'
import DimensionMixin from '../mixins/dimension.mixin.vue'
import GroupMixin from '../mixins/group.mixin.vue'
import { accessorFunc } from '../dc-utils.js'
import { AxisChart } from '../plugins/axis-chart.class.js'

export default {
  name: 'DcRowChart',
  mixins: [BaseChartMixin, DimensionMixin, GroupMixin],
  defaultOptions: {
    elastic: true,
    scrollable: true,
    minHeight: 150,
    barHeight: 20,
    axisChartheight: 50,
    scrollHeight: '200px',

  },
  data () {
    return {
      axisChart: null
    }
  },
  methods: {
    drawChart () {
      const defaultMargin = { top: 30, right: 30, bottom: 30, left: 30}
      // merge in default options
      let { margins, elastic, scrollable, minHeight, barHeight, axisChartHeight, valueAccessor, keyAccessor, labelAccessor } = this.computedOptions
      this.$options.dimension = this.createDimension()
      const group = this.createGroup(this.$options.dimension)
      
      this.chart = this.$dc.rowChart(`#chart-${this._uid}`)
        .dimension(this.$options.dimension)
        .group(group)
      
      this.$super(BaseChartMixin).drawChart()
      if (margins || scrollable) {
        let computedMargin = scrollable ? Object.assign({}, defaultMargin, margins, { bottom: -1 }) : margins || defaultMargin
        this.chart.margins(computedMargin)
      }
      
      if (elastic) {
        this.chart.elasticX(true)
      }
      if (labelAccessor) {
        this.chart.label(accessorFunc(labelAccessor))
      }

      if (scrollable) {
        this.chart.height(Math.max(minHeight, group.size() * barHeight))
        this.chart.transitionDuration(1000)

        let computedMargin = Object.assign({}, defaultMargin, margins, { top: 0 }) // enforce top margin
        this.axisChart = new AxisChart(`#chart-${this._uid}-axis`)
          .dimension(this.$options.dimension)
          .group(group)
          .height(axisChartHeight)
          .margins(computedMargin)
        if (valueAccessor) {
          this.axisChart.valueAccessor(accessorFunc(valueAccessor))
        }
        if (keyAccessor) {
          this.axisChart.keyAccessor(accessorFunc(keyAccessor))
        }
        if (elastic) {
          this.axisChart.elastic(true)
        }
      }

      this.$emit('pre-render', this.chart)
      this.$nextTick(() => {
        this.chart.render()
        this.axisChart.render()
        this.$nextTick(() => {
          this.$emit('post-render')
        })
      })

    }
  },
  computed: {
    computedStyle () {
      if (this.computedOptions.scrollable && this.computedOptions.scrollHeight) {
        return `max-height: ${this.computedOptions.scrollHeight}; overflow-y: auto;`
      } else {
        return ''
      } 
    }
  }
}
</script>

<style>

</style>