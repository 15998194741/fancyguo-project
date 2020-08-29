<template>
  <div class="ruck-container">
    <div class="role-container-header" >
    <ul style="margin: 5px 5px -5px 0;">
      <!-- <li><el-button  slot="reference" icon="el-icon-upload2" size='small' class="button-with-header"  @click="serverCreatedialogFormVisible = true" >导入</el-button></li>
      <li><el-button  slot="reference" icon="el-icon-download" size='small' class="button-with-header" @click='exportFile' >导出</el-button></li> -->
      <li><el-button slot="reference" icon="el-icon-refresh" size='small' class="button-with-header"  @click="filterFormChange('flush')">刷新</el-button></li>
      <li> <el-button  slot="append" icon="el-icon-delete-solid" size='small' class="button-with-header"  @click='dialogFormchange = true'>道具回收</el-button></li>
    </ul>
  </div>
  <div class="role-container-search">
    <div class="server-container">ID：
  
      <el-input v-model="filterForm.roleid" placeholder="请输入角色ID" size='small' class="input-with-select" >
      </el-input>
      <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
      </el-button>
   
    </div>
   
    <div class="comprehensive-container">
      <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  > {{i.label}}:
        <el-select v-model="filterForm[i.key]" :multiple="i['multiple']" placeholder="请选择" :filterable='i.filterable' size='small' style="border-radius: 10px;" @change="filterFormChange('change')" >
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
    @selection-change="handleSelectionChange"
    >
    <el-table-column  type="selection" width="40"></el-table-column>
    <el-table-column v-for='(column,index) in tablecolumn' :key='index' :width="screenWidth" :label="column.label">
      <template slot-scope="scope">{{ scope.row[column.prop] }}</template>
    </el-table-column>
  </el-table>
  </div>
  <!-- <div class="role-container-bottom">
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
  </div>  -->
  
  <el-dialog title="批量操作" :visible.sync="dialogFormchange"  :close-on-click-modal="false">

    <div class="alertname">
      <el-table ref="multipleTable" :data="allselectchange">
        <el-table-column prop='articleId' label="物品ID" >
        </el-table-column>
        <el-table-column prop="articleName" label="物品名称" >
        </el-table-column>
        <el-table-column prop="articleClass" label="物品类型" >
        </el-table-column>
        <el-table-column prop="articleAmount" label="持有数量">
        </el-table-column>
        <el-table-column  label="回收数量" >
          <template slot-scope="scope"><el-input v-model="scope.row.recycleAmount" :value="scope.row.articleAmount" type='number'    placeholder="请输入内容"  @input="recycleAmountInput(scope.$index,scope.row)" @change='recycleAmountChange(scope.$index,scope.row)'></el-input></template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
 
      <el-button @click="dialogFormchange = false">取 消</el-button>
      <el-button type="primary" @click="recycleAmountPush">确 定</el-button>
    </div>
  </el-dialog>

  </div>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector';
import { backPackQuery, backPackRecycle } from '@/api/character.js';

