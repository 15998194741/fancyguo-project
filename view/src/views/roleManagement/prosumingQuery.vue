<template>
  <div class="pros-container">
    <div class="role-container-header" >
    <ul style="margin-bottom: -5px;margin-top: 5px;margin-right: 10px;">
      <!-- <li><el-button  slot="reference" icon="el-icon-upload2" size='small' class="button-with-header"  @click="serverCreatedialogFormVisible = true" >导入</el-button></li>
      <li><el-button  slot="reference" icon="el-icon-download" size='small' class="button-with-header" @click='exportFile' >导出</el-button></li> -->
      <li><el-button slot="reference" icon="el-icon-refresh" size='small' class="button-with-header"  @click="filterFormChange('flush')">刷新</el-button></li>
      <!-- <li> <el-button  slot="append" icon="el-icon-delete-solid" size='small' class="button-with-header" :disabled='fenghaocaozuo' @click='dialogFormchange = true'>道具回收</el-button></li> -->
    </ul>
  </div>
  <div class="role-container-search">
    <div class="server-container"> 
      角色ID：
      <el-input v-model="filterForm.roleid" placeholder="请输入角色ID" size='small' class="input-with-select" >
      </el-input>
      <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
      </el-button>
    </div>
    <div class="comprehensive-container">
      <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  > {{i.label}}:
        <el-select v-model="filterForm[i.key]" :multiple="i['multiple']" placeholder="请选择" :filterable='i.filterable'  size='small' style="border-radius: 10px;" @change="filterFormChange(i.flush)" >
          <el-option v-for="(item,index) in i.options" :key="index"  :label='item.label' :value="item.value" >
          </el-option>
        </el-select>
      </div>
    </div>
  </div>

  <div id='body' class="role-container-body">
    <el-table
    ref="multipleTable"
    v-loading="loading"
    border 
    :data="tableData"
    style="min-height: 645px;" 
    element-loading-text="拼命加载中" 
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" 
    >
   
    <el-table-column v-for='(column,index) in tablecolumn' :key='index' :sortable='true' :width="screenWidth" :label="column.label">
      <template slot-scope="scope" :style='column.class'> {{ scope.row[column.prop] }}</template>
    </el-table-column>
  </el-table>
  </div>
  <div class="role-container-bottom">
    <el-pagination
    style="text-align: right;"
    :page-size.sync="filterForm['pagesize']"
    :page-sizes="[500, 1000, 1500, 2000]"
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
import { outputConsume } from '@/api/character.js';
import dayjs from 'dayjs';

