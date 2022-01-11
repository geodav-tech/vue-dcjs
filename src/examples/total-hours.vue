<template>
  <div class="example-container total-hours-container">
    <label class="example-label">
      <a href="https://github.com/geodav-tech/vue-dcjs/tree/master/src/components/dc-number-display" target="_blank">Number display</a>
      showing total hours within all filters
    </label>
    <br>
    <br>
    <dc-number-display
      :ndx="ndx"
      reducer="hours"
      :options="{
        singular: 'hour',
        formatNumber: ',.1f'
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
