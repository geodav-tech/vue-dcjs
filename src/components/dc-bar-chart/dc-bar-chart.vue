<template>
  <div class="dc-chart-container dc-scroll-bar-chart-container">
    <div v-if="computedOptions.scrollable" style="position: relative; z-index: 0;">
      <div class="dc-scroll-bar-range" :class="{'hidden': !canScroll}" :id="`chart-${_uid}-range`"></div>
      <!-- fill in the scroll-bar space if we cannot scroll -->
      <div class="dc-scroll-bar-range-filler" :class="{'hidden': canScroll}"></div>
    </div>
    <div class="dc-chart dc-bar-chart" :id="`chart-${_uid}`"></div>
  </div>
</template>

<script>
import { BaseChartMixin, DimensionMixin, GroupMixin } from '../../mixins'
import { accessorFunc } from '../../dc-utils.js'

export default {
  name: 'DcBarChart',
  mixins: [BaseChartMixin, DimensionMixin, GroupMixin],
  defaultOptions: {
    elastic: true,
    scrollable: false,
    minScrollable: 12, // will not scroll if less than this number
    scrollHeight: 12, // how tall the scroll chart is
    mouseZoom: true
  },
  data () {
    return {
      scaleChart: null,
      top: 0
    }
  },
  methods: {
    createChart () {
      let { elastic, scrollable, minScrollable, scrollHeight, groupAll, valueAccessor, label, filterFunction, mouseZoom } = this.computedOptions
      this.$options.dimension = this.createDimension()
      let ordinalValueAccessor = accessorFunc(valueAccessor || (v => v))
      const group = this.ordinalToLinear(this.createGroup(this.$options.dimension, groupAll), ordinalValueAccessor, groupAll) 
      
      
      this.top = group.all().length
      
      const linearDomain = [-0.5, this.top - 0.5]
      let barGap = this.top ? document.querySelector(`#chart-${this._uid}`).clientWidth / minScrollable / this.top : 0
      barGap = Math.max(Math.ceil(barGap), 1)
      
      this.chart = new this.$dc.BarChart(`#chart-${this._uid}`)
        .dimension(this.$options.dimension)
        .group(group)
        .x(this.$d3.scaleLinear().domain(linearDomain))
        .xUnits(this.$dc.units.integers)
        .centerBar(true)
        .brushOn(false)
        .gap(barGap)

      this.$super(BaseChartMixin).createChart()
        
      this.chart.keyAccessor(kv => group.ord2int(kv.key))
      this.chart.valueAccessor(kv => ordinalValueAccessor(kv.value))
      this.chart.title(this.titleAccessor)
      this.chart.transitionDuration(this.canScroll ? 50 : 250)

      if (elastic) {
        this.chart.elasticY(true)
      }

      this.chart.xAxis().tickFormat(d => accessorFunc(label || (d => d))(group.int2ord(d)))
      if (this.top <= minScrollable / 4) {
        const l = this.top || 1
        this.chart.barPadding(minScrollable / 2 / l)
      }

      let focusFilter = []
      this.chart.filterHandler(function(dimension, filters){ }) // disable built in filtering

      // overwrite with our own filtering logic
      this.chart.hasFilter = function (f) {
        if (Array.isArray(f)) {
          return f.every(filter => focusFilter.includes(filter))
        } else if (f) {
          return focusFilter.includes(f)
        } else {
          return focusFilter.length
        }
      }

      this.chart.applyFilter = function() {
        if (focusFilter.length) {
          this.dimension().filterFunction(function(k) {
            if (filterFunction) {
              return filterFunction(focusFilter, k)
            } else {
              return focusFilter.includes(k)
            }
          })
        } else {
          this.dimension().filter(null)
        }
        // FIXME send filter event?
      }

      this.chart.filterAll = function () {
        focusFilter = []
        this.applyFilter()
      }

      const dc = this.$dc
      const d3 = this.$d3
      this.chart.fadeDeselectedArea = function (brushSelection) {
        let bars = this.chartBodyG().selectAll('rect.bar')
        if (focusFilter.length) {
          bars.classed(dc.constants.SELECTED_CLASS, function (d) {
            return focusFilter.includes(d.data.key)
          })
          bars.classed(dc.constants.DESELECTED_CLASS, function (d) {
            return !focusFilter.includes(d.data.key)
          })
        } else {
          bars.classed(dc.constants.SELECTED_CLASS, false)
          bars.classed(dc.constants.DESELECTED_CLASS, false)
        }
      }
      
      this.chart.on('pretransition', function (chart) {
        chart.selectAll('rect.bar').on('click.ordinal-select', function (e, d) {
          var i = focusFilter.indexOf(d.data.key)
          if (i >= 0) {
            focusFilter.splice(i, 1)
          } else {
            focusFilter.push(d.data.key)
          }
          chart.applyFilter()
          chart.redrawGroup()
        })
      })

      this.chart.on('preRedraw', function (chart) {
        const domain = chart.x().domain()
        const min = Math.ceil(domain[0])
        const max = Math.floor(domain[1])
        chart.xAxis().tickValues(d3.range(min, max + 1))
        chart.rescale() // allow x axis to match ordering changes
      })

      // FIXME text wrapping x axis in shared thing?

      if (scrollable) {
        let { top, bottom, left, right } = this.computedMargins
        this.chart.margins({ top: 0, bottom, left, right })

        this.scaleChart = new this.$dc.BarChart(`#chart-${this._uid}-range`)
          .dimension(this.$options.dimension)
          .group(group)
          .height(scrollHeight + top)
          .margins({ left, top, right: right - 10, bottom: 2})
          .x(this.$d3.scaleLinear().domain(linearDomain))
          .xUnits(this.$dc.units.integers)
          .keyAccessor(kv => group.ord2int(kv.key))
          .centerBar(true)
          .valueAccessor(kv => ordinalValueAccessor(kv.value))
          .brushOn(true)
          .transitionDuration(0)
        this.scaleChart.filterHandler(function() { }) // ensure the scale chart has no filterFunction (it will mess up scaling on all charts)
        this.scaleChart.yAxis().ticks(0)
        this.scaleChart.xAxis().ticks(0)

        this.chart.rangeChart(this.scaleChart)
        this.chart.zoomScale([Math.min(8, Math.ceil(this.top / 12)), Math.min(this.top, 12)])
        if (elastic) {
          this.scaleChart.elasticY(true)
        }
        if (mouseZoom) {
          this.chart.mouseZoomable(this.canScroll)
        }
      }
    },
    render () {
      this.$super(BaseChartMixin).render()
      if (this.canScroll) {
        this.scaleChart?.render()
        const maxEnd = Math.floor(this.top / Math.min(8, Math.ceil(this.top / 12)))
        this.chart.focus([-1, maxEnd])
      }
    }
  },
  computed: {
    canScroll () {
      return this.computedOptions.scrollable && this.top >= this.computedOptions.minScrollable
    }
  }

}
</script>

