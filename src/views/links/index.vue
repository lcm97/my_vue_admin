<template>
<div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item"  type="primary" icon="el-icon-edit" @click="handleCreate">
        添加链接
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      element-loading-text="加载中"
      :data="list"
      border 
      fit
      highlight-current-row
      style="width: 100%; margin-top:15px;"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="链接名称" width="410">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" width="410">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
         <el-button type="primary" size="mini" @click="handleQRcode(row)">
            生成二维码
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column> 

    </el-table>
    
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--弹出表单-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 600px; margin-left:50px;">
            <el-form-item label="机构名字" prop="name">
                <el-input v-model="temp.name" style="width: 400px; "/>
            </el-form-item>

            <el-form-item label="上传封面" prop="imgurl">
                <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleUploadSuccess"
                    :before-upload="beforeImageUpload"
                    :multiple="false"
                    :show-file-list="false"
                    accept="image/png,image/jpg,image/jpeg"
                    >
                    <img v-if="temp.imageurl" :src="temp.imageurl">
                    <el-button v-else size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg文件,且小于2M</div>
                </el-upload>

            </el-form-item>

            <el-form-item label="机构地址" prop="address">
                <el-input v-model="temp.address" style="width: 450px;"/>
            </el-form-item>

            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="temp.phone" style="width: 300px;"/>
            </el-form-item>           


      </el-form>
            
      <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>


</div>
    
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
    components: { Pagination },
    data(){
        return{
            tableKey: 0,
            listLoading:false,
            list: [{
                id: 123,
                name: '杨之光两大校区开学季回馈新老学员',
                remark: '深圳地区'
            }, {
                id: 124,
                name: '杨之光两大校区开学季回馈新老学员',
                remark: '深圳地区'
            }, {
                id: 125,
                name: '杨之光两大校区开学季回馈新老学员',
                remark: '深圳地区'
            }, {
                id: 126,
                name: '杨之光两大校区开学季回馈新老学员',
                remark: '深圳地区'
            }],

            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: '+id'
            },
          
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑机构',
                create: '新建机构'
            },

            temp: {
                name: '',
                imgurl: '',
                address: '',
                phone: '',
            },
            rules:{
                name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
                imgurl: [{ required: true, message: '请上传封面', trigger: 'blur' }],
                address: [{ required: true, message: '请输入机构地址', trigger: 'change' }],
                phone: [{ required: true, message: '请输入联系方式', trigger: 'change' }]
            }
        

        }
    },
    created() {
        this.getList()
    },
    methods:{
        getList() {
            this.listLoading = true
            //后台根据下面两个参数查找数据
            console.log(this.listQuery.page)
            console.log(this.listQuery.limit)
            this.list = this.list
            this.total = this.list.length
            setTimeout(() => {
                this.listLoading = false
            }, 1.5 * 1000)           
            // fetchList(this.listQuery).then(response => {
            //     this.list = response.data.items
            //     this.total = response.data.total

            //     // Just to simulate the time of the request
            //     setTimeout(() => {
            //     this.listLoading = false
            //     }, 1.5 * 1000)
            // })

        },
        resetTemp() {
            this.temp = {
                name: '',
                imgurl: '',
                address: '',
                phone:''
            }
        },
        handleCreate() {
                this.resetTemp()
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
            })

        },
        createData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    //调用创建机构接口
                    console.log(this.temp)
                }
            })
        },

        handleUpdate(row) {
            this.temp = Object.assign({}, row) // copy obj
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        updateData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const tempData = Object.assign({}, this.temp)
                    //调用更新机构接口
                    console.log(tempData)
                }
            })
        },
        handleDelete(row, index) {
            console.log(row.name)
            this.$notify({
                title: 'Success',
                message: 'Delete Successfully',
                type: 'success',
                duration: 2000
            })
            this.list.splice(index, 1)
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleUploadSuccess(res, file) {
            console.log(URL.createObjectURL(file.raw))
            this.temp.imgurl = URL.createObjectURL(file.raw);
        },
        beforeImageUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        }

    }
    
}
</script>

<style scoped>

</style>