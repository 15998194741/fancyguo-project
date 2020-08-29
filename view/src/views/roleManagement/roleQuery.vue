<template>
  <div class="role-container">
    <div class="role-container-header" >
    <ul style="margin-top: 5px;margin-bottom: -5px;">
      <li><el-button  v-if="grade" slot="reference" icon="el-icon-upload2" size='small' class="button-with-header"  @click="serverCreatedialogFormVisible = true" >导入</el-button></li>
      <li><el-button  v-if="grade" slot="reference" icon="el-icon-download" size='small' class="button-with-header" @click='exportFile' >导出</el-button></li>
      <li><el-button  slot="reference" icon="el-icon-refresh" size='small' class="button-with-header"  @click='filterFormChange'>刷新</el-button></li>
      <li> <el-button v-if="grade" slot="append" icon="el-icon-circle-plus-outline" size='small' class="button-with-header" :disabled='fenghaocaozuo' @click='dialogFormchange = true'>封号禁言</el-button></li>
    </ul>
  </div>
  <div class="role-container-search">
    <div class="server-container">ID：
      <el-select v-model="filterForm.key"   placeholder="请选择" name='idselect' size='small'>
        <el-option v-for="(item, index) in idoptions" :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="filterForm.value" placeholder="请输入内容" size='small' class="input-with-select" >
      </el-input>
      <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
      </el-button>
      注册时间：
        <el-date-picker  v-model="filterForm.regtime"  size='small'  type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="filterFormChange('change')" >
        </el-date-picker>
        封禁时间：
        <el-date-picker  v-model="filterForm.stime"  size='small'  type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="filterFormChange('change')"  >
        </el-date-picker>
    </div>
   
    <div class="comprehensive-container">
      <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  > {{i.label}}:
        <el-select v-model="filterForm[i.key]" :multiple="i['multiple']" :filterable='i.filterable' placeholder="请选择" size='small' style="border-radius: 10px;" @change="filterFormChange('change')" >
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
    style="min-height: 645px;" 
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading" 
    element-loading-background="rgba(0, 0, 0, 0.8)"
    border
    :data="tableData" 
    :row-class-name="tableRowClassName" 
    @selection-change="handleSelectionChange"
    >
    <el-table-column  type="selection" width="40"></el-table-column>
  
    <el-table-column v-for='(column,index) in tablecolumn' :key='index' :width="screenWidth+column.width" :label="column.label">
      <template slot-scope="scope">{{ scope.row[column.prop] }}</template>
    </el-table-column>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item v-for="(item,index) in tablecolumns" :key='index' :label="item.label">
            <span>{{ props.row[item.prop] }}</span>
          </el-form-item>      
        </el-form>
      </template>
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
    @size-change="filterFormChange('page')"
    @current-change="filterFormChange('page')" ></el-pagination>
  </div>
  <el-dialog title="文件上传" :visible.sync="serverCreatedialogFormVisible"  :close-on-click-modal="false">
    <el-upload
    ref='upload'
  style="text-align: center;"
  class="upload-demo"
  drag
  name='file'
  :headers='headers'
  limit=1
  action="http://localhost/api/character/uploadFile"
  accept='.xlsx,.xls'
  :auto-upload="false"
  :file-list='filelist'
  :on-success='uploadSuccess'
  :on-error='uploadError'
 >
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件</div>
</el-upload>
   <div style="text-align: center;"><el-button @click="uploadFile">上传</el-button><el-button @click="serverCreatedialogFormVisible = false">取 消</el-button></div>
  </el-dialog>



  <el-dialog title="封号操作" :visible.sync="dialogFormchange"  :close-on-click-modal="false">

    <div class="alertname">
      <el-table
      ref="multipleTable"
      border
      :data="tableTrue" 
      >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item v-for="(item,index) in tablecolumns" :key='index' :label="item.label">
              <span>{{ props.row[item.prop] }}</span>
            </el-form-item>      
          </el-form>
        </template>
      </el-table-column>
      <el-table-column v-for='(column,index) in tablecolumn' :key='index' :width="screenWidth+column.width" :label="column.label">
        <template slot-scope="scope">{{ scope.row[column.prop] }}</template>
      </el-table-column>
     
    </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-form ref="insertForm" :rules="createFormRules"  :model='insertForm'  prop='type'  label-width="100px"  class='createFormAlert'> 
        <el-form-item label="封禁类型" class="createFormAlertBody"   hide-required-asterisk required>
          <el-select  v-model='insertForm.type' class="alertcontant"   placeholder="请选择类型">
            <el-option  label='封号' value='1' ></el-option>
            <el-option  label='禁言'  value='2'></el-option>     
          </el-select>
        </el-form-item>
        <el-form-item label="封禁范围" class="createFormAlertBody" prop='area'  hide-required-asterisk required>
          <el-select  v-model='insertForm.area' class="alertcontant"  placeholder="请选择范围">
            <el-option  label='角色' value='1' ></el-option>
            <el-option  label='账户' value='2' ></el-option>
            <el-option  label='IP' value='3' ></el-option>     
          </el-select>
        </el-form-item>
        <el-form-item label="封禁原因" class="createFormAlertBody"  prop='beacuse'  hide-required-asterisk required>
          <el-input
              v-model="insertForm.beacuse"
              type="textarea"
              :rows="2"
              placeholder="请输入内容">
            </el-input>
        </el-form-item>
        <el-form-item label="封禁时长" class="createFormAlertBodys"   prop='long'  hide-required-asterisk required>
          <el-input v-model="insertForm.long" placeholder="请输入内容"></el-input>
          <el-select  v-model='insertForm.time' class="alertcontant"  placeholder="请选择内容">
            <el-option  label='小时' value='1' ></el-option>
            <el-option  label='天' value='24' ></el-option>
          </el-select>
      </el-form-item>
      </el-form>     
 
    

   
      <el-button @click="dialogFormchange = false">取 消</el-button>
      <el-button type="primary"  @click="createFormSubmitForm('insertForm')" >确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { findComponents } from '@/api/components.js';
