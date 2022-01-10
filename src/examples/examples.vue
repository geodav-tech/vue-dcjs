<template>
  <div class="examples-page">
    <row-users :ndx="ndx" />
    <pie-team :ndx="ndx" />
    <pie-checklist-team :ndx="ndx" />
    <bar-tasks :ndx="ndx" />
    <bar-team :ndx="ndx" />
    <date-hour :ndx="ndx" />
    <composite-line-metric :ndx="ndx" />
  </div>
</template>

<script>
import sampleData from '../sample-data'
import BarTasks from './bar-tasks.vue'
import BarTeam from './bar-team.vue'
import CompositeLineMetric from './composite-line-metric.vue'
import DateHour from './date-hour.vue'
import PieChecklistTeam from './pie-checklist-team.vue'
import PieTeam from './pie-team.vue'
import RowUsers from './row-users.vue'

export default {
  components: { BarTasks, BarTeam, CompositeLineMetric, DateHour, PieChecklistTeam, PieTeam, RowUsers },
  data() {
    return {
      ndx: null
    }
  },
  created() {
    this.ndx = this.$crossfilter(sampleData)
  }
}
</script>

<style>
.examples-page > .example-container {
  margin-top: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid gainsboro;
}

.examples-page .example-label {
  font-weight: bold;
  font-size: 1.2rem;
  text-decoration: underline;
}
</style>
