<template>
  <div class="home">
    <example-container link="#vue-dcjs" linkText="Vue dc-js" class="home-container" :reset="false">
      <div class="vue-dcjs-logo-container">
        <img src="../assets/Logo.png" class="vue-dcjs-logo" />
      </div>
      <div class="about">
        <ul>
          <li v-for="(info, index) in aboutInfo" :key="`info-${index}`">
            <b>{{ info.text }}</b
            >:
            <a v-if="info.href" :href="info.href" target="_blank">{{ info.value }}</a>
            <span v-else>{{ info.value }}</span>
          </li>
        </ul>
      </div>

      <hr />
      <div class="example-label">Examples</div>
      <hr />

      <examples />
    </example-container>
  </div>
</template>

<script>
import Examples from '../examples'
import ExampleContainer from '../examples/example-container.vue'
export default {
  components: { Examples, ExampleContainer },
  name: 'Home',
  data() {
    return {
      aboutInfo: [
        { text: 'Github', href: 'https://github.com/geodav-tech/vue-dcjs/#vue-dcjs', value: 'vue-dcjs' },
        { text: 'NPM', href: 'https://www.npmjs.com/package/vue-dcjs', value: 'vue-dcjs' },
        { text: 'Issues', href: 'https://github.com/geodav-tech/vue-dcjs/issues', value: 'submit here' },
        { text: 'dc', href: 'https://dc-js.github.io/dc.js/', value: 'documentation' },
        { text: 'd3', href: 'https://github.com/d3/d3/blob/main/API.md', value: 'documentation' },
        { text: 'crossfilter', href: 'https://github.com/crossfilter/crossfilter/wiki/API-Reference', value: 'documentation' },
        {
          text: 'Special thanks',
          value: 'to Gordon Woodhull, the main maintainer and author of dcjs, and crossfilter, and a super smart guy.'
        }
      ]
    }
  }
}
</script>
<style>
.home-container {
  border: none;
}
.home .about {
  text-align: left;
}
.home .content {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
.home .vue-dcjs-logo-container {
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
