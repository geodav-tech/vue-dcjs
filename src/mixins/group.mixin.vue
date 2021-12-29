<script>
import { accessorFunc } from '../dc-utils.js'
export default {
  name: 'GroupMixin',
  props: {
    reducer: {
      type: [String, Function, Object],
    },
    groupOptions: {
      /**
       * sumKey: string | function
       * order: d => orderValue,
       * orderNatural: boolean (not compatable with order),
       */
      type: Object
    }
  },
  methods: {
    createGroup (dimension) {
      let group = dimension.group()

      if (this.groupOptions && this.groupOptions.order) {
        if (typeof this.groupOptions.order === 'string') {
          group.order(d => d[this.groupOptions.order])
        } else if (typeof this.groupOptions.order === 'function') {
          group.order(this.groupOptions.order)
        }
      } else if (this.groupOptions && this.groupOptions.orderNatural) {
        group.orderNatural()
      }

      if (typeof this.reducer === 'string' || typeof this.reducer === 'function') {
        group.reduceSum(accessorFunc(this.reducer))
      } else if (this.reducer.add && this.reducer.remove && this.reducer.init) {
        let { add, remove, init } = this.reducer
        group.reduce(add, remove, init)
      }

      this.$emit('group-created', group)
      return group
    }
  }
}
</script>