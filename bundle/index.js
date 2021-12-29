/*!
 * vue-dcjs v0.1.0
 * (c) shawn@geodav.tech
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var DcPlugin = require('@/plugins/dc.plugin');
var DcRowChart = require('@/components/dc-row-chart');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var DcPlugin__default = /*#__PURE__*/_interopDefaultLegacy(DcPlugin);
var DcRowChart__default = /*#__PURE__*/_interopDefaultLegacy(DcRowChart);

var VueDc = {
  install: function install(Vue, options) {
    // register $dc, $d3, $crossfilter
    Vue.use(DcPlugin__default["default"], options); // register out of the box components

    Vue.component('dc-row-chart', DcRowChart__default["default"]);
  }
}; // fix warning prefer_named_exports by naming this export

exports.VueDc = VueDc;
