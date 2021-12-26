<template>
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!--    点击这里会出现 home的目录-->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <div style="margin-top: 15px"></div>
      <!--  这里全部参考vue-table-with-tree-grid的文档  表格-->
      <tree-table :data="catelist" :columns="columns" :selection-type="false"
                  :expand-type="false" show-index index-text="#" border
      >
        <!--      自定义插槽:是否有效-->
        <template slot="isok" slot-scope="scope">
          <!--          {{scope.row.cat_deleted}}-->
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: green"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--      自定义插槽:排序-->
        <!--      这里使用了新版语法 这里的sort是定义的内容,scope是指向的返回值-->
        <template v-slot:sort="scope">
          <!--        {{sort.row}}-->
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!--      操作内容-->
        <template v-slot:option="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCate(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletecate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!--    分页区域-->
      <!--    layout是展示出现什么特殊组件-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!--    添加分类对话框-->
    <el-dialog
        title="修改内容"
        :visible.sync="addDialogClosed"
        width="50%"
        @close="clearAddDialog"
    >
      <!--      内容主体区域-->
      <el-form ref="addCateFormRef" :model="addCateForm" label-width="100px" :rules="addCateFormRules">
        <!--        prop 验证规则,这里是在addFormRules里写-->
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
<!--          :options是指定数据源的
          需要详细看prop数据源 props用来指定配置对象
          v-model肯定就是双向绑定到某个值里面 绑定数组
          change 你选择哪个会直接修改
-->
          <el-cascader
              expand-trigger="hover"
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged" clearable
              change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!--      按钮区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogClosed = false">取 消</el-button>
    <el-button type="primary" @click="addCateInfo">确 定</el-button>
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
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!--      按钮区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="clickEditCate">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询函数,就显示内容
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //总数据条数,这里是由后端传进来的
      total: 0,
      //为table指定列的定义
      columns: [{
        label: '分类名称',
        //:data里绑定值的子元素
        prop: 'cat_name'
      },
        //这里是自定义构件
        {
          //名称
          label: '是否有效',
          //将当前列定义为模板列
          type: 'template',
          //这一列使用模板名称
          template: 'isok'
        },
        {
          //名称
          label: '排序等级',
          //将当前列定义为模板列
          type: 'template',
          //这一列使用模板名称
          template: 'sort'
        },
        {
          //名称
          label: '操作',
          //将当前列定义为模板列
          type: 'template',
          //这一列使用模板名称
          template: 'option'
        },
      ],
      //添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        //分类的等级,默认要添加的是1级分类
        cat_level: 0
      },
      //添加分类表单的校验规则
      addCateFormRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {
            min: 3,
            max: 10,
            message: '分类名的长度在3-10个长度区间',
            trigger: 'blur'
          }
        ],
      },
      //控制显示对话框的显示
      addDialogClosed: false,
      //商品分类的数据列表,由获取到的元素传递进去
      catelist: [],
      //父级分类的列表
      parentCateList: [],
      //指定级联选择器配置对象 这些全是api后端传进来的值
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      //选中的父级分类的id数组
      selectedKeys:[],
      //获取到的表单数据
      editForm:{},
      // 修改表单名字表格的校验规则
      editFormRules:{
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {
            min: 3,
            max: 10,
            message: '分类名的长度在3-10个长度区间',
            trigger: 'blur'
          }
        ],
      },
      //修改显示框
      editDialogVisible:false,
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const {data: result} = await this.$http.get('categories', {
        params:
        this.queryInfo
      });
      if (result.meta.status !== 200) {
        return this.$message.error('获取失败');
      }
      this.catelist = result.data.result
      this.total = result.data.total
    },
    //监听pagesize的页数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    //展示添加内容框
    showAddDialog() {
      //获取父级分类数据
      this.getParentCateList();
      this.addDialogClosed = true;
    },
    //添加新分类
    addCateInfo() {
      console.log(this.addCateForm)
      //肯定要先进行预验证,如果预验证不过就取消
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
            'categories',
            this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addDialogClosed = false
      })
    },
    clearAddDialog() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const {data: result} = await this.$http.get('categories',
          {
            params: {type: 2}
          })
      if (result.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = result.data;
    },
    //选择项发生变化触发的这个函数
    parentCateChanged(){
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[
        this.selectedKeys.length - 1
            ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    //删除分类内容
   async deletecate(id){
      console.log(id)
      //用弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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
        return  this.$message.info('取消删除')
      }
      const {data: result} =await this.$http.delete('categories/' + id);
      if (result.meta.status !== 200) {
        return this.$message.error('删除分类失败!')
      }
      this.$message.success('删除分类成功!')
      this.getCateList()
    },
    //修改分类名称
    async  showEditCate(id){
      //展示编辑用户的对话框
        // console.log(id);//获取到显示内容的id
        const {data: result} = await this.$http.get('categories/' + id);
        if (result.meta.status !== 200) {
          return this.$message.error('查询用户信息失败!')
        }
        this.editForm = result.data;
        this.editDialogVisible = true;
      },
    //清空校验规则
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    //确定修改分类名称
    clickEditCate(){
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) {
          return
        }
        console.log(this.editForm.cat_name)
        //到这里说明预验证通过,发起请求
        const {data: result} = await this.$http.put('categories/' + this.editForm.cat_id, {
          cat_name: this.editForm.cat_name,
        });
        console.log(result)
        if (result.meta.status !== 200) {
          return this.$message.error('更新分类名称失败!')
        }
        this.editDialogVisible = false;
        this.getCateList()
        this.$message.success('更新分类名称成功!')
      })
    }
  },
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>