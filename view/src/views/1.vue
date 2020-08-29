<template>
    <div class="pros-container">
      <div class="role-container-header" >
      <ul>
        <!-- <li><el-button  slot="reference" icon="el-icon-upload2" size='small' class="button-with-header"  @click="serverCreatedialogFormVisible = true" >导入</el-button></li>
        <li><el-button  slot="reference" icon="el-icon-download" size='small' class="button-with-header" @click='exportFile' >导出</el-button></li> -->
        <li><el-button slot="reference" icon="el-icon-refresh" size='small' class="button-with-header"  @click='filterFormChange'>刷新</el-button></li>
        <li> <el-button  slot="append" icon="el-icon-delete-solid" size='small' class="button-with-header" :disabled='fenghaocaozuo' @click='dialogFormchange = true'>道具回收</el-button></li>
      </ul>
    </div>
    <div class="role-container-search">
      <div class="server-container">ID：
        <el-select v-model="filterForm.key"  disabled   placeholder="请选择" name='idselect' size='small' class="selectID">
          <el-option v-for="(item, index) in idoptions" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="filterForm.value" placeholder="请输入内容" size='small' class="input-with-select" >
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
      </div>
    </div>
  
    <div id='body' class="role-container-body">
      <el-table
      ref="multipleTable"
      border
      :data="tableData" 
      :row-class-name="tableRowClassName" 
      @selection-change="handleSelectionChange"
      >
      <el-table-column  type="selection" width="40"></el-table-column>
      <el-table-column v-for='(column,index) in tablecolumn' :key='index' :width="screenWidth" :label="column.label">
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
import elementResizeDetectorMaker from 'element-resize-detector';
  
export default {
  
  name: 'rolequery',
  data() {
    return {
      serverCreatedialogFormVisible: false,
      dialogFormchange: false,
      file: '',
      headers: {
        'fancy-guo-login-token': this.$store.getters.user.token,
        gameid: 1
        
      },
      filelist: [],
      multipleTable: '',
      total: 0,
      filterForm: {
        key: 'roleid',
        value: '',
        regtime: '',
        stime: '',
        plaform: '',
        channel: '',
        servername: '',
        banned_type: '',
        banned_area: '',
        page: 1,
        pagesize: 10
      },
      createFormRules: {
        type: [
          { required: true, message: '请输入至少一个字符', trigger: ['blur', 'change'] }
           
        ],
        area: [
          { required: true, message: '请选择一个平台', trigger: ['blur', 'change'] }
        ],
        time: [
          { required: true, trigger: ['blur', 'change'] }
        ],
        beacuse: [
          { required: true, message: '请输入原因', trigger: ['blur', 'change'] }
        ],
        long: [
          { required: true, message: '请输入时长', trigger: ['blur', 'change'] }
        ]
          
      },
      insertForm: {
        type: '1',
        area: '1',
        time: '1',
        beacuse: '',
        long: ''
          
      },
      selectForm: [{
        label: '物品ID',
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
        label: '物品名称',
        key: 'channel',
        multiple: true,
        value: '',
        options: []
      },
      {
        label: '物品类型',
        key: 'servername',
        multiple: false,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }]
      }, {
        label: '数量',
        key: 'banned_type',
        multiple: false,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }, {
          label: '封号',
          value: '1'
  
        }, {
          label: '禁言',
          value: '2'
        }]
      }, {
        label: '时间',
        key: 'banned_area',
        multiple: false,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }, {
          label: '角色',
          value: '1'
  
        }, {
          label: '账户',
          value: '2'
        }, {
          label: 'IP',
          value: '3'
        }]
      }
      ],
      idoptions: [{
        label: '角色ID',
        value: 'roleid'
      }
      ],
      tableData: [{
        roleid: '', //角色ID
        account_id: '', //用户id
        role_name: '', //角色昵称
        channel: '', //渠道客户端
        distinct_id: '', //设备iD
        machine: '', //设备类型
        plaform: '', //平台                     新增 Android  IOS
        serverid: '', //区服ID                   新增
        update_time: '', //最后登录时间           新增 
        level: '', //等级
        vip_level: '', //vip等级
        sum_recharge: '', //付费总额
        ip: '', //用户Ip地址
        regtime: '', //注册时间
        banned_type: '', //封禁类型   pgsql
        banned_area: '', //封禁范围    pgsql
        banned_reason: '', //封禁原因   pgsql
        banned_time: '', //封禁时长
        stime_etime: ''
  
      }],
      tablecolumn: [
        { label: '物品ID', prop: 'roleid', width: 50 },
        { label: '物品名称', prop: 'account_id', width: 50 },
        { label: '物品类型', prop: 'role_name', width: 25 },
        { label: '数量', prop: 'plaform', width: -50 }
         
  
      ],
  
      screenWidth: 145,
      screenHeight: '',
      tableTrue: []
    };
      
  },
  mounted() {
      
    const _this = this;
    const erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById('body'), element =>{
      this.screenWidth = element.offsetWidth * 0.2429;
      //   switch (element.offsetWidth) {
      //     case 1840: break;
      //     case 1700: this.screenWidth = '30%'; break;
      //   }
    });
  
  
  
  
  
  }
  
  
    
};
</script>
  
  <style lang="scss" rel="stylesheet/scss">
  .pros-container{
  
  
  
  
  
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
          border-radius: 0;
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
  
