<template>
  <div class="report">
    <dc-row-chart
      :ndx="ndx"
      :options="rowChartOptions"
      :dimension-constructor="d => `${d.user_id}.${d.first_name} ${d.last_name}`"
      reducer="hours"
      :group-options="{ orderNatural: true }"
    />
  </div>
</template>

<script>
import DcRowChart from '../components/dc-row-chart.vue'
import sampleData from '../sample-data.js'
import crossfilter from 'crossfilter2'

export default {
  name: 'Home',
  components: { DcRowChart},
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
        labelAccessor: d => d.key.split('.').slice(1).join('.')
      }
    }
  }
}
</script>
