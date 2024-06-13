<template>
  <example-container
    class="percent-hours-container"
    link="src/components/dc-number-display"
    linkText="Number display"
    label="showing percent of total hours"
  >
    <dc-number-display
      :ndx="computedNdx"
      reducer="hours"
      :options="{
        html: { some: '%number hours worked', none: '%number hours worked', one: '%number hours worked' },
        formatNumber: ',.1%',
        valueAccessor: (d, total) => d / (total || 1)
      }"
    />
  </example-container>
</template>

<script>
import { DcNumberDisplay } from '../components'
import sampleData from '../sample-data'
import ExampleContainer from './example-container.vue'

export default {
  components: { DcNumberDisplay, ExampleContainer },
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
