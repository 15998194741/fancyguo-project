<template>
  <div class="recha-container">
    <div class="role-container-header" >
    <ul>
 
      <li><el-button slot="reference" style="margin: 5px 5px -3px 0 ;" icon="el-icon-refresh" size='small' class="button-with-header"  @click="filterFormChange('flush')">刷新</el-button></li>
      <li> <el-button  slot="append" style="margin: 5px 5px -3px 0 ;" icon="el-icon-thumb" size='small' class="button-with-header"  :disabled='Replenishment' @click='Replenishmentclick'  >补单</el-button></li>
    </ul>
  </div>
  <div class="role-container-search">
    <div class="server-container">ID：
    
      <el-input v-model="filterForm.roleid" placeholder="请输入角色ID" size='small'  class="input-with-select" >
      </el-input>
      <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
      </el-button>
   
    </div>
   
    <div class="comprehensive-container">
      <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  > {{i.label}}:
        <el-select v-model="filterForm[i.key]" :multiple="i['multiple']" placeholder="请选择" size='small' style="border-radius: 10px;" @change="filterFormChange('change')" >
          <el-option v-for="(item,index) in i.options" :key="index"  :label='item.label' :value="item.value" >
          </el-option>
        </el-select>
       
      </div>
     下单时间：
      <el-date-picker   v-model="filterForm['srttime']"  size='small' type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"   @change="filterFormChange('change')">
      </el-date-picker>
    </div>
  </div>

  <div id='body' class="role-container-body">
    <el-table
    ref="multipleTable"
    border
    :data="tableData" 
    @selection-change="handleSelectionChange"
    >
    <el-table-column  type="selection" width="40"></el-table-column>
    <el-table-column v-for='(column,index) in tablecolumn' :key='index'  :label="column.label">
      <template slot-scope="scope">{{ scope.row[column.prop] }}</template>
    </el-table-column>
  </el-table>
  </div>
  <div class="role-container-bottom">
    <el-pagination
    style="text-align: right;"
    :page-size.sync="filterForm['pagesize']"
    :page-sizes="[10, 20, 30, 40]"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :pager-count='9'  
    :hide-on-single-page="false"  
    :total="total"
    :current-page.sync='filterForm.page'
    @size-change="filterFormChange('change')"
    @current-change="filterFormChange('change')" ></el-pagination>
  </div>

  </div>
</template>

<script>
// import elementResizeDetectorMaker from 'element-resize-detector';
import { findComponents } from '@/api/components.js';
import { findServername } from '@/api/character.js';
import { rechargeQuery, replenishmentpost } from '@/api/rechargeDetails.js';
import dayjs from 'dayjs';

export default {

  name: 'rolequery',
  data() {
    return {
      multipleTable: '',
      total: 0,
      filterForm: {
        roleid: '',  
        stime: '',
        plaform: '',
        channel: '',
        servername: '',
        page: 1,
        pagesize: 10
      },
      selectForm: [{
        label: '平台',
        multiple: false,
        key: 'plaform',
        value: '',
        options: [
          {
            label: '不限制',
            value: ''
          }, {
            label: 'Android',
            value: '1'

          }, {
            label: 'IOS',
            value: '2'
          }]
      }, {
        label: '客户端',
        key: 'channel',
        multiple: true,
        value: '',
        options: []
      },
      {
        label: '服务器名称',
        key: 'servername',
        multiple: false,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }]
      }
      ],
      tableData: [],
      tablecolumn: [
        { label: '角色ID', prop: 'roleId' },
        { label: '账户ID', prop: 'uid' },
        { label: '昵称', prop: 'roleName' },
        { label: '平台', prop: 'type' },
        { label: '客户端', prop: 'channel' },
        { label: '设备ID', prop: 'deviceid' },
        { label: '设备类型', prop: 'platform' },
        { label: '区服ID', prop: 'serverId' },
        { label: '充值金额', prop: 'price' },
        { label: '商品ID', prop: 'pid' },
        { label: '订单状态', prop: 'isOK' },
        { label: '补单状态', prop: 'isSend' },
        { label: '订单号', prop: 'tid' },
        { label: '下单时间', prop: 'createdAt' },
        { label: '到账时间', prop: 'updatedAt' }
        // { label: '错误信息', prop: '' }
      ],
      tableTrue: []
    };
    
  }, 
  computed: {
    Replenishment() {
      return this.tableTrue.length > 0 ? false : true;
    },
    grade() {
      if (this.$route.meta.grade === 0) {
        return false;
      }
      return true;
    }
  },
  methods: {
    async Replenishmentclick() {
      let replentrue = await this.$confirm('您正在修改数据，请谨慎处理！是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err)=>false);
      if (!replentrue) {return;}
      let res = await replenishmentpost(this.tableTrue);
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '补单成功'
        }); return;
      }
      this.$message({
        type: 'info',
        message: res.msg
      });
    },
    async filterFormChange(methods) {
      switch (methods) {
        case 'click':this.filterFormChangeClick(); break;
        case 'change':this.filterFormChangeChange(); break;
        case 'flush':this.filterFormChangeFlush(); break;
        case 'page':this.filterFormChangepage(); break;

      }
    },
    async filterFormChangeClick() {
      for (let i in this.filterForm) {
        if (['roleid', 'page', 'pagesize'].indexOf(i) >= 0) {continue;}
        this.filterForm[i] = '';
      }
      this.rechargeDetails();
    },
    async filterFormChangeChange() {
      this.filterForm['roleid'] = '';
      this.rechargeDetails();
    },
    async filterFormChangeFlush() {
      for (let i in this.filterForm) {
        if (['page', 'pagesize'].indexOf(i) >= 0) {continue;}
        this.filterForm[i] = '';
      }
      this.tableData = [];
    
    },
    async filterFormChangepage() {
      this.rechargeDetails();
    },
    async rechargeDetails() {
     
      let res = await rechargeQuery(this.filterForm);
      console.log(this.filterForm);
      this.tableData = res.data.res;
      this.total = res.data.total;
      this.tableData.map(item =>{
        item.isOK = item.isOK === 'success' ? '成功' : item.isOK === '0' ? '未支付' : item.isOK === 'sending' ? '补单' : item.isOK === 'failure' ? '支付失败' : '';
        item.isSend = item.isSend === 'success' ? '成功' : item.isSend === 'failure' ? '失败' : '';
        item.createdAt = dayjs(item.createdAt).format('YYYY年MM月DD日HH时mm分ss秒');
        item.updatedAt = dayjs(item.updatedAt).format('YYYY年MM月DD日HH时mm分ss秒');
        item.type = item.type === 'apple' ? '苹果' : '安卓';
        return { ...item };
      });
     
    },
    handleSelectionChange(val) {
      this.tableTrue = val;
    }
  },
  async mounted() {
    findComponents({ code: 'areaclothing', gameid: this.gameid }).then(res => {
      let components = res.data.values.map(item=>({
        label: item,
        value: item
      }));
      this.selectForm[1].options = this.selectForm[1].options.concat(components);
      this.clientOptions = components;
    });
    let { data } = await findServername();
    data.map(item =>{
      this.selectForm[2].options.find(ele => ele.label === item.label) || !item.label
        ? item : this.selectForm[2].options.push(item);
    });




  }


  
};
</script>

