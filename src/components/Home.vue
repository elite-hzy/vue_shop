<template>
  <el-container class="home-container">
    <el-header>
      <img src="../assets/heima.png" alt="">
      <span>电商后台管理系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--    页面主体区域-->
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||
        </div>
        <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            router
        >
          <!--            一级菜单-->
          <!--            这里的index是个坑 默认可能都是index=1,如果都为1就会出现打开一个就全部打开,关闭1个就全部关闭
                          这里index本来是字符串,id是整形,需要加一个引号来变成字符串
          -->
          <el-submenu :index="item.id+'' " v-for="item in menulist" :key="item.id"><!--这里的key绑定如果有id建议绑定id -->
            <!--              一级菜单的模板区域-->
            <template slot="title">
              <!--                图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--                文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--              二级菜单-->
            <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <!--                图标-->
                <i class="el-icon-s-data"></i>
                <!--                文本-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      右侧main主题-->
      <el-main>
<!--        放路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data() {
    return {
      //左侧数据菜单
      //渲染菜单,外层菜单用第一层for,内层就用第二层for
      menulist: [],
      //字体图标,这里用按照每个菜单特有的id来获取的
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      //是否折叠参数
      isCollapse:false,
    }
  },
  methods: {
    logout() {
      //销毁token
      window.sessionStorage.clear();
      this.$message.success("退出成功");
      this.$router.push("/login");
    },
    //获取所有的菜单
    async getMenuList() {
      //如果不用await的话axios获取到的函数是一个promise,并且有其他隐患(详情请看上面笔记)
      const {data: result} = await this.$http.get('menus');
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.menulist = result.data;
      console.log(result);
    },
    //点击折叠展开菜单
    toggleCollapse(){
      this.isCollapse= !this.isCollapse;
    }
  },
  created() {
    this.getMenuList();
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%; //这是针对父类高度为0的, 100%是子类达到父类的高度

}

//头部样式
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center; //有待了解
  color: #eeeeee;
}

.el-aside {
  background-color: #333744;

  .el-menu { //处理对不齐情况
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #eeeeee;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>