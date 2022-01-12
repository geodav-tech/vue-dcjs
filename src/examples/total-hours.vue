<template>
  <example-container class="total-hours-container" link="src/components/dc-number-display" linkText="Number display" label="showing total hours within all filters">
    <dc-number-display
      :ndx="ndx"
      reducer="hours"
      :options="{
        singular: 'hour',
        formatNumber: ',.1f'
      }"
    />
  </example-container>
</template>

<script>
import { DcNumberDisplay } from '../components'
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
