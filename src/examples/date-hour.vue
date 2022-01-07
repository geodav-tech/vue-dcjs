<template>
  <div class="example-container date-hour-container">
    <label class="example-label">
      <a href="https://github.com/geodav-tech/vue-dcjs/tree/master/src/components/dc-date-chart" target="_blank">
        Date chart
      </a>
      showing hours
    </label>
    <dc-date-chart
      :ndx="computedNdx"
      :options="{}"
      reducer="hours"
    />
  </div>
</template>

<script>
import { DcDateChart } from '../components'
import sampleData from '../sample-data.js'

export default {
  components: {
    DcDateChart
  },
  props: {
    ndx: {
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