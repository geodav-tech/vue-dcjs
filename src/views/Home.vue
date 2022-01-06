<template>
  <div class="report">
    <dc-row-chart
      :ndx="ndx"
      :options="rowChartOptions"
      :dimension-constructor="d => `${d.user_id}.${d.name}`"
      reducer="hours"
    />
    <div style="display: flex">
      <dc-checklist
        style="flex: 1"
        chart="TeamPieChart"
        :options="pieChartOptions"
        :digits="0"
        :max-height="300"
      />
      <dc-pie-chart
        style="flex: 1"
        :ndx="ndx"
        :options="pieChartOptions"
        dimension-constructor="team"
        reducer="hours"
      />
    </div>
    <dc-bar-chart
      :ndx="ndx"
      :options="barChartOptions"
      :dimension-constructor="d => d"
      :reducer="{
        add: (p, v) => {
          if (!v.tasks || !v.tasks.length) {
            p.none = (p.none || 0) + v.hours
          } else {
            v.tasks.forEach(task => {
              p[task] = (p[task] || 0) + v.hours
            })
          }
          return p
        },
        remove: (p, v) => {
          if (!v.tasks || !v.tasks.length) {
            p.none = (p.none || 0) - v.hours
          } else {
            v.tasks.forEach(task => {
              p[task] = (p[task] || 0) - v.hours
            })
          }
          return p
        },
        init: () => ({})
      }"
    />
    <dc-bar-chart
      :ndx="ndx"
      :options="{
        height: 250,
        margins: { top: 40, right: 40, left: 40, bottom: 40 }
      }"
      dimension-constructor="team"
      reducer="hours"
    />
  </div>
</template>

<script>
import DcRowChart from '../components/dc-row-chart.vue'
import sampleData from '../sample-data.js'
import DcPieChart from '../components/dc-pie-chart.vue'
import DcBarChart from '../components/dc-bar-chart.vue'
import DcChecklist from '../components/dc-checklist.vue'

export default {
  name: 'Home',
  components: {
    DcRowChart,
    DcPieChart,
    DcBarChart,
    DcChecklist
  },
  data () {
    return {
      ndx: null
    }
  },
  created () {
    this.ndx = this.$crossfilter(sampleData)
  },
  computed: {
    rowChartOptions () {
      return {
         // label is going to show their name (dimension key part)
         // if they had a . in their name keep it I guess
        label: d => d.key.split('.').slice(1).join('.')
      }
    },
    pieChartOptions () {
      return {
        name: 'TeamPieChart',
        title: d =>`${d.key}: ${d.value.toFixed(2)} hours`,
        slicesCap: 6,
        maxRadius: 300,
        label: d => `${d.key};|;${d.value.toFixed(0)}`
      }
    },
    barChartOptions () {
      return {
        groupAll: true,
        height: 300,
        scrollable: true,
        minScrollable: 18,
        margins: {
          top: 40,
          right: 60,
          left: 60,
          bottom: 60
        },
        filterFunction: (filters, item) => {
          return (filters.includes('none') && !item.tasks?.length) || item.tasks.some(task => filters.includes(task))
        }
      }
    }
  }
}
</script>