<style>
  .dc-chart-container.dc-scroll-bar-chart-container {
    position: relative;
    z-index: 0;
  }
  .dc-scroll-bar-chart-container .dc-bar-chart .axis.x .tick text {
      text-anchor: end;
      transform: rotate(-33deg) translate(-4px, -8px);
    }

  .dc-scroll-bar-chart-container .dc-scroll-bar-range.hidden,
  .dc-scroll-bar-chart-container .dc-scroll-bar-range-filler.hidden,
  .dc-scroll-bar-chart-container .dc-scroll-bar-range .axis,
  .dc-scroll-bar-chart-container .dc-scroll-bar-range-filler .axis {
      display: none;
    }

  .dc-scroll-bar-chart-container .dc-scroll-bar-range {
      z-index: 1;
      position: relative;
  }
  .dc-scroll-bar-chart-container .dc-scroll-bar-range .custom-brush-handle {
    stroke: black;
  }

  .dc-scroll-bar-chart-container .dc-scroll-bar-range g.brush {
    fill: rgba(100, 100, 100, 0.1);
  }

  .dc-scroll-bar-chart-container .dc-scroll-bar-range svg {
    display: block;
  }
  .dc-scroll-bar-chart-container .dc-scroll-bar-range-filler {
    height: 12px
  }
</style>