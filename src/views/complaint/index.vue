<template>
<div class="app-container">
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

       <el-table-column align="center" label="描述内容" width="400">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>     

       <el-table-column align="center" label="联系方式" width="280">
        <template slot-scope="{row}">
          <span>{{ row.contact }}</span>
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
import {fetchList, removeComplain} from '@/api/complain'

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
        resetTemp() {
            this.temp = {
                name: '',
                imgurl: '',
                address: '',
                phone:''
            }
        },
        handleDelete(row, index) {
            this.$confirm(`确定删除 ${ row.id } ？`, `提示`, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.temp = Object.assign({}, row) 
              removeComplain(this.temp).then(() => {
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