export default {

  name: 'rolequery',
  data() {
    return {
      serverCreatedialogFormVisible: false,
      dialogFormchange: false,
      file: '',
      headers: {
        'fancy-guo-login-token': this.$store.getters.user.token,
        gameid: this.$store.getters.gameid
      
      },
      filelist: [],
      multipleTable: '',
      total: 0,
     
      filterForm: {
        roleid: '',
        articleAmount: '',
        articleClass: '',
        articleId: '',
        articleName: '',
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
        filterable: true,

        key: 'articleId',
        value: '',
        options: [
          {
            label: '不限制',
            value: ''
          }]
      }, {
        label: '物品名称',
        key: 'articleName',
        multiple: false,
        filterable: true,

        value: '',
        options: [{
          label: '不限制',
          value: ''
        }]
      },
      {
        label: '物品类型',
        key: 'articleClass',
        multiple: false,
        filterable: true,

        value: '',
        options: [{
          label: '不限制',
          value: ''
        }]
      
      }
      ],
      idoptions: [{
        label: '角色ID',
        value: 'roleid'
      }
      ],
      tableDataBackup: [],
      tableData: [
        // {
        // articleId: '', 
        // articleName: '', 
        // articleClass: '', 
        // articleAmount: '' 
        // }
     
    
      ],
      tablecolumn: [
        { label: '物品ID', prop: 'articleId', width: 50 },
        { label: '物品名称', prop: 'articleName', width: 50 },
        { label: '物品类型', prop: 'articleClass', width: 25 },
        { label: '数量', prop: 'articleAmount', width: -50 }
       

      ],

      screenWidth: 145,
      screenHeight: '',
      tableTrue: [],
      allselectchange: []
    };
    
  },
  methods: {
    recycleAmountInput(index, data) {
      
      if (data.articleAmount < data.recycleAmount) {
        this.allselectchange[index].recycleAmount = data.articleAmount;
      }
      if (data.recycleAmount < 0 || !data.recycleAmount) {
        this.allselectchange[index].recycleAmount = 0;
      }
    },
    recycleAmountChange(index, data) {
      
      this.allselectchange[index].recycleAmount = Math.round(this.allselectchange[index].recycleAmount);
    },
    async recycleAmountPush() {
      if (this.allselectchange.length < 1) {return;}
      let mergetrue = await this.$confirm('是否确认回收道具?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (!mergetrue) {return;}
    
      let res = await backPackRecycle({ value: this.allselectchange, roleid: this.filterForm.roleid });
      if (Number(res.code) === 200) {
        this.$notify({
          title: '消息提醒',
          message: ('i', { style: 'color: teal' }, '回收成功')
        });

      } else {
        this.$notify({
          title: '消息提醒',
          message: ('i', { style: 'color: teal' }, '回收失败')
        });
      }
      this.filterFormChange('click');
      this.dialogFormchange = false;
     
    },
    async filterFormChange(methods) {
      switch (methods) {
        case 'change':this.filterFormChanges(); break;
        case 'click' : this.filterFormClick(); break;
        case 'flush' :this.filterFormFlush(); break;
      }
      
      
      // console.log('res.data: ', res.data);
      // console.log(res);
    }, 
    handleSelectionChange(val,) {
      this.allselectchange = val.map(item =>{
        return { ...item, recycleAmount: item.articleAmount };
      });
    },
    backPackRecycle() {
      console.log(this.allselectchange);
    },
    async filterFormFlush() {
      for (let i in this.filterForm) {
        this.filterForm[i] = '';
      }
      this.tableData = [{
        articleId: '', 
        articleName: '', 
        articleClass: '', 
        articleAmount: '' 
      }];
    },    
    async filterFormChanges() {
      let { articleId, articleName, articleClass } = this.filterForm;
      if (!articleId && !articleName && !articleClass) {this.tableData = this.tableDataBackup; return;}
      this.tableData = this.tableDataBackup;
      this.tableData = this.tableData.filter(item => {
        let a = articleId ? articleId === item.articleId : true;
        let b = articleName ? articleName === item.articleName : true;
        let c = articleClass ? articleClass === item.articleClass : true;
        let d = (a && b && c);
        return d;
      });
    },
    async filterFormClick() {
      if (this.filterForm.roleid.length === 0) {return;}
      this.selectForm.map(item=>{
        item.options = [{
          label: '不限制',
          value: ''
        }];
        return item;
      });
      let { roleid } = this.filterForm;
      let res = await backPackQuery({ roleid });
      try {
        res = JSON.parse(res);
      } catch {
        console.log(1);
      }
      let tableDatas = res.data;
      // console.log(res);
      // this.tableData = res.data;
      try {
        tableDatas.map(item =>{
          this.selectForm[0].options.find(ele => ele.label === item.articleId) || !item.articleId
            ? item : this.selectForm[0].options.push(({ 'label': item.articleId, 'value': item.articleId })) 
          ;
        }
        );

        tableDatas.map(item =>{
          this.selectForm[1].options.find(ele => ele.label === item.articleName) || !item.articleName
            ? item : this.selectForm[1].options.push(({ 'label': item.articleName, 'value': item.articleName })) 
          ;
        }
        );
        tableDatas.map(item =>{
          this.selectForm[2].options.find(ele => ele.label === item.articleClass) || !item.articleClass
            ? item : this.selectForm[2].options.push(({ 'label': item.articleClass, 'value': item.articleClass })) 
          ;
        }
        );
        this.tableDataBackup = this.tableData = tableDatas;
      } catch (err) {
        this.$notify({
          title: '消息提醒',
          message: ('i', { style: 'color: teal' }, '查找失败，不存在.')
        });
      }

    }
  },
  mounted() {

    // const _this = this;
    const erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById('body'), element =>{
      this.screenWidth = element.offsetWidth * 0.2429;
    });
  }


  
};
</script>

<style lang="scss" rel="stylesheet/scss">
.ruck-container{

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
      border-radius: 30px 0 0 30px;

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
