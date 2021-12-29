<template>
  <div class="report">
    <dc-row-chart
      :ndx="ndx"
      :options="rowChartOptions"
      dimension-constructor="user_id"
      reducer="hours"
      :group-options="{ orderNatural: true }"
    />
  </div>
</template>

<script>
import DcRowChart from '@/components/dc-row-chart'
import sampleData from '@/sample-data'
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
        labelAccessor: d => `${d.first_name} ${d.last_name}`
      }
    }
  }
}
</script>
