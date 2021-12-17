import Vue from 'vue'
//全局导入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

// import { Button } from 'element-ui'
// import {Form,FormItem} from "element-ui";
// import {Input,Container,Header,Aside,Main} from "element-ui";
// //message需要全局挂载
// import {Message} from "element-ui";
//
// Vue.use(Input)
// Vue.use(Button)
// Vue.use(FormItem)
// Vue.use(Form)
// Vue.use(Container)
// Vue.use(Header)
// Vue.use(Aside)
// Vue.use(Main)
// //全局挂载,这里是把Message挂载到了vue的原型组件,这样的话每一个组件都可以通过this来直接访问到message组件
// Vue.prototype.$message=Message//这里的$message可以任意写,其他都是固定格式