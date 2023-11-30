<template>
  <div class="examples-page">
    <div class="example-flex-item example-container">
      <div class="example-flex-item">
        <total-hours :ndx="ndx" />
      </div>
      <div class="example-flex-item">
        <percent-hours :ndx="ndx" />
      </div>
    </div>
    <row-users :ndx="ndx" />
    <pie-team :ndx="ndx" />
    <pie-checklist-team :ndx="ndx" />
    <bar-tasks :ndx="ndx" />
    <bar-team :ndx="ndx" />
    <date-hour :ndx="ndx" />
    <composite-line-metric :ndx="ndx" />
    <!-- this one causes performance issues because it's n+1 charts composed together where n is project count -->
    <!-- <stacked-team-project :ndx="ndx" /> -->
    <stacked-team-avatar :ndx="ndx" />
    <bar-checklist :ndx="ndx" />
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
import StackedTeamProject from './stacked-team-project.vue'
import StackedTeamAvatar from './stacked-team-avatar.vue'
import TotalHours from './total-hours.vue'
import PercentHours from './percent-hours.vue'
import BarChecklist from './bar-checklist.vue'

export default {
  components: {
    BarTasks,
    BarTeam,
    CompositeLineMetric,
    DateHour,
    PieChecklistTeam,
    PieTeam,
    RowUsers,
    StackedTeamProject,
    StackedTeamAvatar,
    TotalHours,
    PercentHours,
    BarChecklist
  },
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
.examples-page .example-flex-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
