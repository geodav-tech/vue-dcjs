<template>
  <example-container class="bar-team-container" link="src/components/dc-bar-chart" linkText="Bar chart" label="by team">
    <dc-bar-chart
      :ndx="computedNdx"
      :options="{
        height: 250,
        margins: { top: 40, right: 40, left: 40, bottom: 40 }
      }"
      dimension-constructor="team"
      reducer="hours"
    />
  </example-container>
</template>

<script>
import { DcBarChart } from '../components'
import sampleData from '../sample-data'
import ExampleContainer from './example-container.vue'

export default {
  components: { DcBarChart, ExampleContainer },
  props: {
    ndx: {
      // if not passed we will construct our own
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
