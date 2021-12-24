<template>
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!--    点击这里会出现 home的目录-->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--    角色列表-->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <!--      <el-table-column label="操作" v-slot="scope">-->
        <!--          {{scope.row}}-->
        <!--      </el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除
            </el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--    添加用户的对话框
      visible.sync控制显示与否,为布尔值
  -->
    <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
    >
      <!--      内容主体区域-->
      <el-form ref="addFromRef" :model="addForm" label-width="200px" :rules="addFormRules">
        <!--        prop 验证规则,这里是在addFormRules里写-->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--      按钮区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRolesUser">确 定</el-button>
    </span>
    </el-dialog>

    <!--    修改内容的对话框-->
    <el-dialog
        title="修改内容"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
    >
      <!--      内容主体区域-->
      <el-form ref="editFormRef" :model="editForm" label-width="60px" :rules="editFormRules">
        <!--        prop 验证规则,这里是在addFormRules里写-->
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--      按钮区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolelist: [],
      //控制是否添加角色界面
      addDialogVisible: false,
      //控制是否编辑角色界面
      editDialogVisible:false,
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      editForm:{
      },

      //添加用户验证对象
      addFormRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}, {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10个长度区间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'}, {
            min: 0,
            max: 15,
            message: '描述在0-15位',
            trigger: 'blur'
          },
        ],
      },
      editFormRules:{
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'}, {
            min: 0,
            max: 15,
            message: '描述在0-15位',
            trigger: 'blur'
          },
        ],
      },
    }
  },
  methods: {
    //获取所有的
    async getRolesList() {
      const {data: result} = await this.$http.get('roles');
      if (result.meta.status !== 200) {
        return this.$message.error('传输失败');
      }
      this.rolelist = result.data;
      // console.log(this.rolelist);//6个内容
    },
    //添加界面的关闭
    addDialogClosed() {
      this.$refs.addFromRef.resetFields();
    },
    //修改界面的关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //添加用户
    addRolesUser() {
      //先预校验
      this.$refs.addFromRef.validate(async valid => {
        //返回校验结果
        // console.log(valid);
        if (!valid) {
          return;
        }
        //为true就发axios
        const {data: result} = await this.$http.post('roles', this.addForm);
        if (result.meta.status !== 201) {
          this.$message.error('添加用户失败!');
        }
        this.$message.success('添加用户成功!');
        this.addDialogVisible = false;
        this.getRolesList();
      })
    },
    //id删除用户
    async removeUserById(id) {
      //用弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      // 原始写法,上层是简写 .catch(err=>{
      //   return err
      // })
      //正常如果你点取消会报错,所以需要用catch来接受错误信息
      //确认删除返回的是confirm 取消是cancel
      // console.log(confirmResult);
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const {data: result} = await this.$http.delete('roles/' + id);
      if (result.meta.status !== 200) {
        return this.$message.error('删除用户失败!')
      }
      this.$message.success('删除用户成功!')
      this.getRolesList()
    },
    //展示编辑用户的对话框
    async showEditDialog(id) {
      // console.log(id);//获取到显示内容的id
      const {data: result} = await this.$http.get('roles/' + id);
      console.log(result);
      if (result.meta.status !== 200) {
        return this.$message.error('查询用户信息失败!')
      }
      this.editForm = result.data;
      this.editDialogVisible = true;
    },
    //修改用户信息并提交
    editUserInfo(){
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) {
          return
        }
        //到这里说明预验证通过,发起请求
        const {data: result} = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        });
        console.log(result)
        if (result.meta.status !== 200) {
          return this.$message.error('更新用户信息失败!')
        }
        this.editDialogVisible = false;
        this.getRolesList()
        this.$message.success('更新用户信息成功!')
      })
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style scoped>

</style>