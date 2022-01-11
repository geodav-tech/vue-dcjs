<template>
  <div class="example-container percent-hours-container">
    <label class="example-label">
      <a href="https://github.com/geodav-tech/vue-dcjs/tree/master/src/components/dc-number-display" target="_blank">Number display</a>
      showing percentage of hours within all filters
    </label>
    <br>
    <br>
    <dc-number-display
      :ndx="computedNdx"
      reducer="hours"
      :options="{
        html: { some: '%number hours worked', none: '%number hours worked', one: '%number hours worked' },
        formatNumber: ',.1%',
        valueAccessor: (d, i, total) => d / (total || 1)
      }"
    />
  </div>
</template>

<script>
import { DcNumberDisplay } from '../components'
export default {
  components: { DcNumberDisplay },
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
