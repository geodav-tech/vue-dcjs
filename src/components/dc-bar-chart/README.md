### <dc-bar-chart>

### extends
- [BaseChartMixin](../../mixins#base-chart)
- [DimensionMixin](../../mixins/#dimension)
- [GroupMixin]('../../mixins/#group)

### options
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| elastic | boolean | true | `dc.chart.elasticY()` does the chart y axis scale dynamically when other dimensions are filtered? |
| scrollable | boolean | false | add a custom zoom/scrollable horizontal chart above the bar chart. Allows user to zoom to specific regions of the bar chart |
| minScrollable | number | 12 | the minimum number of entries for scrolling to be enabled even if scrollable is true |
| scrollHeight | number | 12 | the height of the scrollbar above the main chart |
| mouseZoom | boolean | true | enable zooming in and out with the mouse when scrolling is enabled |

### Examples
all charts should share a crossfilter instance, somewhere in a parent component you should have something like:
```javascript
import sampleData from '../../sample-data.js'
created () {
	this.ndx = this.$crossfilter(sampleData)
}
```
Please see [sample-data](../../sample-data.js) to see the data we are using in the examples

- hours worked by team
```html
<dc-bar-chart
	:ndx="ndx"
	:options="{ height: 250, margins: { top: 40, right: 40, left: 40, bottom: 40 } }"
	dimension-constructor="team"
	reducer="hours"
/>
```

- complex hours worked by task (array) scrollable and filterable
```html
<dc-bar-chart
	:ndx="ndx"
	:options="{
		groupAll: true,
		height: 300,
		scrollable: true,
		minScrollable: 18,
		margins: {
			top: 40,
			right: 60,
			left: 60,
			bottom: 60
		},
		filterFunction: (filters, item) => {
			return (filters.includes('none') && !item.tasks?.length) || item.tasks.some(task => filters.includes(task))
		}
	}"
	:dimension-constructor="d => d"
	:reducer="{
		add: (p, v) => {
			if (!v.tasks || !v.tasks.length) {
				p.none = (p.none || 0) + v.hours
			} else {
				v.tasks.forEach(task => {
					p[task] = (p[task] || 0) + v.hours
				})
			}
			return p
		},
		remove: (p, v) => {
			if (!v.tasks || !v.tasks.length) {
				p.none = (p.none || 0) - v.hours
			} else {
				v.tasks.forEach(task => {
					p[task] = (p[task] || 0) - v.hours
				})
			}
			return p
		},
		init: () => ({})
	}"
/>
```