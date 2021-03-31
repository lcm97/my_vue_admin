<template>
<div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="输入姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="选择状态" clearable class="filter-item" style="width: 280px">
        <el-option v-for="(item,index) in StatusList" :key="index" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <div class="filter-container" style="margin-top:10px">
      <el-select v-model="listQuery.link_id" placeholder="选择所属链接" clearable class="filter-item" style="width: 280px"  @change="selectChange1">
        <el-option v-for="item in Links" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.company" placeholder="选择所属机构" clearable class="filter-item" style="width: 280px"  @change="selectChange2">
        <el-option v-for="item in CompanyList" :key="item.id" :label="item.name" :value="item.name" />
      </el-select>
      <el-select v-model="listQuery.course" placeholder="选择所属课程" clearable class="filter-item" style="width: 280px">
        <el-option v-for="item in CourseList" :key="item.id" :label="item.name" :value="item.name" />
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

      <el-table-column align="center" label="openid" width="100">
        <template slot-scope="{row}">
          <span>{{ row.openid }}</span>
        </template>
      </el-table-column>

       <el-table-column align="center" label="微信头像" width="100">
        <template slot-scope="{row}">
          <el-image
            style="width: 80px; height: 80px;border-radius:50%;"
            :src="row.avatar"
            :preview-src-list="[row.avatar]"
            lazy>
          </el-image>
        </template>
      </el-table-column> 

      <el-table-column align="center" label="姓名" width="150">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="电话" width="150">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属链接id" width="150">
        <template slot-scope="{row}">
          <span>{{ row.link_id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="课程" width="250">
        <template slot-scope="{row}">
          <span>{{ row.course }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="机构" width="250">
        <template slot-scope="{row}">
          <span>{{ row.company }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="年级" width="100">
        <template slot-scope="{row}">
          <span>{{ row.grade }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="团id" width="100">
        <template slot-scope="{row}">
          <span>{{ row.group_id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否团长" width="100">
        <template slot-scope="{row}">
          <span>{{ row.is_cap }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="身份" width="100">
        <template slot-scope="{row}">
          <span>{{ row.identity }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.is_cap=='否'&&row.status!='未报名'" size="mini" type="primary" @click="handleChangeGroup(row,$index)">
            更换团
          </el-button>

          <el-button v-if="row.is_cap=='否'&&row.status!='未报名'" size="mini" type="primary" @click="handleLevelUp(row,$index)">
            升级团长
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>

        </template>
      </el-table-column> 

    </el-table>
    
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--弹出表单-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 600px; margin-left:50px;">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="temp.name" style="width: 400px; "/>
            </el-form-item>

            <el-form-item label="电话" prop="phone">
                <el-input v-model="temp.phone" style="width: 400px; "/>
            </el-form-item>

            <el-form-item label="年级" prop="phone">
                <el-input v-model="temp.grade" style="width: 400px; "/>
            </el-form-item>

            <el-form-item label="选择所属链接" prop="link_id" >
              <el-select v-model="temp.link_id" filterable placeholder="请选择" style="width: 400px; " @change="selectChange1">
                <el-option v-for="item in Links" :key="item.id" :label="item.name" :value="item.id" style="width: 480px; ">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>
                </el-option>
              </el-select>
            </el-form-item>


            <el-form-item label="选择所属机构" prop="company">
              <el-select v-model="temp.company" filterable placeholder="请选择" style="width: 400px; " @change="selectChange2">
                <el-option v-for="item in CompanyList" :key="item.id" :label="item.name" :value="item.name"
                  style="width: 480px; ">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="选择所属课程" prop="course">
              <el-select v-model="temp.course" filterable placeholder="请选择" style="width: 400px; " >
                <el-option v-for="item in CourseList" :key="item.id" :label="item.name" :value="item.name"
                  style="width: 480px; ">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="选择新老身份" prop="identity">
              <el-select v-model="temp.identity" filterable placeholder="请选择" style="width: 200px; " >
                <el-option v-for="(item,index) in IdentityList" :key="index" :label="item" :value="item"
                  style="width: 480px; ">
                  <span style="float: left">{{ item }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ index }}</span>
                </el-option>
              </el-select>
            </el-form-item>                    

      </el-form>
            
      <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>


    <!--弹出升级团长-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="LevelupFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 600px; margin-left:50px;">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="temp.name" style="width: 400px; " disabled/>
            </el-form-item>

            <el-form-item label="电话" prop="phone">
                <el-input v-model="temp.phone" style="width: 400px; " disabled/>
            </el-form-item>

            <el-form-item label="选择所属链接" prop="link_id" >
              <el-select v-model="temp.link_id" filterable placeholder="请选择" style="width: 400px; " disabled>
                <el-option v-for="item in Links" :key="item.id" :label="item.name" :value="item.id" style="width: 480px; ">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>
                </el-option>
              </el-select>
            </el-form-item>           

      </el-form>
            
      <div slot="footer" class="dialog-footer">
            <el-button @click="LevelupFormVisible = false">取消</el-button>
            <el-button type="primary" @click="LevelUp()">确认</el-button>
      </div>
    </el-dialog>


    <!--弹出更换团-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="ChangeGroupFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 600px; margin-left:50px;">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="temp.name" :disabled="true" style="width: 400px; "/>
            </el-form-item>

            <el-form-item label="电话" prop="phone">
                <el-input v-model="temp.phone" :disabled="true" style="width: 400px; "/>
            </el-form-item>

            <el-form-item label="选择所在团" prop="group_id">
              <el-select v-model="temp.new_group_id" filterable placeholder="请选择" style="width: 200px; " >
                <el-option v-for="item in GroupList" :key="item.id" :label="item.name" :value="item.id"
                  style="width: 480px; ">
                  <span style="float: left">{{ item.id }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>  
        
      </el-form>
            
      <div slot="footer" class="dialog-footer">
            <el-button @click="LevelupFormVisible = false">取消</el-button>
            <el-button type="primary" @click="ChangeGroup()">确认</el-button>
      </div>
    </el-dialog>


</div>
    
</template>

<script>
import Pagination from '@/components/Pagination' 
import { fetchList, updateUser, removeUser, levelUp, groupChange, isCap, fetchGroupList} from '@/api/user'
import { fetchLinkList,} from '@/api/common'
import { fetchCompanyList, fetchCourseList} from '@/api/course'
export default {
    components: { Pagination },
    filters: {
        statusFilter(status) {
            const statusMap = {
                已付款: 'success', //进行中
                未报名: 'info',   //下架
                未付款: 'danger'  //删除
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

            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                name: undefined, //搜索名字
                status: undefined, //搜索状态

                link_id: undefined, //所搜链接id
                company: undefined, //所选择的机构名字
                course: undefined, //所选择的课程名字

                group_id: undefined //所参加团id
            },
          
            dialogFormVisible: false,
            LevelupFormVisible: false,
            ChangeGroupFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑用户',
                create: '新建用户',
                levelup: '升级为团长',
                change: '更换团'
            },
            rules:{
            },
            temp: {
                name: '',
                phone: '',
                grade: '',
                link_id: undefined,
                course:'',
                company:'',
                identity:'',
                group_id: undefined,
                is_cap: '',
                new_group_id: undefined

            },
            StatusList: ['未报名','已付款','未付款'],
            Links:[], //链接链表
            CompanyList: [],
            CourseList: [],
            GroupList: [],
            IdentityList: ['新生','老生'],

            isCap: false
        

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
                phone: '',
                grade: '',
                link_id: undefined,
                course:'',
                company:'',
                identity:'',
                group_id: undefined,
                is_cap: '',
                new_group_id: undefined,
            }
        },
        handleUpdate(row) {
            this.temp = Object.assign({}, row) // copy obj
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })

            // fetchCompanyList(this.temp.link_id).then(response => {
            //         this.CompanyList = response.data.items
            // })     
        },
        updateData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const tempData = Object.assign({}, this.temp)
                    updateUser(tempData).then(() => {
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
            this.$confirm(`确定删除 ${ row.name } 此用户？`, `提示`, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.temp = Object.assign({}, row) 
              removeUser(this.temp).then(() => {
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
        selectChange1(link_id){
            fetchCompanyList(link_id).then(response => {
                this.CompanyList = response.data.items
            })
        },
        selectChange2(company){
            fetchCourseList(company).then(response => {
                this.CourseList = response.data.items
            })
        },
        //升级团长
        handleLevelUp(row, index){
          this.temp = Object.assign({}, row) // copy obj
          console.log(this.temp)
          this.dialogStatus = 'levelup'
          this.LevelupFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        LevelUp(){
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const tempData = Object.assign({}, this.temp)
                    levelUp(tempData).then(response => {
                      //console.log(response)
                      tempData.is_cap = '是'
                      tempData.group_id = response.data.item.id
                      const index = this.list.findIndex(v => v.id === tempData.id)
                      this.list.splice(index, 1, tempData)
                      this.LevelupFormVisible = false
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
        //更换团
        handleChangeGroup(row, index){
          //console.log(row.id)
          this.temp = Object.assign({}, row) // copy obj
          this.dialogStatus = 'change'
          this.ChangeGroupFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
          fetchGroupList(this.temp.link_id).then(response => {
            this.GroupList = response.data.items
            //console.log(this.GroupList)
          }) 
        },
        ChangeGroup(){
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const tempData = Object.assign({}, this.temp)
                    groupChange(tempData).then(() => {
                        const index = this.list.findIndex(v => v.id === tempData.id)
                        tempData.group_id = this.temp.new_group_id
                        this.list.splice(index, 1, tempData)
                        this.ChangeGroupFormVisible = false
                        this.$notify({
                        title: 'Success',
                        message: 'Update Successfully',
                        type: 'success',
                        duration: 2000
                        })
                    })
                }
            })
        }


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