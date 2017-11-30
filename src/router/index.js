import Vue from 'vue';
import Router from 'vue-router';
import judgeStatus from '../util/login-status.js';

Vue.use(Router);

var router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            //children为嵌套路由
            children: [{
                path: '/',
                //path可什么都不填，当路径为/home时除了将home组件渲染外，会将welcome组件渲染在home中的router-view中
                //组件懒加载，resolve => require(['@/components/First'],resolve)  这个resolve会在你html上的main文件里面自动生成一个asyc属性，属性值就是对应js的文件位置，
                // 里面会异步按需加载对应的那个组件的js文件，所以webpack的配置文件里的publicpath和chunckfilname很重要
                component: resolve => require(['../components/page/Welcome.vue'], resolve)
            }, {
                path: '/notice',
                component: resolve => require(['../components/page/Notice.vue'], resolve)
            }, {
                //当/home/shop-list匹配成功，将组件渲染在父组件的router-view中
                path: '/shop-list',
                component: resolve => require(['../components/page/Shop-list.vue'], resolve)
            }, // //动态路由匹配，传的参数为id值
                {
                    path: '/act-list/detail/:id',
                    component: resolve => require(['../components/page/Act-detail.vue'], resolve)
                }, {
                    path: '/act-list/sign/:id',
                    component: resolve => require(['../components/page/Act-sign.vue'], resolve)
                },
                {
                path: '/act-list',
                component: resolve => require(['../components/page/Act-list.vue'], resolve)
            }, {
                path:'/act-addinfo/:id',
                component: resolve=>require(['../components/page/Act-addinfo.vue'],resolve)
            }, {
                path: '/coupon',
                component: resolve => require(['../components/page/Coupon.vue'], resolve)
            }, {
                path: '/map',
                component: resolve => require(['../components/page/Map-demo.vue'], resolve)
            }, {
                path: '/shop-list/detail/:id',
                component: resolve => require(['../components/page/Shop-detail.vue'], resolve)
            },{
                    path: '/item-list',
                    component: resolve => require(['../components/page/Item-list.vue'], resolve)
             },{
                path: '/collect/:id',
                component: resolve => require(['../components/page/Collect-list.vue'], resolve)
            },{
                path: '/prize',
                component: resolve => require(['../components/page/Prize-list.vue'], resolve)
            }]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        }, ]
})
//每个路由进入前进行判断，满足条件才进行跳转 next()直接跳转到to.path路径，没有再执行一遍beforeEach导航钩子
router.beforeEach((to, from, next) => {
    if (judgeStatus(to.path))
        next();
})

export default router;
