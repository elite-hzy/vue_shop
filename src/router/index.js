import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import {Message} from "element-ui";//按需导入
import Users from '../components/user/User.vue'
import Rights from "../components/power/Rights.vue";
import Roles from  "../components/power/Roles.vue"
import Category from "../components/goods/category.vue"
import TreeTable from "vue-table-with-tree-grid"
Vue.use(VueRouter)

const routes = [
    {path: '/login', component: Login},
    {
        path: '/home', component: Home, redirect: '/welcome', children: [
            {path: '/welcome', component: Welcome},
            {path: '/users', component: Users},
            {path: '/rights', component: Rights},
            {path: '/roles', component: Roles},
            {path: '/categories', component: Category},
        ]
    },
    {path: '/', redirect: '/login'},
]

Vue.component('tree-table',TreeTable)
const router = new VueRouter({
    routes
})
// //挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        return next();
    }
    //获取token
    const tokenStr = window.sessionStorage.getItem('token');
    //如果为空就跳转回login
    if (!tokenStr) {
        Vue.prototype.$message.error("请先登录");
        // Message.error("请先登录");
        return next('/login');
    }
    next();
})

export default router
//访问这个文件,默认就调用这个
