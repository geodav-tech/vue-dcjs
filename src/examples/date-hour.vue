<template>
  <example-container class="date-hour-container" link="src/components/dc-date-chart" linkText="Date chart" label="by hours">
    <dc-date-chart :ndx="computedNdx" :options="{}" reducer="hours" />
  </example-container>
</template>

<script>
import { DcDateChart } from '../components'
import sampleData from '../sample-data.js'
import ExampleContainer from './example-container.vue'

export default {
  components: {
    DcDateChart,
    ExampleContainer
  },
  props: {
    ndx: {
      type: Object
    }
  },
  data() {
    return {
      constructedNdx: null
    }
  },
  mounted() {
    if (!this.ndx) {
      this.constructedNdx = this.$crossfilter(sampleData)
    }
  },
  computed: {
    computedNdx() {
      return this.ndx || this.constructedNdx
    }
  }
}
</script>

<style></style>