import dayjs from 'dayjs';
import elementResizeDetectorMaker from 'element-resize-detector';
import { queryCharacter, findServername, prohibitedMute } from '@/api/character.js';
export default {

  name: 'rolequery',
  data() {
    return {
      loading: false,
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
        key: 'roleid',
        value: '',
        regtime: '',
        stime: '',
        plaform: '',
        channel: '',
        servername: '',
        'banned_type': '',
        'banned_area': '',
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
        filterable: true,
        multiple: true,
        value: '',
        options: []
      },
      {
        label: '服务器名称',
        key: 'servername',
        multiple: false,
        filterable: true,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }]
      }, {
        label: '封禁类型',
        key: 'banned_type',
        multiple: false,
        filterable: false,
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
        label: '封禁范围',
        key: 'banned_area',
        multiple: false,
        filterable: false,
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
      }, {
        label: '账户ID',
        value: 'account_id'
      }, {
        label: 'IP',
        value: 'ip'
      }, {
        value: 'role_name',
        label: '关键字'
      }

      ],
      tableData: [
      //   {
      //   roleid: '', //角色ID
      //   account_id: '', //用户id
      //   role_name: '', //角色昵称
      //   channel: '', //渠道客户端
      //   distinct_id: '', //设备iD
      //   machine: '', //设备类型
      //   plaform: '', //平台                     新增 Android  IOS
      //   serverid: '', //区服ID                   新增
      //   update_time: '', //最后登录时间           新增 
      //   level: '', //等级
      //   vip_level: '', //vip等级
      //   sum_recharge: '', //付费总额
      //   ip: '', //用户Ip地址
      //   regtime: '', //注册时间
      //   banned_type: '', //封禁类型   pgsql
      //   banned_area: '', //封禁范围    pgsql
      //   banned_reason: '', //封禁原因   pgsql
      //   banned_time: '', //封禁时长
      //   stime_etime: ''

      // }
      ],
      tablecolumn: [
        { label: '角色ID', prop: 'roleid', width: 50 },
        { label: '账户ID', prop: 'account_id', width: 50 },
        { label: '昵称', prop: 'role_name', width: 25 },
        { label: '平台', prop: 'plaform', width: -50 },
        { label: '客户端', prop: 'channel', width: -50 },
        { label: '设备ID', prop: 'distinct_id', width: 53 },
        { label: '设备类型', prop: 'machine', width: -20 },
        { label: '区服名称', prop: 'vip_level', width: 15 },
        { label: '区服ID', prop: 'serverid', width: 30 },
        { label: '等级', prop: 'level', width: -50 },
        { label: 'VIP等级', prop: 'vip_level', width: -50 }

      ],
      tablecolumns: [
        { label: '付费总额', prop: 'sum_recharge' },
        { label: 'IP', prop: 'ip' },
        { label: '注册时间', prop: 'regtime' },
        { label: '最后登录时间', prop: 'update_time' },
        { label: '封禁类型', prop: 'banned_type' },
        { label: '封禁范围', prop: 'banned_area' },
        { label: '封禁原因', prop: 'banned_reason' },
        { label: '封禁时长', prop: 'banned_time' },
        { label: '封禁时间-解封时间', prop: 'stime_etime' }
      ],
      screenWidth: 145,
      screenHeight: '',
      tableTrue: []
    };
  },
  computed: {
    fenghaocaozuo() {
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
    handleSelectionChange(val) {
      this.tableTrue = val;
    },
    uploadError() {
      this.$message('上传失败');
    },
    exportFile() {
      require.ensure([], () => {
        const { export_json_to_excel: exportJsonToExcel } = require('@/Excel/Export2Excel');//注意这个Export2Excel路径
        const tHeader = ['角色ID', '账户ID', '昵称', '平台', '客户端', '设备ID', '设备类型', '区服名称', '区服ID', '等级', 'VIP等级', '付费总额', 'IP', '注册时间', '最后登录时间', '封禁类型', '封禁范围', '封禁原因', '封禁时长', '封禁时间-解封时间']; // 上面设置Excel的表格第一行的标题
        // const filterVal = ['index', 'nickName', 'name']; // 上面的index、nickName、name是tableData里对象的属性key值
        console.log(this.tableTrue);
        var list = []; //把要导出的数据tableData存到list
        for (let i of this.tableTrue) {
          var a = [i.roleid, i.account_id, i.role_name, i.plaform, i.channel, i.distinct_id, i.machine, i.servername, i.serverid, i.level, i.vip_level, i.sum_recharge, i.ip, i.regtime, i.update_time, i.banned_type, i.banned_area, i.banned_reason, i.banned_time, i.stime_etime];
          list.push(a);
        }
        // const data = this.formatJson(filterVal, list);
        exportJsonToExcel(tHeader, list, '列表excel');//最后一个是表名字
      });
  
    },
    formatJson(filterVal, jsonData) {
      let data = jsonData.map(v => filterVal.map(j => v[j]));
      console.log(data);
      return data;
    },
    async uploadFile() {
      let mergetrue = await this.$confirm('是否确认上传文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (mergetrue) {
        await this.$refs.upload.submit();
        this.$message.success('上传成功!'); 
      }
    
    },
    createFormSubmitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
        //二次确定
          let doubleTrue = await this.$confirm('是否确认封号禁言?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning' })
            .catch(err => false);
          if (!doubleTrue) {return;}
    
          let res = await prohibitedMute({ ...this.insertForm, value: this.tableTrue });
          if (res.code === 200) {
            this.dialogFormchange = false; this.filterFormChange('flush'); this.$message({
              type: 'success',
              message: '操作成功'
            }); return; 
          }
        }
      });

    },
    uploadSuccess(response, file, fileList) {
      if (response.code !== 200) {
        this. tableData = [];
        return;
      } else {
        this. tableData = response.message;
      }
      this.serverCreatedialogFormVisible = false;
    },
    tableRowClassName({ row, rowIndex }) {
  
      if (row.banned_type) {
        return row.banned_type === '1' ? 'success-feng' : 'success-jiny';
      } 
      
 
    },


    filterFormChange(methods) {
      switch (methods) {
        case 'change':this.changeFilterFormChange(); break;
        case 'click':this.clickFilterFormChange(); break;
        case 'page':this.clickFilterFormPage(); break;

        default:this.flushFilterFormChange(); 
      }
    },
    clickFilterFormPage() {
    
      this.findCharacter();
    },
    flushFilterFormChange() {
      for (let key in this.filterForm) {
        if (key === 'page' || key === 'pagesize') {
          continue;
        }
        this.filterForm[key] = '';
      }
      this.findCharacter();
    },
    changeFilterFormChange() {
      this.filterForm.value = '';
      this.findCharacter();
      
    },
    clickFilterFormChange() {
      for (let key in this.filterForm) {
        if (key === 'key' || key === 'value' || key === 'page' || key === 'pagesize') {
          continue;
        }
        this.filterForm[key] = '';
      }
      this.findCharacter();
    },
    async findCharacter() {
      this.loading = true;
      let res = await queryCharacter(this.filterForm);
      this.tableData = res.data.res;
      this.total = Number(res.data.total);
      if (+this.total === +0) { this.loading = false; return;}
      this.tableData.map(item =>{
        item['stime_etime'] = dayjs(item.stime).format('YYYY-MM-DD HH:mm:ss') + '----' + dayjs(item.stime).add(item.banned_time, 'hour').format('YYYY-MM-DD HH:mm:ss');
        item.plaform = item.plaform ? item.plaform === '1' ? '安卓' : '苹果' : '';
        item['banned_time'] = item.banned_time > 24 ? (item.banned_time - item.banned_time % 24) / 24 + '天' + item.banned_time % 24 + '小时' : item.banned_time + '小时';
        item['banned_type'] = item.banned_type ? item.banned_type === '1' ? '封号' : '禁言' : '';
        item['banned_area'] = item.banned_area ? item.banned_area === '1' ? '角色' : item.banned_area === '2' ? '账号' : 'IP' : '';
        item.regtime = dayjs(item.regtime).format('YYYY-MM-DD HH:mm:ss');
        item['update_time'] = dayjs(item.update_time).format('YYYY-MM-DD HH:mm:ss'); 
        return { ...item };
      });
      this.loading = false;
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
    // this.selectForm[2].options = this.selectForm[2].options.concat(servername.data);

    // this.findCharacter();
    // let res = await queryCharacter({ page: 1, pagesize: 10 });
    // this.tableData = res.data.res;
    // this.screenWidth = document.body.clientWidth;
    // this.screenHeight = document.body.clientHeight;
    // window.onresize = () =>{
    //   return (()=>{
    //     this.screenWidth = document.body.clientWidth;
    //     this.screenHeight = document.body.clientHeight;
    //   })();
    // };
    // const _this = this;
    const erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById('body'), element =>{

      switch (element.offsetWidth) {
        case 1840: this.screenWidth = 158; break;
        case 1700: this.screenWidth = 145; break;
      }
      // if (element.offsetWidth === 1840) {
      //   this.screenWidth = 174;
      // } else if (element.offsetWidth === 1700) {
      //   this.screenWidth = 160;
      // }
      // _this.$nextTick(()=>{
      //   this.screenHeight = '11123123';
      // });

    });
  

  },
  created() {
  
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.role-container{

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
