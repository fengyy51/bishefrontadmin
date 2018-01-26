import Vue from 'vue';
//引入我们写好的App.vue文件
import App from './App';
import router from './router';
import axios from './util/axios.js';
import ElementUI from 'element-ui';
import wsCache from 'web-storage-cache';
import vmodal from 'vue-js-modal';
import fileupload from 'vue-upload-component';
import colorPicker from './util/vue-color-picker';
import echarts from 'echarts';
import VueDND from 'awe-dnd'; //排序
import 'element-ui/lib/theme-default/index.css';
import "babel-polyfill";
import './mock/index.js';
Vue.use(vmodal);
Vue.use(ElementUI);
Vue.use(fileupload);
Vue.use(colorPicker);
Vue.use(VueDND);

Vue.prototype.$wsCache = new wsCache();
window.$wsCache = new wsCache();
Vue.prototype.$axios = axios;
Vue.prototype.$echarts=echarts
/*vue.2.0的渲染过程：

1.首先需要了解这是 es 6 的语法，表示 Vue 实例选项对象的 render 方法作为一个函数，接受传入的参数 h 函数，返回 h(App) 的函数调用结果。

2.其次，Vue 在创建 Vue 实例时，通过调用 render 方法来渲染实例的 DOM 树。

3.最后，Vue 在调用 render 方法时，会传入一个 createElement 函数作为参数，也就是这里的 h 的实参是 createElement 函数，然后 createElement 会以 APP 为参数进行调用，关于 createElement 函数的参数说明参见：Element-Arguments
*/
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
