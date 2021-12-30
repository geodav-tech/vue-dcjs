<template>
  <div class="report">
    <dc-row-chart
      :ndx="ndx"
      :options="rowChartOptions"
      :dimension-constructor="d => `${d.user_id}.${d.first_name} ${d.last_name}`"
      reducer="hours"
    />
    <dc-pie-chart
      :ndx="ndx"
      :options="pieChartOptions"
      dimension-constructor="team"
      reducer="hours"
    />
  </div>
</template>

<script>
import DcRowChart from '../components/dc-row-chart.vue'
import sampleData from '../sample-data.js'
import crossfilter from 'crossfilter2'
import DcPieChart from '../components/dc-pie-chart.vue'

export default {
  name: 'Home',
  components: {
    DcRowChart,
    DcPieChart
  },
  data () {
    return {
      ndx: null
    }
  },
  created () {
    this.ndx = crossfilter(sampleData)
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
        title: d =>`${d.key}: ${d.value.toFixed(2)} hours`,
        slicesCap: 6,
        maxRadius: 300,
        label: d => `${d.key};|;${d.value.toFixed(0)}`
      }
    }
  }
}
</script>
