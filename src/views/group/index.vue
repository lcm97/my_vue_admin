<template>
<div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.cap_name" placeholder="输入团长名字" style="width: 200px;" class="filter-item"/>
      <el-input v-model="listQuery.id" placeholder="输入团id" style="width: 200px;" class="filter-item"/>
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

       <el-table-column align="center" label="规模类型" width="180">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>     

       <el-table-column align="center" label="参团人数" width="180">
        <template slot-scope="{row}">
          <span>{{ row.num }}</span>
        </template>
      </el-table-column>     


       <el-table-column align="center" label="开团时间" width="180"> 
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>     

      <el-table-column align="center" label="团长" width="180">
        <template slot-scope="{row}">
          <span>{{ row.cap_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属链接" width="180">
        <template slot-scope="{row}">
          <span>{{ row.link_id }}</span>
        </template>
      </el-table-column>


      <el-table-column label="参团人员" align="center" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row}" >
            <div>
                <div v-if="row.num>1" class="crew">
                    <div  v-for="(item,index) in row.crewlist" :key="index" style="margin-bottom:2px" class="crewitem">
                        <span style="margin-right:8px;width:60px;text-align: center;">{{item}}</span>
                    </div>
                </div>
                <div v-else style="color:#D1CECE;">暂时没有团队成员</div>
            </div>
        </template>
      </el-table-column> 

      <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column> 

    </el-table>
    
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

</div>
    
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {fetchList, removeGroup} from '@/api/group'
export default {
    components: { Pagination },
    data(){
        return{
            tableKey: 0,
            listLoading:false,
            downloadLoading: false,
            list: [],

            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                cap_name: undefined, //搜索团长名字
                id: undefined
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
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        resetTemp() {
            this.temp = {
                name: '',
                imgurl: '',
                address: '',
                phone:''
            }
        },
        handleDelete(row, index) {
            this.$confirm(`确定删除 ${ row.cap_name } 所开的团？`, `提示`, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.temp = Object.assign({}, row) 
              removeGroup(this.temp).then(() => {
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
        },
        handleDownload() {
            this.downloadLoading = true
            console.log("exporting")
            setTimeout(() => {
                this.downloadLoading = false
            }, 1.5 * 1000)  
        },

    }
    
}
</script>

<style scoped>
.crew{
    display: flex; 
    flex-direction: row; 
    justify-content:center; 
    flex-wrap: wrap;
    align-items: center;
    width: 350px;
}
.crewitem{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

</style>