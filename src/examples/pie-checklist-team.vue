<template>
  <div class="pie-checklist-container example-container">
    <div class="flex-container">
      <pie-team :ndx="computedNdx" class="flex-item" @post-render="(chart) => (pieChart = chart)" />
      <div class="flex-item" style="padding-left: 1rem">
        <label class="example-label">
          <a href="" target="_blank">Checklist</a>
          for pie chart
        </label>
        <dc-checklist v-if="pieChart" :chart="pieChart" :digits="0" :max-height="324" />
      </div>
    </div>
  </div>
</template>

<script>
import { DcChecklist } from '../components'
import PieTeam from './pie-team.vue'

export default {
  components: { DcChecklist, PieTeam },
  props: {
    ndx: {
      // if not passed we will construct our own
      type: Object
    }
  },
  data() {
    return {
      pieChart: null,
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

<style>
.pie-checklist-container .flex-container {
  display: flex;
}
.pie-checklist-container .flex-container .flex-item {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.pie-checklist-container .flex-container .flex-item .example-label,
.pie-checklist-container .flex-container .flex-item .dc-search-input-container,
.pie-checklist-container .flex-container .flex-item .dc-checkbox-container {
  width: 100%;
}
</style>
