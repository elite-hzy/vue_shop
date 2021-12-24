<template>
<div>
  <!--  面包屑导航区-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <!--    点击这里会出现 home的目录-->
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>

<!--  卡片视图-->
  <el-card>
    <el-table :data="rightsList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
<!--      本来这里只会显示0,1,2来进行修改优化下-->
<!--      <el-table-column label="权限等级" prop="level"></el-table-column>-->
      <el-table-column label="权限等级" prop="level">
<!--        使用自定义插槽-->
        <template slot-scope="scope"><!--scope这里是获取到所有元素了  -->
          <el-tag v-if="scope.row.level==='0'">等级一</el-tag>
          <el-tag type="warning" v-else-if="scope.row.level==='1'">等级二</el-tag>
          <el-tag type="danger" v-else>等级三</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
export default {
  data(){
    return{
      //权限列表
      rightsList:[]
    }
  },
  methods:{
    //获取权限列表
    async getRightList(){
      const {data:result} = await this.$http.get('rights/list');
      if(result.meta.status!==200){
        return this.$message.error('获取权限列表失败!')
      }
      this.rightsList=result.data;
      // console.log(this.rightsList);//有超过48个array
    }
  },
  created(){
    //获取所有权限
    this.getRightList()
  },
}
</script>

<style lang="less" scoped>

</style>