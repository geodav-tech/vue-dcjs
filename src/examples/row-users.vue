<template>
  <example-container class="row-users-container" link="src/components/dc-row-chart" linkText="Row chart" label="by users">
    <dc-row-chart
      v-if="computedNdx"
      :ndx="computedNdx"
      :options="{
        label: (d) => d.key.split('.').slice(1).join('.'),
        margins: { left: 2 }
      }"
      :dimension-constructor="(d) => `${d.user_id}.${d.name}`"
      reducer="hours"
    />
  </example-container>
</template>

<script>
import { DcRowChart } from '../components'
import sampleData from '../sample-data.js'
import ExampleContainer from './example-container.vue'

export default {
  components: { DcRowChart, ExampleContainer },
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
