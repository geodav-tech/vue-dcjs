<template>
  <div class="pie-team-container example-container">
    <label class="example-label">
      Pie chart by team
    </label>
    <dc-pie-chart
      :ndx="computedNdx"
      :options="{
        name: 'TeamPieChart',
        title: d =>`${d.key}: ${d.value.toFixed(2)} hours`,
        slicesCap: 6,
        maxRadius: 300,
        label: d => `${d.key};|;${d.value.toFixed(0)}`
      }"
      dimension-constructor="team"
      reducer="hours"
    />
  </div>
</template>

<script>
import { DcPieChart } from '../components'

export default {
  components: { DcPieChart },
  props: {
    ndx: { // if not passed we will construct our own
      type: Object
    }
  },
  data () {
    return {
      constructedNdx: null
    }
  },
  mounted () {
    if (!this.ndx) {
      this.constructedNdx = this.$crossfilter(sampleData)
    }
  },
  computed: {
    computedNdx () {
      return this.ndx || this.constructedNdx
    }
  }
}
</script>

<style>

</style>