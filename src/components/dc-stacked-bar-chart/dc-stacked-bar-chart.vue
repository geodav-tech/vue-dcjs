<template>
  <div class="dc-chart-container dc-stacked-bar-container">
    <div class="dc-chart dc-stacked-bar-chart" :id="`chart-${_uid}`"></div>
  </div>
</template>

<script>
import { BaseChartMixin, DimensionMixin, GroupMixin, AxisMixin, LegendMixin } from '../../mixins'
import { accessorFunc, constrain } from '../../dc-utils'

export default {
  name: 'DcStackedBarChart',
  mixins: [BaseChartMixin, DimensionMixin, GroupMixin, AxisMixin, LegendMixin],
  defaultOptions: {
    elastic: true,
    showLegend: true,
    legendOptions: { x: 50 }
  },
  props: {
    groups: {
      // string[] left -> right x axis domain
      type: Array,
      required: true
    },
    stacks: {
      // string[] | {name: string, color: string, key: string}[] bottom -> top group stack names for each key
      type: Array,
      required: true
    },
    colors: {
      // string[], can also be provided in stacks.color (but only if every stack has provided a color value)
      type: Array
    },
    keySeparator: {
      type: String,
      default: `;|;`
    },
    groupAccessor: {
      type: [String, Function]
    },
    stackAccessor: {
      type: [String, Function]
    },
    validateFunction: {
      type: Function
    }
  },
  methods: {
    stackKey(stack) {
      return typeof stack === 'string' ? stack : stack.key || stack.name || stack
    },
    stackName(stack) {
      return typeof stack === 'string' ? stack : stack.name || stack.key || stack
    },
    computedValidateFunction(d, stack, group) {
      if (this.validateFunction || this.computedOptions.validateFunction) {
        return this.validateFunction(d, stack, group)
      } else {
        const stackKey = this.stackKey(stack)
        return this.stackAccessorFunc(d) === stackKey && this.groupAccessorFunc(d) === group
      }
    },
    createChart() {
      this.$options.dimension = this.ndx.dimension((d) => d)
      let { add, remove, init } = this.stackReducer
      const group = this.stackedGroup(this.$options.dimension.groupAll().reduce(add, remove, init))

      const { elastic, title, barPadding, barGap, outerBarPadding } = this.computedOptions

      this.chart = new this.$dc.BarChart(`#chart-${this._uid}`).dimension(this.$options.dimension)

      this.$super(BaseChartMixin).createChart()
      this.applyAxisOptions()
      if (!this.computedAxisOptions.x?.x) {
        this.chart.x(this.$d3.scaleBand().domain(this.groups))
        this.chart.xUnits(this.$dc.units.ordinal)
      }
      let paddingDivisor = group.all().length || 1
      this.chart.barPadding(constrain(2 / paddingDivisor, 0.1, 0.75))

      if (barPadding !== undefined) {
        this.chart.barPadding(barPadding)
      } else if (barGap !== undefined) {
        this.chart.gap(barGap)
      }
      if (outerBarPadding !== undefined) {
        this.chart.outerPadding(outerBarPadding)
      }

      

      if (elastic) {
        this.chart.elasticY(true)
      }
      if (this.computedColors.length) {
        const colorScale = this.$d3
          .scaleOrdinal()
          .domain(this.stacks)
          .range(this.stacks.map((stack, index) => this.computedColors[index % this.computedColors.length]))
        this.chart.colors(colorScale)
      }

      function defaultTitleAccessor(d) {
        return `${this.layer} ${d.key}: ${d.value[this.layer]}`
      }
      this.chart.title(accessorFunc(title || defaultTitleAccessor))

      const keySeparator = this.keySeparator || ';|;'
      const dc = this.$dc
      this.chart.on('pretransition.vue-dcjs', function (chart) {
        chart
          .selectAll('rect.bar')
          .classed('deselected', false)
          .classed('stack-deselected', function (d) {
            // display stack faded if the chart has filters AND
            // the current stack is not one of them
            var groupKey = d.layer + keySeparator + d.x
            return chart.filter() && !chart.filters().some((f) => f[0] === groupKey)
          })
          .on('click.vue-dcjs', function (evt, d) {
            // filter this stack (default is whole row)
            chart.filter([d.layer + keySeparator + d.x])
            dc.redrawAll()
          })
      })

      this.stacks.forEach((stack, index) => {
        const groupKey = this.stackKey(stack)
        const action = index ? 'stack' : 'group' // the first stack is just .group, the rest are .stack
        // FIXME is there ever a reason to do this? can we use a different method for constructing/reducing the dimension and fake group after?
        this.chart[action](group, groupKey, (d) => d.value[groupKey])
      })

      this.chart.legendables = () => {
        const chart = this.chart
        return this.stacks.map((stack) => {
          const name = this.stackName(stack)
          const groupKey = this.stackKey(stack)
          const color = this.chart.colors()(groupKey)
          return { chart, name, color }
        })
      }

      this.applyLegendOptions()

      this.chart.filterHandler((dimension, filters) => {
        if (filters && filters.length) {
          dimension.filterFunction((record) => {
            return filters.some((c) => {
              const [stack, groupKey] = c[0].split(this.keySeparator || ';|;')
              // FIXME let user override this
              return this.computedValidateFunction(record, stack, groupKey)
            })
          })
        } else {
          dimension.filter(null)
        }
        return filters
      })
    },
    stackedGroup(group) {
      let keySeparator = this.keySeparator
      return {
        all: function () {
          var all = Object.entries(group.value()).map(([key, value]) => ({ key, value }))
          var m = {}
          all.forEach((kv) => {
            const [k, s] = kv.key.split(keySeparator)
            m[k] = m[k] || {}
            m[k][s] = kv.value
          })
          return Object.keys(m).map((key) => {
            return { key, value: m[key] }
          })
        }
      }
    }
  },
  computed: {
    computedColors() {
      let colors = this.colors || []
      if (this.stacks && this.stacks.length && this.stacks.every((stack) => stack.color)) {
        colors = this.stacks.map((stack) => stack.color)
      }
      if (!colors.length && this.stacks && this.stacks.length) {
        colors = this.stacks.map((stack, index) => this.$d3.interpolateTurbo((index + 0.5) / this.stacks.length))
      }
      return colors
    },
    stackReducer() {
      return {
        add: (p, v) => {
          this.groups.forEach((group) => {
            this.stacks.forEach((stack) => {
              let stackKey = this.stackKey(stack)
              if (this.computedValidateFunction(v, stack, group)) {
                p[`${group}${this.keySeparator}${stackKey}`] += accessorFunc(this.computedOptions.valueAccessor || ((d) => d.value))(v) || 0
              }
            })
          })
          return p
        },
        remove: (p, v) => {
          this.groups.forEach((group) => {
            this.stacks.forEach((stack) => {
              let stackKey = this.stackKey(stack)
              if (this.computedValidateFunction(v, stack, group)) {
                p[`${group}${this.keySeparator}${stackKey}`] -= accessorFunc(this.computedOptions.valueAccessor || ((d) => d.value))(v) || 0
              }
            })
          })
          return p
        },
        init: () => {
          const p = {}
          this.groups.forEach((group) => {
            this.stacks.forEach((stack) => {
              let stackKey = this.stackKey(stack)
              p[`${group}${this.keySeparator}${stackKey}`] = 0
            })
          })
          return p
        }
      }
    },
    stackAccessorFunc() {
      return accessorFunc(this.stackAccessor || this.computedOptions.stackAccessor || ((d) => d.stack))
    },
    groupAccessorFunc() {
      return accessorFunc(this.groupAccessor || this.computedOptions.groupAccessor || ((d) => d.group))
    }
  }
}
</script>

<style>
.dc-stacked-bar-chart rect.bar.stack-deselected {
  opacity: 0.2;
}
</style>