<style lang="scss" rel="stylesheet/scss">
.recha-container{





  .selectID {
  
    span:first-child{
      display: none;
      
    }
  }


  .success-feng{
    background-color: rgba(255,0,0,0.4);
  }
  .success-jiny{
    background-color: rgba(255,155,0,0.3);

  }
  .el-table td, .el-table th.is-leaf{
    text-align: center;
  }
    .demo-table-expand{
      display: grid;
      grid-template-columns: repeat(3,1fr);
      width: 100%;
      margin-left: 3%;
      font-size: 18px;
      label{
        width: 140px;
      color: #99a9bf;
      }
    .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    display: flex;
    label{
      float: left;
    }
    /* text-align: center; */
  }
    }
  .role-container-body{
    margin: 10px;
    background-color: white;
    border-radius: 5px;
    padding: 5px;
    min-height: 66vh;
    /* -webkit-box-shadow: 1px 1px 4px 0px #828282; */
    box-shadow: 1px 1px 4px 0px #828282;
    .el-table .cell{
      word-break: keep-all;
    } 
  }
  .role-container-header ul li{
    float: right;
    margin-left: 2px;
    button{
      border-radius: 30px;
    }
    button:focus{
      box-sizing: content-box;
    }

  }
  .role-container-header ul{
    display: flex;
    justify-content: flex-end;
  }
  .server-container {
        border-bottom: 1px #bdbdbd dashed;
        padding: 10px;
      }
      .input-with-select {
      width: 250px;
      margin-left: -4px;
      border-radius: 0;

      input {
        border-radius: 30px 0 0 30px;
      }
    }
    .comprehensive-container .select-item {
      margin-left: 10px;
      width: 20%;
    }

    .comprehensive-container {
      .select-item:first-child {
        margin-left: -5px;
        width: 19%;
      }}
      .comprehensive-container {
        display: flex;
        padding: 10px;
        align-items: baseline;

      }
      .role-container-search {
      margin: 10px;
      background-color: white;
      border-radius: 5px;
      padding: 5px;
      box-shadow: 1px 1px 4px 0px #828282;
      button[name='truesearch']{
            border-radius: 0 30px 30px 0;
            margin-left: -5px;
            height: 32px
      }
      input[name='idselect'] {
      border-radius: 30px 0 0 30px;
      width: 100px;
      /* height: 30px; */
    }
      .server-container {
        border-bottom: 1px #bdbdbd dashed;
      }

      .comprehensive-container {
        display: flex;
        padding: 10px;
        align-items: baseline;

      }
    }

    .createFormAlertBodys div{
      display: flex;
    }

    .createFormAlert{
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
      .el-select{
        display: block;
      }
  }






}


</style>

