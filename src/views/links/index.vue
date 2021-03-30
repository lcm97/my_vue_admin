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

      <el-table-column align="center" label="备注" width="210">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="音乐" width="410">
        <template slot-scope="{row}">
          <audio controls :src="row.music" lazy>
            您的浏览器不支持 audio 元素。
        </audio>
        </template>
      </el-table-column>

       <el-table-column align="center" label="联系人二维码" width="250">
        <template slot-scope="{row}">
          <el-image
            style="width: 150px; height: 110px"
            :src="row.contact"
            :preview-src-list="[row.contact]"
            lazy>
          </el-image>
        </template>
      </el-table-column>  

       <el-table-column align="center" label="海报" width="250">
        <template slot-scope="{row}">
          <el-image
            style="width: 150px; height: 110px"
            :src="row.poster"
            :preview-src-list="[row.poster]"
            lazy>
          </el-image>
        </template>
      </el-table-column>  

      <el-table-column align="center" label="截止时间" width="210">
        <template slot-scope="{row}">
          <span>{{ row.deadline }}</span>
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
            <el-form-item label="上传音乐" prop="music">
                <el-upload
                    class="upload-demo"
                    v-bind:action= "upload_api"
                    accept="audio/*"
                    :before-remove="beforeRemove"
                    :on-remove="handleRemove"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :on-success="handleUploadSuccess"
                    :before-upload="handleBeforeUpload"
                    :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传mp3/wav文件</div>
                </el-upload>
            </el-form-item>     

            <el-form-item label="上传海报" prop="poster">
                <el-upload
                    class="upload-demo"
                    v-bind:action= "upload_api"
                    :before-remove="beforeRemove"
                    :on-remove="handleRemove2"
                    :on-success="handleUploadSuccess2"
                    :before-upload="beforeImageUpload"
                    :on-exceed="handleExceed"
                    multiple
                    :limit="1"
                    :file-list="posterList"
                    accept="image/png,image/jpg,image/jpeg"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传1张jpg/png/jpeg文件,且小于1M</div>
                </el-upload>
            </el-form-item>

            <el-form-item label="联系人二维码" prop="contact">
                <el-upload
                    class="upload-demo"
                    v-bind:action= "upload_api"
                    :before-remove="beforeRemove"
                    :on-remove="handleRemove3"
                    :on-success="handleUploadSuccess3"
                    :before-upload="beforeImageUpload"
                    :on-exceed="handleExceed"
                    multiple
                    :limit="1"
                    :file-list="contactList"
                    accept="image/png,image/jpg,image/jpeg"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传1张jpg/png/jpeg文件,且小于1M</div>
                </el-upload>
            </el-form-item>

            <el-form-item label="活动截止时间" prop="deadline">
                <div class="block">
                    <el-date-picker
                    v-model="temp.deadline"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </div>
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
import { deleteFile} from '@/api/common'
import {Loading} from 'element-ui'

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
                music: '',
                contact: '',
                poster: '',
                deadline: '',
            },
            rules:{
                name: [{ required: true, message: '请输入链接名称', trigger: 'blur' }],
                remark: [{ required: true, message: '请输入备注', trigger: 'change' }],
                music:[{ required: true, message: '请上传音乐', trigger: 'change' }],
                contact:[{ required: true, message: '请上传联系人二维码', trigger: 'change' }],
                deadline:[{ required: true, message: '请选择截止时间', trigger: 'change' }],
            },

            upload_api: process.env.VUE_APP_UPLOAD_API,
            fileList:[],
            posterList:[],
            contactList:[],
            fullscreenLoading:undefined
    
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
                music: '',
                contact: '',
                poster: '',
                deadline: '',
            }
        },
        handleCreate() {
            this.resetTemp()
            this.fileList = []
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
            this.fileList = [{
                name:row.music.split('/').slice(-1)[0],
                url:row.music
            }]
            if(row.poster==''){
                this.posterList = []
            }else{
                this.posterList = [{
                    name:row.poster.split('/').slice(-1)[0],
                    url:row.poster
                }]
            }
            this.contactList = [{
                name:row.contact.split('/').slice(-1)[0],
                url:row.contact
            }]            
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
                }
            })
        },

        handleDelete(row, index) {
            this.$confirm(`确定删除 ${ row.name }？`, `提示`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
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
            }).catch(() => {

            });
        },

        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleRemove(file, fileList,) {
            let filename = file.url===undefined? file.response.data.path.split('/').slice(-1)[0]:file.url.split('/').slice(-1)[0]
            deleteFile(filename).then(response => {
                this.temp.music  = ''
            })
            
        },
        handleRemove2(file, fileList) {
            let filename = file.url===undefined? file.response.data.path.split('/').slice(-1)[0]:file.url.split('/').slice(-1)[0]
            deleteFile(filename).then(response => {
                this.temp.poster = ''     
            })
        },
        handleRemove3(file, fileList) {
            let filename = file.url===undefined? file.response.data.path.split('/').slice(-1)[0]:file.url.split('/').slice(-1)[0]
            deleteFile(filename).then(response => {
                this.temp.contact = ''     
            })
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleBeforeUpload(){
            this.fullscreenLoading = Loading.service({
                lock: true,
                text: '文件上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
        },
        beforeImageUpload(file) {
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isLt1M) {
            this.$message.error('上传图片大小不能超过 1MB!');
            }
            this.fullscreenLoading = Loading.service({
                lock: true,
                text: '文件上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })

            return isLt1M;
        },   
        handleUploadSuccess(response, file, fileList) {
            this.temp.music = file.response.data.path
            this.fullscreenLoading.close();
        },
        handleUploadSuccess2(response, file, fileList) {
            this.temp.poster = file.response.data.path
            this.fullscreenLoading.close();
        },
        handleUploadSuccess3(response, file, fileList) {
            this.temp.contact = file.response.data.path
            this.fullscreenLoading.close();

        },
        handleQRcode(row){
            console.log(row)

        },


    }
    
}
</script>

<style scoped>

</style>