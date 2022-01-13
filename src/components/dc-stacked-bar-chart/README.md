### \<dc-stacked-bar-chart>
- [Home]('https://github.com/geodav-tech/vue-dcjs#available-components')

### extends
- [BaseChartMixin](../../mixins#base-chart)
- [DimensionMixin](../../mixins/#dimension)
- [GroupMixin](../../mixins/#group)
- [AxisMixin](../../mixins/#axis)
- [LegendMixin]('../../mixins/#legend)

### props
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| groups | string[] | | the keys for the groups (x domain values) |
| stacks | string[], {name: string, color: string, key: string}[] | | the definition for the stacks, bottom -> top |
| colors | string[] | | the list of colors for each stack. |
| keySeparator | string | ';|;' | the key used to separate the group and the stack when creating the grouping. make sure this key is not in the group or stack name |
| groupAccessor | string, (d) => groupKey | the key in the record for the group name. (used for validate function which keeps values in proper group + stacks). can be passed via `options` |
| stackAccessor | string, (d) => stackKey | the key in the record for the stack name. (used for the validate function which keeps values in proper group + stacks). can be passed via `options` |
| validateFunction | (d, stack, key) => boolean | validate that this element belongs in this stack + key grouping. can be passed via `options` |


### options
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| elastic | boolean | true | `dc.chart.elasticY()` does the chart y axis scale dynamically when other dimensions are filtered? |
| groupAccessor | string, (d) => groupKey | the key in the record for the group name. (used for validate function which keeps values in proper group + stacks). can be passed via `props` |
| stackAccessor | string, (d) => stackKey | the key in the record for the stack name. (used for the validate function which keeps values in proper group + stacks). can be passed via `props` |
| validateFunction | (d, stack, key) => boolean | validate that this element belongs in this stack + key grouping. can be passed via `props` |

### note
- `groups` and `stacks` must be defined when the component is mounted. use `v-if` if constructing groups and stacks during runtime.

### examples
all charts should share a crossfilter instance, somewhere in a parent component you should have something like:
```javascript
import sampleData from '../../sample-data.js'
created () {
	this.ndx = this.$crossfilter(sampleData)
}
```
Please see [sample-data](../../sample-data.js) to see the data we are using in the examples

- Hours worked by team. Stacked by project
```html
<dc-stacked-bar-chart
  v-if="stacks.length && groups.length"
  :ndx="ndx"
  :stacks="stacks"
  :groups="groups"
  :options="{
    valueAccessor: 'hours',
    stackAccessor: 'project',
    groupAccessor: 'team',
    legendOptions: {
      y: 12,
      x: 36,
      horizontal: true,
      legendWidth: 900,
      itemWidth: 180
    },
    margins: {
      top: 160,
      left: 40
    },
    title: function(d) {
      return `${this.layer} ${d.key}: ${d.value[this.layer].toFixed(2)}`
    },
    height: 480
  }"
/>
```
```javascript
data () {
	return {
		groups: [],
		stacks: []
	}
}
mounted(){
	let allData = this.ndx.all()
	this.groups = Array.from(new Set(allData.map(d => d.team))).sort()
	this.stacks = Array.from(new Set(allData.map(d => d.project))).sort()
}
```

- Hours worked by team. Stacked by if the user working has uploaded an avatar or not
```html
<dc-stacked-bar-chart
	v-if="stacks.length && groups.length"
	:ndx="ndx"
	:stacks="stacks"
	:groups="groups"
	:colors="['#ee9c20', '#209cee']"
	:options="{
		valueAccessor: 'hours',
		stackAccessor: d => d.avatar.toString(),
		groupAccessor: 'team',
		legendOptions: { y: 12, x: 36 },
		margins: { top: 50, left: 40 },
		title: function(d) {
			return `${this.layer} ${d.key}: ${d.value[this.layer].toFixed(2)}`
		},
		height: 420
	}"
/>
```
```javascript
data () {
	return {
		groups: [],
		stacks: [
			{ name: 'Has avatar', key: 'true' },
			{ name: 'Does not have avatar', key: 'false'}
		]
	}
},
mounted() {
	let allData = this.ndx.all()
	this.groups = Array.from(new Set(allData.map(d => d.team))).sort()
}
```
