<template>
  <div class="examples-page">
    <row-users :ndx="ndx" />
    <pie-team :ndx="ndx" />
    <pie-checklist-team :ndx="ndx" />
    <bar-tasks :ndx="ndx" />
    <bar-team :ndx="ndx" />
  </div>
</template>

<script>
import sampleData from '../sample-data'
import RowUsers from './row-users.vue'
import PieTeam from './pie-team.vue'
import BarTasks from './bar-tasks.vue'
import BarTeam from './bar-team.vue'
import PieChecklistTeam from './pie-checklist-team.vue'

export default {
  components: { RowUsers, PieTeam, BarTasks, BarTeam, PieChecklistTeam },
  data () {
    return {
      ndx: null
    }
  },
  created () {
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