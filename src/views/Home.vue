<template>
  <div class="home">
    <div class="about">
      <div class="example-label">About</div>
      <ul>
        <li v-for="(info, index) in aboutInfo" :key="`info-${index}`">
          <b>{{ info.text }}</b>:
          <a v-if="info.href" :href="info.href" target="_blank">{{ info.value }}</a>
          <span v-else>{{ info.value }}</span>
        </li>
      </ul>
    </div>

    <hr />

    <div class="example-label">Examples</div>

    <hr />

    <examples />
  </div>
</template>

<script>
import Examples from '../examples'
export default {
  components: { Examples },
  name: 'Home',
  data() {
    return {
      aboutInfo: [
        { text: 'Github', href: 'https://github.com/geodav-tech/vue-dcjs/', value: 'vue-dcjs' },
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
.home .about {
  text-align: left;
}
</style>
