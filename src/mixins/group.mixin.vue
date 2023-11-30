<script>
import { accessorFunc } from '../dc-utils.js'
export default {
  name: 'GroupMixin',
  props: {
    reducer: {
      type: [String, Function, Object]
    },
    groupOptions: {
      /**
       * order: d => orderValue,
       * orderNatural: boolean (not compatable with order),
       */
      type: Object
    }
  },
  methods: {
    createGroup(dimension, groupAll = false) {
      let group = groupAll ? dimension.groupAll() : dimension.group()

      if (this.groupOptions && this.groupOptions.order) {
        if (typeof this.groupOptions.order === 'string') {
          group.order((d) => d[this.groupOptions.order])
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
      return new Promise((resolve, reject) => {
        let resolveTimeout = setTimeout(() => {
          return resolve(group)
        })
        this.$emit('group-created', group, (replaceGroup) => {
          // parent called back with a replacement
          clearTimeout(resolveTimeout)
          return resolve(replaceGroup)
        })
      })
    },
    // https://github.com/dc-js/dc.js/blob/develop/web-src/examples/focus-ordinal-bar.html
    ordinalToLinear(group, valueFunc, isGroupAll = false) {
      var _ord2int, _int2ord
      return {
        top: function (number = 1) {
          if (isGroupAll) {
            return Object.entries(group.value())
              .map(([key, value]) => ({ key, value }))
              .sort((a, b) => valueFunc(b.value) - valueFunc(a.value))
              .slice(0, number)
          } else {
            return group.order((d) => valueFunc(d)).top(number)
          }
        },
        all: function () {
          var ret = []
          if (isGroupAll) {
            ret = Object.entries(group.value())
              .map(([key, value]) => ({ key, value }))
              .sort((a, b) => valueFunc(b.value) - valueFunc(a.value))
          } else {
            ret = group.order((d) => valueFunc(d)).top(Infinity)
          }
          _ord2int = {}
          _int2ord = []
          ret.forEach(function (d, i) {
            _ord2int[d.key] = i
            _int2ord[i] = d.key
          })
          return ret
        },
        ord2int: function (o) {
          if (!_ord2int) {
            this.all()
          }
          return _ord2int[o]
        },
        int2ord: function (i) {
          if (!_int2ord) {
            this.all()
          }
          return _int2ord[i]
        },
        order: function(callback) {
          if (isGroupAll) {
            // if this is a groupAll, we'll have to manually figure this out
            // generally this is used for dc-checklist
            const order = Object.entries(group.value()).map(([key, value]) => ({ key, value })).sort((a, b) => callback(b.value) - callback(a.value))
            // since we just turned the return into an array, we have to fake some dc functions we expect to use on the array
            // dc-checklist uses top, but we'll also add .all in case
            order.top = (num) => order.slice(0, num)
            order.all = () => order
            return order
          } else {
            // if this isn't a groupAll, it has an order function and you can just use that
            return group.order(callback)
          }
        }
      }
    }
  }
}
</script>
