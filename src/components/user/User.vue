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
                    额外属性是 el-row里的 :gutter="20" 就设定间距-->
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
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
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!--
                        el-tooltip文字提示  effect 是显示颜色
                                          content 显示出来的文字,placement 显示的图标位置,enterable鼠标是否可以进入到tooltip中
            -->
            <!--            修改按钮-->
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"
                         size="mini"></el-button>
            </el-tooltip>

            <!--            删除按钮-->
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>

            <!--            分配角色按钮-->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <!--    分页区域-->
      <!--    layout是展示出现什么特殊组件-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

    </el-card>

    <!--    添加用户的对话框
        visible.sync控制显示与否,为布尔值
    -->
    <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClosed"
    >
      <!--      内容主体区域-->
      <el-form ref="addFromRef" :model="addForm" label-width="70px" :rules="addFormRules">
        <!--        prop 验证规则,这里是在addFormRules里写-->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--      按钮区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>

    <!--    修改内容的对话框-->
    <el-dialog
        title="修改内容"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="clearEditDialog"
    >
      <!--      内容主体区域-->
      <el-form ref="editFormRef" :model="editForm" label-width="70px" :rules="editFormRules">
        <!--        prop 验证规则,这里是在addFormRules里写-->
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--      按钮区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则 rule=验证规则 value=需要验证的值 callback回调函数 如果验证失败就回调一个Error
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }

      callback(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',//查询参数
        pagenum: 1,//当前页码
        pagesize: 2,//每页显示的条数
      },
      userlist: [],
      total: 0,//总数据条数
      //控制添加用户的对话框显示与隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //查询到的用户数据
      editForm: {},
      //控制修改用户的对话框显示与隐藏
      editDialogVisible: false,
      //添加用户验证对象
      addFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}, {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10个长度区间',
            trigger: 'blur'
          }
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}, {
            min: 6,
            max: 15,
            message: '密码在6-15位',
            trigger: 'blur'
          }
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}, {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'}, {validator: checkMobile, trigger: 'blur'}
        ]
      },
      //编辑用户验证对象
      editFormRules:{
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}, {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'}, {validator: checkMobile, trigger: 'blur'}
        ]
      },
    }
  },
  methods: {
    async getUserList() {
      const {data: result} = await this.$http.get('users', {params: this.queryInfo});
      if (result.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = result.data.users;
      this.total = result.data.total;
      //console.log(result);//获取管理员列表成功
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听Switch状态栏的改变
    async userStateChanged(userInfo) {
      //console.log(userInfo);//就会把修改完的内容赋值打印出来,可观察mg_state
      const {data: result} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      if (result.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功")
    },
    //清空添加框的内容
    addDialogClosed() {
      //找到被监听的对象
      this.$refs.addFromRef.resetFields();
    },
    //新增用户
    addUser() {
      this.$refs.addFromRef.validate(async valid => {
        //返回校验结果
        // console.log(valid);
        if (!valid) {
          return;
        }
        //为true就发axios
        const {data: result} = await this.$http.post('users', this.addForm);
        if (result.meta.status !== 201) {
          this.$message.error('添加用户失败!');
        }
        this.$message.success('添加用户成功!');
        this.addDialogVisible = false;
        this.getUserList();
      })
    },
    //展示编辑用户的对话框
    async showEditDialog(id) {
      // console.log(id);//获取到显示内容的id
      const {data: result} = await this.$http.get('users/' + id);
      if (result.meta.status !== 200) {
        return this.$message.error('查询用户信息失败!')
      }
      this.editForm = result.data;
      this.editDialogVisible = true;
    },
    clearEditDialog(){
      this.$refs.editFormRef.resetFields();
    },
  },
  created() {
    this.getUserList();
  }
}
</script>

<style lang="less" scoped>

</style>