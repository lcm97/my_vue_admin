<template>
<div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-right:30px;"  type="primary" icon="el-icon-edit" @click="handleCreate">
        添加机构
      </el-button>
      <el-input v-model="listQuery.name" placeholder="机构名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.linkname" placeholder="所属链接" clearable class="filter-item" style="width: 280px">
        <el-option v-for="item in Links" :key="item.id" :label="item.name" :value="item.id" />
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

      <el-table-column align="center" label="机构名字" width="210">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属链接" width="210">
        <template slot-scope="{row}">
          <span>{{ row.link_name }}</span>
        </template>
      </el-table-column>

       <el-table-column align="center" label="机构封面" width="250">
        <template slot-scope="{row}">
          <el-image
            style="width: 150px; height: 110px"
            :src="row.imglist[0]"
            :preview-src-list="row.imglist"
            lazy>
          </el-image>
        </template>
      </el-table-column>   

       <el-table-column align="center" label="联系人二维码" width="250">
        <template slot-scope="{row}">
          <el-image
            style="width: 150px; height: 110px"
            :src="row.contacts[0]"
            :preview-src-list="row.contacts"
            lazy>
          </el-image>
        </template>
      </el-table-column>  

      <el-table-column align="center" label="描述" width="310">
        <template slot-scope="{row}">
          <span>{{ row.describe }}</span>
        </template>
      </el-table-column> 

      <el-table-column align="center" label="地址" width="310">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系电话" width="150">
        <template slot-scope="{row}">
          <i class="el-icon-phone-outline"></i>
          <span style="margin-left: 10px">{{ row.phone }}</span>
        </template>
      </el-table-column>    

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
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
            <el-form-item label="机构名字" prop="name">
                <el-input v-model="temp.name" style="width: 400px; "/>
            </el-form-item>

            <el-form-item label="选择所属链接" prop="link_id">
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


            <el-form-item label="上传封面" prop="imglist">
                <el-upload
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

            <el-form-item label="上传二维码" prop="contacts">
                <el-upload
                    class="upload-demo"
                    v-bind:action= "upload_api"
                    :before-remove="beforeRemove"
                    :on-remove="handleRemoveContact"
                    :on-success="handleContactSuccess"
                    :before-upload="beforeImageUpload"
                    :on-exceed="handleExceed"
                    multiple
                    :limit="3"
                    :file-list="contactUpList"
                    accept="image/png,image/jpg,image/jpeg"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">请上传小于3张jpg/png/jpeg文件,且小于1M</div>
                </el-upload>
            </el-form-item>
          
            <el-form-item label="机构地址" prop="address">
                <el-input v-model="temp.address" style="width: 400px;"/>
            </el-form-item>

            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="temp.phone" style="width: 200px;"/>
            </el-form-item>           

            <el-form-item label="机构描述" prop="describe">
                <el-input
                  type="textarea"
                  autosize
                  placeholder="请输入内容,最长不超过300字符"
                  style="width: 400px;"
                  v-model="temp.describe">
                </el-input>
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
import { fetchList, createCompany, updateCompany, removeCompany } from '@/api/company'
import { deleteFile, fetchLinkList,} from '@/api/common'
export default {
    components: { Pagination },
    data(){
        return{
            tableKey: 0,
            listLoading:false,
            list: [],

            Links:[], //链接链表
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,

                name:undefined
            },
          
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑机构',
                create: '新建机构'
            },

            temp: {
                name: '',
                link_id:undefined,
                link_name:'',
                imglist: '',
                contacts: '',
                address: '',
                phone: '',
                describe: ''
            },
            rules:{
                name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
                link_id: [{ required: true, message: '请选择链接', trigger: 'blur' }],
                imglist: [{ required: true, message: '请上传封面', trigger: 'blur' }],
                contacts: [{ required: true, message: '请上传联系人二维码', trigger: 'blur' }],
                address: [{ required: true, message: '请输入机构地址', trigger: 'change' }],
                phone: [{ required: true, message: '请输入联系方式', trigger: 'change' }],
                describe:[{ max: 300, message: '长度在300个字符以内', trigger: 'blur' }]
            },
            upload_api: process.env.VUE_APP_UPLOAD_API,
            imgUploadList:[],  //上传的封面图片列表
            contactUpList:[]   //上传的二维码图片列表

        }
    },
    created() {
        this.getList()
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

        handleFilter() {
          this.listQuery.page = 1
          this.getList()
        },
        resetTemp() {
            this.temp = {
                name: '',
                link_id:undefined,
                link_name:'',
                imglist: '',
                contacts: '',
                address: '',
                phone: '',
                describe: ''
            }
        },
        handleCreate() {
                this.resetTemp()
                this.imgUploadList = []
                this.contactUpList = []
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
            })
        },
        createData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    createCompany(this.temp).then(response => {
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
              name: row.name,
              link_id: row.link_id,
              link_name: row.link_name,
              imglist: row.imglist.toString().replace(',', ' '),
              contacts: row.contacts.toString().replace(',', ' '),
              address: row.address,
              phone: row.phone,
              describe: row.describe
            }
            this.imgUploadList = []
            row.imglist.forEach((v,i)=>{
                let obj = {
                    name: v.split('/').slice(-1)[0],
                    url: v
                }
                this.imgUploadList.push(obj)
            })

            this.contactUpList = []
            row.contacts.forEach((v, i) => {
              let obj = {
                 name: v.split('/').slice(-1)[0],
                 url: v
              }
              this.contactUpList.push(obj);
            });
            
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
                    updateCompany(tempData).then(() => {
                        const index = this.list.findIndex(v => v.id === this.temp.id)
                        let temp_obj = {
                            id: this.temp.id,
                            name: this.temp.name,
                            link_id: this.temp.link_id,
                            link_name: this.temp.link_name,
                            imglist: this.temp.imglist.split(' '),
                            contacts: this.temp.contacts.split(' '),
                            address: this.temp.address,
                            phone: this.temp.phone,
                            describe: this.temp.describe
                        }
                        this.list.splice(index, 1, temp_obj )
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
              this.temp = {
                id: row.id,
                name: row.name,
                link_id: row.link_id,
                link_name: row.link_name,
                imglist: row.imglist.toString().replace(',', ' '),
                contacts: row.contacts.toString().replace(',', ' '),
                address: row.address,
                phone: row.phone
              }
              removeCompany(this.temp).then(() => {
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
            //console.log(link_id)
            let obj = {}
            obj = this.Links.find((item)=>{
              return item.id === link_id
            })
            this.temp.link_name = obj.name
        },
        //上传图片相关
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
        handleRemoveContact(file, fileList) {
            let filename = file.url===undefined? file.response.data.path.split('/').slice(-1)[0]:file.url.split('/').slice(-1)[0]
            deleteFile(filename).then(response => {
                let templist = ''
                this.temp.contacts.split(' ').forEach(element => {
                    if(element.split('/').slice(-1)[0]!=filename){
                        templist+=' '+element
                    }
                })
                templist = templist.trim();
                this.temp.contacts = templist       
            })
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleUploadSuccess(response, file, fileList) {
            this.temp.imglist+=this.temp.imglist===''?file.response.data.path:' '+file.response.data.path
        },
        handleContactSuccess(response, file, fileList) {
            this.temp.contacts+=this.temp.contacts===''?file.response.data.path:' '+file.response.data.path
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