export default {

  name: 'rolequery',
  data() {
    return {
      radio: '1',
      serverCreatedialogFormVisible: false,
      dialogFormchange: false,
      file: '', 
      loading: false,
      headers: {
        'fancy-guo-login-token': this.$store.getters.user.token,
        gameid: this.$store.getters.gameid
      },
      clicks: 0,
      filelist: [],
      multipleTable: '',
      total: 0,
      filterForm: {
      
        roleid: '', //角色ID
        'object_id': '', //道具ID
        'object_method': '', //物品来源
        'object_name': '', //道具名称
        'object_type': '', //物品类型 1增加 0减少
        'object_number': '', //物品数量
        'object_class': '',
        page: 1,
        pagesize: 500
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
      tableDataBackup: [],
      selectForm: [{
        label: '物品ID',
        multiple: false,
        filterable: true,
        flush: '1',
        key: 'object_id',
        value: '',
        options: [
          {
            label: '不限制',
            value: ''
          }]
      }, {
        label: '物品名称',
        key: 'object_name',
        filterable: true,
        flush: '1',

        multiple: false,
        value: '',
        options: []
      },
      {
        label: '物品类型',
        key: 'object_class',
        multiple: false,
        filterable: true,
        flush: '1',

        value: '',
        options: [{
          label: '不限制',
          value: ''
        }]
      },
      {
        label: '产出消耗',
        key: 'object_type',
        multiple: false,
        filterable: false,
        flush: '1',

        value: '',
        options: [{
          label: '不限制',
          value: ''
        }, {
          label: '产出',
          value: '1'
        }, {
          label: '消耗',
          value: '0'
        }]
      }
      ],
      idoptions: [{
        label: '角色ID',
        value: 'roleid'
      }
      ],
      tableData: [
      //   {
      //   roleid: '', //角色ID
      //   object_id: '', //道具ID
      //   object_method: '', //物品来源
      //   object_name: '', //道具名称
      //   object_type: '', //产出消耗 1增加 0减少
      //   object_number: '', //物品数量
      //   object_class: '', //物品类型 
      //   timestamp: ''
      // }
      ],
   
      tablecolumn: [
        { label: '物品ID', prop: 'object_id', class: '', width: 50 },
        { label: '物品名称', prop: 'object_name', class: '', width: 50 },
        { label: '物品类型', prop: 'object_class', class: '', width: 25 },
        { label: '数量', prop: 'object_number', class: 'color:red', width: -50 },
        { label: '物品来源', prop: 'object_method', class: '', width: -50 },
        { label: '时间', prop: 'timestamp', class: '', width: -50 }
      ],

      screenWidth: 145,
      screenHeight: '',
      tableTrue: []
    };
    
  },
  methods: {
    filterFormChange(methods) {
      
      switch (methods) {
        case 'change':this.clickFilterFormChange(); break;
        case 'click':this.clickcanflush(); break;
        case 'flush':this.clickcanflush(); break;

        case '1':this.selectchange(); break;
        // default:this.flushFilterFormChange(); 
      }
    },
    async selectchange() {
      let { object_id: id, object_name: name, object_class: classs, object_type: type } = this.filterForm;
      if (!id && !name && !classs && !type) {this.tableData = this.tableDataBackup; return;}
      this.tableData = this.tableDataBackup;
      this.tableData = this.tableData.filter(item => {
        let a = id ? id === item.object_id : true;
        let b = name ? name === item.object_name : true;
        let c = classs ? classs === item.object_class : true;
        let e = type ? +type === +item.object_type : true;
        let d = (a && b && c && e);
        return d;

      });
    },
    async clickcanflush() {
      this.clicks = 1;
      
      return this.filterForm.roleid.length === 0 ? '' : this.clickFilterFormChange();
    },    
    async clickFilterFormChange() {
      if (this.clicks !== 1) {return;}
      this.loading = true;
     
      let res = await outputConsume(this.filterForm);
      let tableDatas = res.data.res;
      if (tableDatas.length === 0) {this.loading = false; return;}
      this.tableData = tableDatas.map(item =>{
        if (+item.object_type === +1) {
          item['object_number'] = '+' + item.object_number;
        } else if (+item.object_type === +0) {
          item['object_number'] = '-' + item.object_number;
        }
        try {
          item.timestamp = +item.timestamp.toString().slice(0, -3);
          item.timestamp ? item.timestamp = dayjs(+item.timestamp).format('YYYY-MM-DD HH:mm:ss') : ''; 
        } catch {
          console.log(1);
        }
        return item;
      });
      this.total = Number(res.data.total);
      this.selectForm[0].options = [{
        label: '不限制',
        value: ''
      }];
      this.selectForm[1].options = [{
        label: '不限制',
        value: ''
      }];
    
      tableDatas.map(item =>{
        this.selectForm[0].options.find(ele => ele.label === item.object_id) || !item.object_id
          ? item : this.selectForm[0].options.push(({ 'label': item.object_id, 'value': item.object_id })) 
        ;
      }
      );
      tableDatas.map(item =>{
        this.selectForm[1].options.find(ele => ele.label === item.object_name) || !item.object_name
          ? item : this.selectForm[1].options.push(({ 'label': item.object_name, 'value': item.object_name })) 
        ;
      }
      );
      tableDatas.map(item =>{
        this.selectForm[2].options.find(ele => ele.label === item.object_class) || !item.object_class
          ? item : this.selectForm[2].options.push(({ 'label': item.object_class, 'value': item.object_class })) 
        ;
      }
      );
      this.tableDataBackup = this.tableData;
      this.loading = false;
    }
  },
  mounted() {
    
    // const _this = this;
    const erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById('body'), element =>{
      this.screenWidth = element.offsetWidth * 0.165;
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
      margin-left: -5px;
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
