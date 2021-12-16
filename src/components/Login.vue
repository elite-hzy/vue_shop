<template>
  <div class="login_container">
    <div class="login_box">
<!--      头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
<!--      登录区域-->
<!--      elementUI是通过按需导入的,去element.js里按需导入-->
<!--      loginFormRef是form的实例对象-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
<!--        这里可以看elementUI里'带icon的输入框'-->
<!--        用户名这里用了第三方图标库这里用了阿里的iconfont.css-->
<!--        注意prop的username必须和v-model的username一致-->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
<!--        密码-->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
        </el-form-item>
<!--        提交按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
export default {
  data(){
    return{
    //登录表单的数据绑定对象
      loginForm:{
        username:'',
        password:''
      },
      //表单的验证规则
      loginFormRules:{
        //用户名是否合法
        username:[
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    resetLoginForm(){
      console.log(this);//这个this指向组件的全部实例,实例里的$refs就是实例对象
      //只要获取到表单的实例对象(ref可以获得),然后调用resetFields这个函数,就可以就行重置
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      //使用validate来进行预验证
      this.$refs.loginFormRef.validate(async valid=>{
          if(!valid)
            return;
            //这里就是axios了
            //返回的结果是promise  用async和await来处理
            // const result= await this.$http.post("login",this.loginForm);
            const {data:result}= await this.$http.post("login",this.loginForm);
            // const result=this.$http.post("login",this.loginForm);
            console.log(result);
            if(result.meta.status!=200){
              return this.$message.error("用户名或密码错误");
            }else{
              this.$message.success("登录成功");
              window.sessionStorage.setItem("token",result.data.token);
              this.$router.push("/home");
            }
      })
    }

  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  //居中的做法
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  //让盒子和外面有边距
  padding: 10px;
  box-shadow: 0 0 10px  #ddd;//padding没有该样式
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);//这个是根据盒子高度的一样来位移,这里是130x0.5
                                  //基本上这里是上去 然后左移
  background-color: #ffffff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eeeeee;
  }
}
//按钮位置
.btns{
  display: flex;
  justify-content: flex-end;
}
//调整布局表单
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
