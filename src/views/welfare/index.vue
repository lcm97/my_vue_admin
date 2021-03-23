<template>
<div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item"  type="primary" icon="el-icon-edit" @click="handleCreate">
        添加福利
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

      <el-table-column align="center" label="福利标题" width="410">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="描述" width="410">
        <template slot-scope="{row}">
          <span>{{ row.describe }}</span>
        </template>
      </el-table-column>

       <el-table-column align="center" label="图片" width="250">
        <template slot-scope="{row}">
          <el-image
            style="width: 150px; height: 110px"
            :src="row.imglist[0]"
            :preview-src-list="row.imglist"
            lazy>
          </el-image>
        </template>
      </el-table-column>  

      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
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
            <el-form-item label="福利标题" prop="title">
                <el-input v-model="temp.title" style="width: 450px; "/>
            </el-form-item>

            <el-form-item label="福利描述" prop="remark">
                <el-input v-model="temp.describe" 
                style="width: 450px;"   
                type="textarea"
                :rows="3"/>
            </el-form-item>  

            <el-form-item label="上传图片" prop="imglist">
                <el-upload
                    ref="upload"
                    class="upload-demo"
                    v-bind:action= "upload_api"
                    :before-remove="beforeRemove"
                    :on-remove="handleRemove"
                    :on-success="handleUploadSuccess"
                    :before-upload="beforeImageUpload"
                    :on-exceed="handleExceed"
                    multiple
                    :limit="3"
                    :file-list="imgUploadList"
                    accept="image/png,image/jpg,image/jpeg"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">请上传小于3张jpg/png/jpeg文件,且小于1M</div>
                </el-upload>
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
//import { fetchList, fetchLink, createLink, updateLink, removeLink } from '@/api/links'
import { fetchList, createWelfare, removeWelfare, updateWelfare } from  '@/api/welfare'
import { deleteFile, } from '@/api/common'
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
            },
          
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑福利',
                create: '新建福利'
            },

            temp: {
                id: undefined,
                title: '',
                describe: '',
                imglist: '',
            },
            rules:{
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                imglist:[{ required: true, message: '请上传图片', trigger: 'change' }],
            },

            upload_api: process.env.VUE_APP_UPLOAD_API,
            imgUploadList:[], 
    
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
                id: undefined,
                title: '',
                describe: '',
                imglist: '',
            }
        },
        handleCreate() {
            this.resetTemp()
            this.imgUploadList = []
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })

        },
        createData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    createWelfare(this.temp).then(response => {
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
            this.temp = {
                id: row.id,
                title: row.title,
                describe: row.describe,
                imglist: row.imglist.toString().replace(',', ' '),
            }
            this.imgUploadList = []
            row.imglist.forEach((v,i)=>{
                let obj = {
                    name: v.split('/').slice(-1)[0],
                    url: v
                }
                this.imgUploadList.push(obj)
            })

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
                    updateWelfare(tempData).then(() => {
                        const index = this.list.findIndex(v => v.id === this.temp.id)
                        let temp_obj = {
                            id: this.temp.id,
                            title: this.temp.title,
                            describe: this.temp.describe,
                            imglist: this.temp.imglist.split(' '),
                        }
                        this.list.splice(index, 1, temp_obj)
                        this.dialogFormVisible = false
                        this.$notify({
                        title: 'Success',
                        message: 'Update Successfully',
                        type: 'success',
                        duration: 2000
                        })
                    })
                }
            })
        },

        handleDelete(row, index) {
            this.temp = Object.assign({}, row) // copy obj
            removeWelfare(this.temp).then(() => {
                this.$notify({
                    title: 'Success',
                    message: 'Delete Successfully',
                    type: 'success',
                    duration: 2000
                })
                this.list.splice(index, 1)
            })

        },

        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleRemove(file, fileList) {
            let filename = file.url===undefined? file.response.data.path.split('/').slice(-1)[0]:file.url.split('/').slice(-1)[0]
            deleteFile(filename).then(response => {
                let templist = ''
                this.temp.imglist.split(' ').forEach(element=>{
                    if(element.split('/').slice(-1)[0]!=filename){
                        templist+=' '+element
                    }
                })
                templist = templist.trim();
                this.temp.imglist = templist
            })
            
        },
        beforeImageUpload(file) {
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isLt1M) {
            this.$message.error('上传图片大小不能超过 1MB!');
            }
            return isLt1M;
        },
        handleUploadSuccess(response, file, fileList) {
            this.temp.imglist+=this.temp.imglist===''?file.response.data.path:' '+file.response.data.path
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },

    }
    
}
</script>

<style scoped>

</style>