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
            <el-form-item label="链接名字" prop="name">
                <el-input v-model="temp.name" style="width: 450px; "/>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
                <el-input v-model="temp.remark" style="width: 450px;"/>
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
import { fetchList, fetchLink, createLink, updateLink, removeLink } from '@/api/links'

export default {
    components: { Pagination },
    data(){
        return{
            tableKey: 0,
            listLoading:false,
            list: [],
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                name: undefined,
                remark: undefined,
            },
          
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑链接',
                create: '新建链接'
            },

            temp: {
                id: undefined,
                name: '',
                remark: '',
            },
            rules:{
                name: [{ required: true, message: '请输入链接名称', trigger: 'blur' }],
                remark: [{ required: true, message: '请输入备注', trigger: 'change' }],
            }
    
        }
    },
    created() {
        this.getList()
    },
    methods:{
        getList() {
            this.listLoading = true
            fetchList(this.listQuery).then(response => {
                this.list = response.data.items
                this.total = response.data.total
                this.listLoading = false
            })
        },
        resetTemp() {
            this.temp = {
                id:undefined,
                name: '',
                remark: '',
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
                    createLink(this.temp).then(response => {
                        this.list.unshift(response.data.item)
                        this.dialogFormVisible = false
                        this.$notify({
                        title: 'Success',
                        message: 'Created Successfully',
                        type: 'success',
                        duration: 2000
                        })
                    })
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
                    updateLink(tempData).then(() => {
                        const index = this.list.findIndex(v => v.id === this.temp.id)
                        this.list.splice(index, 1, this.temp)
                        this.dialogFormVisible = false
                        this.$notify({
                        title: 'Success',
                        message: 'Update Successfully',
                        type: 'success',
                        duration: 2000
                        })
                    })

                    //调用更新机构接口
                    console.log(tempData)
                }
            })
        },

        handleDelete(row, index) {
            this.temp = Object.assign({}, row) // copy obj
            removeLink(this.temp).then(() => {
                this.$notify({
                    title: 'Success',
                    message: 'Delete Successfully',
                    type: 'success',
                    duration: 2000
                })
                this.list.splice(index, 1)
            })

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