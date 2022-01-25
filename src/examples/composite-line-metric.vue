<template>
  <example-container
    class="composite-line-metric-container"
    link="src/components/dc-composite-line-chart"
    linkText="Composite line chart"
    label="by team hours"
  >
    <dc-composite-line-chart
      :ndx="ndx"
      v-if="groups"
      :dimension-constructor="dimensionConstructor"
      :reducer="reducer"
      :groups="groups"
      :options="chartOptions"
    />
  </example-container>
</template>

<script>
import { DcCompositeLineChart } from '../components'
import sampleData from '../sample-data'
import ExampleContainer from './example-container.vue'

export default {
  components: {
    DcCompositeLineChart,
    ExampleContainer
  },
  props: {
    ndx: {
      type: Object
    }
  },
  data() {
    return {
      constructedNdx: null,
      groups: null
    }
  },
  mounted() {
    if (!this.ndx) {
      this.constructedNdx = this.$crossfilter(sampleData)
    }
    this.createGroups()
  },
  methods: {
    createGroups() {
      let uniqueTeams = Array.from(new Set(this.computedNdx.all().map((d) => d.team)))
      this.groups = uniqueTeams.map((team, i) => {
        return {
          name: team,
          valueAccessor: (d) => d.value[team] || 0,
          color: this.$d3.interpolateTurbo((i + 1) / uniqueTeams.length)
        }
      })
    },
    dimensionConstructor(d) {
      return this.$d3.timeDay(new Date(d.date))
    }
  },
  computed: {
    computedNdx() {
      return this.ndx || this.constructedNdx
    },
    reducer() {
      return {
        add: (p, v) => {
          p[v.team] = (p[v.team] || 0) + v.hours
          return p
        },
        remove: (p, v) => {
          p[v.team] = (p[v.team] || 0) - v.hours
          return p
        },
        init: () => ({})
      }
    },
    chartOptions() {
      return {
        height: 350,
        legendOptions: {
          x: 36,
          y: 20,
          horizontal: true,
          itemWidth: 120,
          legendWidth: 720
        },
        margins: {
          top: 60
        },
        xAxis: {
          x: (dimension) => {
            let top = new Date(dimension.top(1)[0].date)
            let bottom = new Date(dimension.bottom(1)[0].date)
            return this.$d3.scaleTime().domain([bottom, top])
          }
        }
      }
    }
  }
}
</script>
