import Vue from 'vue'
import App from './App.vue'
import dcPlugin from './plugins/dc.plugin'
import router from './router'

Vue.config.productionTip = false

// https://forum.vuejs.org/t/call-the-overrided-method-from-extend-mixin-think-super/1469
// https://github.com/iashraful/vue-super-call/blob/master/index.js
Vue.prototype.$super = function (options) {
  return new Proxy(options, {
    get: (options, name) => {
      if (options.methods && name in options.methods) {
        return options.methods[name].bind(this)
      }
    },
  })
}

Vue.use(dcPlugin)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
