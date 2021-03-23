<template>
<div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item"  type="primary" icon="el-icon-edit" @click="handleCreate">
        添加课程
      </el-button>
      <el-button  :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出总表
      </el-button>
      <el-input v-model="listQuery.name" placeholder="课程名称" style="width: 200px;margin-left:20px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.company" placeholder="所属机构" clearable class="filter-item" style="width: 280px">
        <el-option v-for="item in CompanyList" :key="item.id" :label="item.name" :value="item.name" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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

      <el-table-column align="center" label="课程名称(描述)" width="210">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

       <el-table-column align="center" label="所属机构" width="210">
        <template slot-scope="{row}">
          <span>{{ row.company }}</span>
        </template>
      </el-table-column>     

       <el-table-column align="center" label="课程图片" width="250">
        <template slot-scope="{row}">
          <el-image
            style="width: 150px; height: 110px"
            :src="row.img"
            :preview-src-list="[row.img]"
            lazy>
          </el-image>
        </template>
      </el-table-column>  

       <el-table-column align="center" label="原价" width="110"> 
        <template slot-scope="{row}">
          <span>{{ row.ori_price }}</span>
        </template>
      </el-table-column>    

       <el-table-column align="center" label="价格" width="110"> 
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>     

       <el-table-column align="center" label="课时" width="130"> 
        <template slot-scope="{row}">
          <span>{{ row.class }}</span>
        </template>
      </el-table-column>     

      <el-table-column align="center" label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="参团人数" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
            <span style="margin-left:15px">人数:{{ row.all }}</span>
            <span style="margin-left:15px">新生:{{ row.new }}</span>
            <span style="margin-left:15px">老生:{{ row.old }}</span>
            <span style="margin-left:15px">已付费:{{ row.payed }}</span>
            <span style="margin-left:15px">未付费:{{ row.unpayed }}</span>
        </template>
      </el-table-column> 

      <el-table-column label="操作" align="center" width="380" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="info" size="mini" @click="handleRefresh(row,$index)">
            刷新
          </el-button>
          <el-button v-if="row.status!='下架'" type="warning" size="mini" @click="handleDraft(row,$index)">
            下架
          </el-button>
          <el-button v-if="row.status!='进行中'" type="success" size="mini" @click="handlePublish(row,$index)">
            发布
          </el-button>          
          <el-button type="primary" size="mini" @click="handleExport(row,$index)">
            导出
          </el-button>
          <el-button v-if="row.status!='删除'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column> 

    </el-table>
    
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--弹出表单-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 600px; margin-left:50px;">
            <el-form-item label="课程名字" prop="name">
                <el-input v-model="temp.name" style="width: 400px; "/>
            </el-form-item>

            <el-form-item label="选择所属链接" prop="link">
              <el-select v-model="temp.link_id" filterable placeholder="请选择" style="width: 400px; " @change="selectChange">
                <el-option
                  v-for="item in Links"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  style="width: 480px; ">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="选择所属机构" prop="company">
              <el-select v-model="temp.company" filterable placeholder="请选择" style="width: 400px; " >
                <el-option
                  v-for="item in CompanyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                  style="width: 480px; ">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="上传封面" prop="img">
                <el-upload
                    class="upload-demo"
                    v-bind:action= "upload_api"
                    :before-remove="beforeRemove"
                    :on-remove="handleRemove"
                    :on-success="handleUploadSuccess"
                    :before-upload="beforeImageUpload"
                    :on-exceed="handleExceed"
                    multiple
                    :limit="1"
                    :file-list="imgList"
                    accept="image/png,image/jpg,image/jpeg"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传1张jpg/png/jpeg文件,且小于1M</div>
                </el-upload>
            </el-form-item>

            <el-form-item label="原价" prop="ori_price">
                <el-input v-model.number="temp.ori_price" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="现价" prop="price">
                <el-input v-model.number="temp.price" style="width: 200px;"/>
            </el-form-item>

            <el-form-item label="课时" prop="class">
                <el-input v-model="temp.class" style="width: 200px;"/>
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
import { fetchList, fetchCompanyList, createCourse, updateCourse, removeCourse, refreshCourse, draftCourse, publishCourse } from '@/api/course'
import { deleteFile, fetchLinkList } from '@/api/common'
export default {
    components: { Pagination },
    filters: {
        statusFilter(status) {
            const statusMap = {
                进行中: 'success', //进行中
                下架: 'info',   //下架
                删除: 'danger'  //删除
            }
            return statusMap[status]
        },
        typeFilter(type) {
            return calendarTypeKeyValue[type]
        }
    },
    data(){
        return{
            tableKey: 0,
            listLoading:false,
            downloadLoading: false,
            list: [],

            Links:[], //链接链表
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,

                name: undefined,
                company: undefined
            },
          
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑课程',
                create: '新建课程'
            },

            temp: {
                name: '',
                link_id: undefined,
                company: '',
                img: '',
                ori_price: 0,
                price: undefined,
                class: '',
                status:'进行中',
                all: 0,
                new: 0,
                old: 0,
                payed: 0,
                unpayed: 0              
            },
            rules:{
                name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
                img: [{ required: true, message: '请上传封面', trigger: 'blur' }],
                ori_price: [{ type: 'number', message: '价格必须为数字值'}],
                price:[{ required: true, message: '请输入价格', trigger: 'blur' },
                       { type: 'number', message: '价格必须为数字值'}],
                link:[{ required: true, message: '请选择链接', trigger: 'blur' }],
                company:[{ required: true, message: '请选择机构', trigger: 'blur' }],
                class:[{ required: true, message: '请输入课时', trigger: 'blur' }],
            },
            upload_api: process.env.VUE_APP_UPLOAD_API,
            CompanyList: [],
            imgList: []
        

        }
    },
    created() {
        this.getList()
        this.getCompanyList()
        this.getLinksList()
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
        getLinksList(){
            fetchLinkList().then(response => {
                this.Links = response.data.items
            })
        },
        getCompanyList(){
            fetchCompanyList().then(response => {
                this.CompanyList = response.data.items
            })
        },
        handleFilter() {
          this.listQuery.page = 1
          this.getList()
        },
        resetTemp() {
            this.temp = {
                name: '',
                link_id: undefined,
                company: '',
                img: '',
                ori_price: 0,
                price: undefined,
                class: '',
                status:'进行中',
                all: 0,
                new: 0,
                old: 0,
                payed: 0,
                unpayed: 0  
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
                    createCourse(this.temp).then(response => {
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
        //ToDo
        handleUpdate(row) {
            this.temp = Object.assign({}, row) // copy obj
            this.imgList = []
            this.imgList = [{
                name:row.img.split('/').slice(-1)[0],
                url:row.img
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
                    updateCourse(tempData).then(() => {
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
              this.temp = Object.assign({}, row) 
              removeCourse(this.temp).then(() => {
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
        selectChange(link_id){
            fetchCompanyList(link_id).then(response => {
                this.CompanyList = response.data.items
            })
        },
        //导出总表
        handleDownload(){

        },
        handleRefresh(row, index){
            refreshCourse(row.id).then(response => {
              this.list.splice(index, 1, response.data)
            })
        },
        //下架
        handleDraft(row,index){
            this.$confirm(`确定下架 ${ row.name }？`, `提示`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                draftCourse(row.id).then(() =>{
                  let temp_obj = row
                  temp_obj.status = '下架'
                  this.list.splice(index, 1, temp_obj)
                })
            });
        },
        //发布
        handlePublish(row,index){
            this.$confirm(`确定发布 ${ row.name }？`, `提示`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
              publishCourse(row.id).then(() =>{
                let temp_obj = row
                temp_obj.status = '进行中'
                this.list.splice(index, 1, temp_obj)
              })
            });
        },
        //导出单表
        handleExport(row,index){
            console.log(index)
        },



        //上传图片相关
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleRemove(file, fileList) {
            let filename = file.url===undefined? file.response.data.path.split('/').slice(-1)[0]:file.url.split('/').slice(-1)[0]
            deleteFile(filename).then(response => {
                this.temp.img = ''     
            })
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleUploadSuccess(response, file, fileList) {
            this.temp.img = file.response.data.path
        },
        beforeImageUpload(file) {
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isLt1M) {
            this.$message.error('上传图片大小不能超过 1MB!');
            }
            return isLt1M;
        },       

    }
    
}
</script>

<style scoped>

</style>