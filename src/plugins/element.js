import Vue from 'vue'
import { Button } from 'element-ui'
import {Form,FormItem} from "element-ui";
import {Input} from "element-ui";
//message需要全局挂载
import {Message} from "element-ui";

Vue.use(Input)
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
//全局挂载,这里是把Message挂载到了vue的原型组件,这样的话每一个组件都可以通过this来直接访问到message组件
Vue.prototype.$message=Message//这里的$message可以任意写,其他都是固定格式