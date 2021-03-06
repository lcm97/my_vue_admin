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

      <el-table-column align="center" label="地址" width="410">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系电话" width="310">
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



            <el-form-item label="上传封面" prop="imglist">
                <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleUploadSuccess"
                    :before-upload="beforeImageUpload"
                    multiple
                    :limit="3"
                    :file-list="fileList"
                    accept="image/png,image/jpg,image/jpeg"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg文件,且小于1M</div>
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
import { fetchList, fetchLinkList, createLink, updateLink, removeLink } from '@/api/company'
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
                imglist: [],
                address: '',
                phone: '',
            },
            rules:{
                name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
                imglist: [{ required: true, message: '请上传封面', trigger: 'blur' }],
                address: [{ required: true, message: '请输入机构地址', trigger: 'change' }],
                phone: [{ required: true, message: '请输入联系方式', trigger: 'change' }]
            },

            fileList:[]  //上传的图片列表
        

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
                imglist: [],
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
            //this.temp.imgurl = URL.createObjectURL(file.raw);
        },
        beforeImageUpload(file) {
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isLt1M) {
            this.$message.error('上传图片大小不能超过 1MB!');
            }
            return isLt1M;
        }

    }
    
}
</script>

<style scoped>

</style>