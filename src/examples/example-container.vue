<template>
  <div class="example-container">
    <div class="example-header" v-if="link">
      <label class="example-label">
        <!-- idk why but sometimes there was a space between the link and the label, but most of the time there was not -->
        <!-- so this must stay on a single line without any spaces and have the &nbsp; in order to maintain consistency -->
        <a :href="githubLink" target="_blank" style="display: contents">{{linkText}}</a>&nbsp;{{ label }}
      </label>
      <a class="example-reset-button" v-if="reset">
        RESET
      </a>
    </div>

    <slot>
    </slot>

  </div>
</template>

<script>
export default {
  props: {
    link: String,
    linkText: String,
    label: String,
    reset: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    githubLink () {
      return `https://github.com/geodav-tech/vue-dcjs/tree/master/${this.link}`
    }
  }
}
</script>

<style>
.example-container {
  margin-top: 1rem;
  padding: 1rem;
  border-bottom: 1px solid gainsboro;
  margin-bottom: 1rem;
}

.example-container:not(.home-container) .example-container {
  border: none;
  margin: 0;
}
.example-container .example-container:first-child {
  padding-left: 0
}
.example-container .example-container:last-child {
  padding-right: 0
}

.example-container .example-header {
  text-align: left;
  display: flex;
  width: 100%;
}

.example-container .example-label {
  font-weight: bold;
  font-size: 1.2rem;
  text-decoration: underline;
  text-align: left;
  display: flex;
  width: 100%;
}

.example-reset-button {
  cursor: pointer;
  transition: font-size 0.2s, font-weight 0.2s;
}
.example-reset-button:hover {
  font-size: 1.2rem;
  font-weight: bold;
}

</style>