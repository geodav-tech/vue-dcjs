<template>
  <example-container class="pie-team-container" link="src/components/dc-pie-chart" linkText="Pie chart" label="by team">
    <dc-pie-chart
      :ndx="computedNdx"
      :options="{
        title: (d) => `${d.key}: ${d.value.toFixed(2)} hours`,
        slicesCap: 6,
        maxRadius: 300,
        label: (d) => `${d.key};|;${d.value.toFixed(0)}`
      }"
      dimension-constructor="team"
      reducer="hours"
      @pre-render="$emit('pre-render', $event)"
      @post-render="$emit('post-render', $event)"
    />
  </example-container>
</template>

<script>
import { DcPieChart } from '../components'
import sampleData from '../sample-data'
import ExampleContainer from './example-container.vue'

export default {
  components: { DcPieChart, ExampleContainer },
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
