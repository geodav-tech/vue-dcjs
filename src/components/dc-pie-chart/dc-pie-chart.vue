<template>
  <div class="dc-chart-container">
    <div :id="`chart-${_uid}`" class="dc-chart dc-pie-chart"></div>
  </div>
</template>

<script>
import { BaseChartMixin, DimensionMixin, GroupMixin } from '../../mixins'
import { constrain } from '../../dc-utils.js'

export default {
  name: 'DcPieChart',
  mixins: [BaseChartMixin, DimensionMixin, GroupMixin],
  defaultOptions: {
    minRadius: 0,
    maxRadius: Infinity,
    innerRadius: 0,
    slicesCap: 10,
    othersLabel: 'others',
    useImprovedLabels: true,
    labelWrapSeparator: ';|;' // if using improved labels you can separate key and value by this separator
  },
  methods: {
    async createChart() {
      this.$options.dimension = this.createDimension()
      const group = await this.createGroup(this.$options.dimension)
      this.chart = new this.$dc.PieChart(`#chart-${this._uid}`).dimension(this.$options.dimension).group(group).externalRadiusPadding(12)
      this.$super(BaseChartMixin).createChart()

      let radius = this.getRadius()
      this.chart.radius(radius)
      this.chart.width(radius)
      this.chart.height(radius)
      let { innerRadius, slicesCap, othersLabel, useImprovedLabels } = this.computedOptions
      if (slicesCap) {
        this.chart.slicesCap(slicesCap)
      }
      if (othersLabel) {
        this.chart.othersLabel(othersLabel)
      }
      if (innerRadius) {
        // either exact number or 'X%' e.g. '50%'
        let ir = typeof innerRadius === 'number' ? innerRadius : (radius * (parseInt(innerRadius) || 0)) / 100
        this.chart.innerRadius(ir)
      }

      if (useImprovedLabels) {
        const buildArc = () => {
          const maxRadius = Math.min(this.chart.width(), this.chart.height()) / 1.8
          const radius = Math.min(this.chart.radius(), maxRadius)
          return this.$d3.arc().outerRadius(radius).innerRadius(this.chart.innerRadius())
        }

        const labelPosition = (d, arc) => {
          const centroid = arc.centroid(d)
          if (centroid.some((coord) => isNaN(coord))) {
            return [0, 0]
          } else {
            return centroid
          }
        }

        const wrap = (text) => {
          // take text `key;|;value` and transform to `key` and `(value)` on two lines
          const d3 = this.$d3
          const labelWrapSeparator = this.computedOptions.labelWrapSeparator
          text.each(function () {
            const el = d3.select(this)
            const words = el.text().split(labelWrapSeparator)
            if (!words || words.length < 2) {
              return // no need to wrap. not enough words
            }

            const tString = el.attr('transform')
            const x = parseFloat(tString.slice(tString.indexOf('translate(') + 10, tString.indexOf(',')))
            const y = parseFloat(tString.slice(tString.indexOf(',') + 1, tString.indexOf(')')))
            if (Number.isNaN(x) || Number.isNaN(y)) {
              console.warn('unable to wrap text', tString, x, y, tString.slice(tString.indexOf('translate(') + 10, tString.indexOf(',')))
              return
            }
            let tspan = el.text(null).append('tspan').attr('transform', `translate(${x}, ${y})`).attr('x', 0).attr('y', 0)
            tspan.text(words[0])
            tspan = el.append('tspan').attr('transform', `translate(${x}, ${y})`).attr('x', 0).attr('y', 14)
            tspan.text(`(${words[1].replace(/[^0-9\-.]/g, '')})`)
          })
        }

        const handleLabelTransition = () => {
          this.chart.selectAll('text.pie-label').attr('transform', (d, i) => {
            const arc = buildArc(this.chart)
            const xy = labelPosition(d, arc)
            let mult = (i + 1) / 6 + 0.3
            if (xy[1] < 0) {
              mult = 1
            }
            return `translate(${xy[0]}, ${xy[1] * mult})`
          })
          this.chart.selectAll('.pie-label-group text.pie-label').transition().call(wrap)
        }

        this.chart.on('renderlet.vue-dcjs', (chart) => {
          const radius = this.getRadius()
          if (this.chart.radius() !== radius) {
            this.chart.radius(radius)
            this.chart.height(radius)
            this.chart.width(radius)
            this.chart.redraw()
          }
        })
        this.chart.on('pretransition.vue-dcjs', handleLabelTransition)
      }
    },
    render() {
        this.$super(BaseChartMixin).render()
        if (this.computedOptions.useImprovedLabels) {
          this.$nextTick(() => {
            this.chart.redraw() // fix label position
          })
        }
    },
    getRadius() {
      let container = document.querySelector(`#chart-${this._uid}`)
      if (!container) {
        return 0
      }
      let suggestedRadius = container.clientWidth
      // in flex containers, this was returning 0 always
      // look outside the dc-chart-container element to see the available space there
      if (!suggestedRadius && container.parentNode && container.parentNode.parentNode) {
        let paddingOffset = 0
        let node = container.parentNode.parentNode
        try {
          const nodeStyle = window.getComputedStyle(node, null)
          paddingOffset += parseInt(nodeStyle.getPropertyValue('padding-left')) || 0
          paddingOffset += parseInt(nodeStyle.getPropertyValue('padding-right')) || 0
        } catch {
          paddingOffset = 0
        }
        suggestedRadius = node.clientWidth - paddingOffset
      }
      let { minRadius, maxRadius } = this.computedOptions
      return constrain(suggestedRadius, minRadius, maxRadius)
    }
  }
}
</script>

<style>
.dc-chart.dc-pie-chart .pie-slice:hover {
  fill-opacity: 0.8;
}
</style>
