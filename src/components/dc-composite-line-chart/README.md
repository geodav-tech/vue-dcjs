### \<dc-composite-line-chart>

### extends
- [BaseChartMixin](../../mixins#base-chart)
- [DimensionMixin](../../mixins/#dimension)
- [GroupMixin]('../../mixins/#group)
- [AxisMixin]('../../mixins/#axis)
- [LegendMixin]('../../mixins/#legend)

### props
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| groups | Array<{name: string, valueAccessor: string, (d => value), color: string}> | | A list of groups to draw each line from. This should be something like team names in the example shown. The name property is used in the legend. The color property will determine the color of the line/fill area. |


### options
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| elastic | boolean | true | `dc.chart.elasticY()` does the chart y axis scale dynamically when other dimensions are filtered? |
| renderArea | boolean | true | fills the area under the line |


### note
- `groups` must be defined when this component is mounted. use `v-if="groups"` if groups are not ready on component startup

### examples
all charts should share a crossfilter instance, somewhere in a parent component you should have something like:
```javascript
import sampleData from '../../sample-data.js'
created () {
	this.ndx = this.$crossfilter(sampleData)
}
```
Please see [sample-data](../../sample-data.js) to see the data we are using in the examples

- Hours worked by team in a line chart by date
```html
<dc-composite-line-chart
  :ndx="ndx"
  v-if="groups"
  :dimension-constructor="dimensionConstructor"
  :reducer="reducer"
  :groups="groups"
  :options="chartOptions"
/>
```
```javascript
data () {
	return {
		groups: null, // make false until initialized to prevent line chart from drawing before data is ready
		colors: [
			'#ffcab1',
			'#69a2b0',
			'#659157',
			'#a1c084',
			'#e05263',
			'#950952',
			'#5e0035',
			'#020202',
			'#023618',
			'#3d405b',
			'#9C95DC',
			'#0B7189',
		],
	}
}
mounted () {
	// create a set of all team names to use as our `groups` property.
	let uniqueTeamNames = Array.from(new Set(this.ndx.all().map(d => d.team))).sort()
	this.groups = uniqueTeamNames.map((team, i) => {
		return {
			name: team, // displayed by legend
			valueAccessor: d =>  d.value[team] || 0, // accessor to retrieve THIS GROUP's value from reduction result
			color: this.colors[i % this.colors.length] // the color of this group
		}
	})
},
methods: {
	dimensionConstructor (d) {
		return this.$d3.timeDay(new Date(d.date))
	}
}
computed: {
	reducer () {
		return {
			add: (p, v) => {
				p[v.team] = (p[v.team] || 0) + v.hours
				return p
			},
			remove: (p, v) => {          
				p[v.team] = (p[v.team] || 0) - v.hours
				return p
			},
			init: () => ({})
		}
	},
	chartOptions () {
		return {
			height: 350, // how tall the chart is
			legendOptions: {
				x: 36,
				y: 20,
				horizontal: true,
				itemWidth: 120,
				legendWidth: 720
			},
			margins: {// space for legend
				top: 60
			},
			xAxis: { // 
				x: (dimension) => {
					// tell the chart the xAxis is a timeScale from the start date (bottom) to the end date (top)
					let top = new Date(dimension.top(1)[0].date)
					let bottom = new Date(dimension.bottom(1)[0].date)
					return this.$d3.scaleTime().domain([bottom, top])
				}
			}
	}
}
```
