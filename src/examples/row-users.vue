<template>
  <div class="row-users-container example-container">
    <label class="example-label">
      Row chart by users
    </label>
    <dc-row-chart
      v-if="computedNdx"
      :ndx="computedNdx"
      :options="{
        label: d => d.key.split('.').slice(1).join('.')
      }"
      :dimension-constructor="d => `${d.user_id}.${d.name}`"
      reducer="hours"
    />
  </div>
</template>

<script>
import { DcRowChart } from '../components'
import sampleData from '../sample-data.js'

export default {
  components: { DcRowChart },
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