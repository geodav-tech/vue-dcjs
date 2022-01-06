<template>
  <div class="bar-team-container example-container">
    <label class="example-label">
      Bar chart by team
    </label>
    <dc-bar-chart
      :ndx="computedNdx"
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
import { DcBarChart } from '../components'
import sampleData from '../sample-data'

export default {
  components: { DcBarChart },
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