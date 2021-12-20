<template>
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!--    点击这里会出现 home的目录-->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图区-->
    <el-card class="box-card">
      <!--    搜索和添加框-->
        <el-row :gutter="20">
          <!--        element-ui这里默认定义了24个格子,用span可以来分割
                      额外属性是 el-row里的 :gutter="20" 就设定间距
          -->
          <el-col :span="7">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>
<!--      用户列表区域-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
<!--          <template slot-scope="scope">&lt;!&ndash;获取当前一行的数据   原本内容prop="mg_state"&ndash;&gt;-->
<!--            {{scope.row}}-->
<!--          </template>-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',//查询参数
        pagenum: 1,//当前页码
        pagesize: 2,//每页显示的条数
      },
      userlist:[],
      total:0//总数据条数
    }
  },
  methods: {
    async getUserList() {
      const {data: result} = await this.$http.get('users', {params: this.queryInfo});
      if (result.meta.status!==200){
        return this.$message.error('获取用户列表失败')
      }
      this.userlist=result.data.users;
      this.total=result.data.total;
      console.log(result);
    }
  },
  created() {
    this.getUserList();
  }
}
</script>

<style lang="less" scoped>

</style>