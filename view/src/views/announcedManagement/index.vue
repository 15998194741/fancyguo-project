<template>
  <div class="anno-container">
    <div class="role-container-header" >
    <ul style="margin-top: 5px;margin-bottom: -5px;">
     
      <li><el-button slot="reference" icon="el-icon-refresh" size='small' class="button-with-header" >刷新</el-button></li>
      <li><el-button slot="reference" icon="el-icon-circle-plus-outline" size='small' class="button-with-header"  @click='dialogFormVisiblechangealter' >新建公告</el-button></li>
      <li><el-button slot="reference" icon="el-icon-mouse" :disabled='send' size='small' class="button-with-header"  @click='dialogFormVisiblesend = true' >发布</el-button></li>

  
    </ul>
  </div>
  <div class="role-container-search">
    <div class="server-container">ID：
      <el-input v-model="filterForm['bulletinid']" placeholder="请输入公告ID" size='small' class="input-with-select" >
      </el-input>
      <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
      </el-button>
      时间：
      <el-date-picker   v-model="filterForm['setime']"  size='small' type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"   @change="filterFormChange('change')">
      </el-date-picker>
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
    <el-table-column  prop='status' label="操作">
      <template slot-scope="scope">
        <el-button  v-show='scope.row["changeshow"]' @click="placardmodify(scope.$index,scope.row)">修改</el-button>
        <el-popconfirm
          v-show='scope.row["stopshow"]'
          confirmButtonText='好的'
          cancelButtonText='不用了'
          icon="el-icon-info"
          iconColor="red"
          title="确定停用此公告吗？"
          @onConfirm="placarddeactivate(scope.$index,scope.row)"
                >
  <el-button slot="reference"  >停用</el-button>
</el-popconfirm>
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
    @size-change="filterFormChange('change')"
    @current-change="filterFormChange('change')" ></el-pagination>
  </div>

  <el-dialog title="新建公告" :visible.sync="dialogFormVisiblechange" class="announceddialog"  :close-on-click-modal="false">
   <div class="headradio"> <el-radio v-model="radio"  :label="true">跑马灯</el-radio>
    <el-radio v-model="radio" :label="false">公告板</el-radio></div>
   <div class="container">
      <div >  
        <el-form ref="createForm"  :model="createForm" :rules="textrule" label-width="80px">
          <el-form-item label="公告ID:">
            <el-input v-model="createForm['bulletinid']" disabled style="width: 80%;" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="公告正文:" prop='text' >
            <el-input
            v-model="createForm['text']"
            type="textarea"
            style="width: 80%;"
            :rows="8"
            placeholder="请输入内容">
</el-input>
          </el-form-item>
          </el-form>
      </div>
      <div>
        <el-form v-show='!radio' ref="createFormbulletin" :model="createForm" :rules="announcementrule" label-width="80px" >
          <el-form-item label="公告标题:"  prop='title'>
            <el-input v-model="createForm.title" placeholder="请输入内容"  ></el-input>
          </el-form-item>
        <el-form-item label="公告图片:" hide-required-asterisk>
          <a href="javascript:;" class="a-upload">
          <input  id='uploadimage'    type='file'  @change='fileupload'> 点击上传文件
        </a>{{fileName}}
        </el-form-item>
        <el-form-item label="公告链接:" prop='title' >
          <el-input v-model="createForm['a']" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="平台:">
          <el-select v-model="createForm['plaform']" placeholder="请选择" size='small' style="border-radius: 10px;" >
            <el-option   label='不限制' value="" ></el-option>
            <el-option   label='安卓' value="1" ></el-option>
              <el-option   label='苹果' value="2" ></el-option>
          </el-select>
         
        </el-form-item>
        <el-form-item label="客户端:">
          <el-select v-model="createForm['channel']" multiple placeholder="请选择" size='small' style="border-radius: 10px;" >
            <el-option v-for="(item,index) in selectForm[1].options"   :key="index"  :label='item.label' :value="item.value" >
            </el-option>
          </el-select>
    
        </el-form-item>
        </el-form>
        <el-form v-show='radio' ref="createFormMarqueeRule" :rules='createFormMarqueeRules' :model="createForm"  label-width="80px" >
          <el-form-item label="开始时间:" prop='stime'>
            <el-date-picker
            v-model="createForm['stime']"
            type="datetime"
            placeholder="选择日期时间"
            @change='queryMarqueeweights'>
          </el-date-picker>
          </el-form-item>
        <el-form-item label="结束时间:" prop='etime'>
          <el-date-picker
          v-model="createForm['etime']"
          type="datetime"
          placeholder="选择日期时间"
          @change='queryMarqueeweights'>
        </el-date-picker>
        </el-form-item>
        <el-form-item label="平台:">
          <el-select v-model="createForm['plaform']" placeholder="请选择" size='small' style="border-radius: 10px;" @change='queryMarqueeweights' >
            <el-option   label='不限制' value="" ></el-option>
            <el-option   label='安卓' value="1" ></el-option>
              <el-option   label='苹果' value="2" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户端:">
          <el-select v-model="createForm['channel']" multiple placeholder="请选择" size='small' style="border-radius: 10px;" @change='queryMarqueeweights' >
            <el-option v-for="(item,index) in selectForm[1].options"   :key="index"  :label='item.label' :value="item.value" >
            </el-option></el-select>
        </el-form-item>
        <el-form-item label="服务器:">
          <el-select v-model="createForm['servername']" multiple placeholder="请选择" size='small' style="border-radius: 10px;" @change='queryMarqueeweights' >
            <el-option v-for="(item,index) in servernamesselect"   :key="index"  :label='item.label' :value="item.value" >
            </el-option></el-select>
        </el-form-item>
        <el-form-item label="时间间隔:" prop='interval'>
          <el-input
          v-model.number="createForm['interval']"
          placeholder="请输入内容">
</el-input>
        </el-form-item>
        <el-form-item label="权重:"  prop='weights'>
          <el-select  v-model="createForm['weights']"  placeholder="请选择" size='small' style="border-radius: 10px;" >
            <el-option v-for="(item,index) in Marqueeweights"   :key="index"  :label='item.label' :value="item.value" >
            </el-option></el-select>
        </el-form-item>
        </el-form>
      </div>

  </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisiblechange = false">取 消</el-button>
      <el-button type="primary" @click='postannounced'>确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="公告发布" :visible.sync="dialogFormVisiblesend" class="announceddialog"  :close-on-click-modal="false">
  <div
  class='tablesendheader'
style="min-height: 5vh;"
  >
    <el-switch
    v-model="sendtime"
    active-text="实时发送"
    inactive-text="定时发送"
    :active-value="false"
    :inactive-value="true"> </el-switch>
    <el-date-picker
      v-show='sendtime'
      v-model="sendtimes"
      style="margin-left: 10px;"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </div>

    <div class="">
      <el-table
      ref="multipleTable"
      border
      class="tablesendclass"
      :data="tableTrue" 
      >
      <el-table-column v-for='(column,index) in tablecolumn' :key='index' :width="screenWidth" :label="column.label">
        <template slot-scope="scope">{{ scope.row[column.prop] }}</template>
      </el-table-column>
    </el-table>
 
   </div>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogFormVisiblesend = false">取 消</el-button>
       <el-button type="primary" @click='postsendannounced'>确 定</el-button>
     </div>
   </el-dialog>



   <el-dialog title="公告修改" :visible.sync="dialogBulletinFormchange" class="announceddialog"  :close-on-click-modal="false">
    <div class="container">
       <div >  
         <el-form ref="form"  label-width="80px">
           <el-form-item label="公告ID:">
             <el-input v-model="changebulletindata['bulletinid']" disabled style="width: 80%;" placeholder="请输入内容"></el-input>
           </el-form-item>
           <el-form-item label="公告正文:">
             <el-input
             v-model="changebulletindata['text']"
             type="textarea"
             style="width: 80%;"
             :rows="8"
             placeholder="请输入内容">
 </el-input>
           </el-form-item>
           </el-form>
       </div>
       <div>
         <el-form v-if="changebulletindata['type'] === '公告板'"  ref="form" label-width="80px" >
           <el-form-item label="公告标题:" hide-required-asterisk>
             <el-input v-model="changebulletindata['title']" placeholder="请输入内容"></el-input>
           </el-form-item>
         <el-form-item label="公告图片:" hide-required-asterisk>
           <a href="javascript:;" class="a-upload">
           <input  id='uploadimage'    type='file'  @change='fileupload'> 点击上传文件
         </a>{{fileName}}
         </el-form-item>
         <el-form-item label="公告链接:">
           <el-input         v-model="changebulletindata['link']"          placeholder="请输入内容"></el-input>
         </el-form-item>
         <el-form-item label="平台:" >
           <el-select v-model="changebulletindata['plaform']" disabled placeholder="请选择" size='small' style="border-radius: 10px;" >
             <el-option   label='不限制' value="" ></el-option>
             <el-option   label='安卓' value="1" ></el-option>
               <el-option   label='苹果' value="2" ></el-option>
           </el-select>
          
         </el-form-item>
         <el-form-item label="客户端:">
           <el-select v-model="changebulletindata['client']" disabled multiple placeholder="请选择" size='small' style="border-radius: 10px;" >
             <el-option v-for="(item,index) in selectForm[1].options"   :key="index"  :label='item.label' :value="item.value" >
             </el-option>
           </el-select>
     
         </el-form-item>
         </el-form>
         <el-form v-if="changebulletindata['type'] === '跑马灯'" ref="form" label-width="80px" >
           <el-form-item label="开始时间:" hide-required-asterisk>
             <el-date-picker
             v-model="changebulletindata['start_time']"
             type="datetime"
             placeholder="选择日期时间"
             @change='changeQueryMarqueeweights'>
           </el-date-picker>
           </el-form-item>
         <el-form-item label="结束时间:" hide-required-asterisk>
           <el-date-picker
           v-model="changebulletindata['end_time']"
           type="datetime"
           placeholder="选择日期时间"
           @change='changeQueryMarqueeweights'>
         </el-date-picker>
         </el-form-item>
         <el-form-item label="平台:">
           <el-select v-model="changebulletindata['plaform']" disabled placeholder="请选择" size='small' style="border-radius: 10px;" >
           </el-select>
         </el-form-item>
         <el-form-item label="客户端:">
           <el-select v-model="changebulletindata['client']" multiple disabled placeholder="请选择" size='small' style="border-radius: 10px;" >
            </el-select>
         </el-form-item>
         <el-form-item label="服务器:">
           <el-select v-model="changebulletindata['servername']" disabled multiple placeholder="请选择" size='small' style="border-radius: 10px;" >
         </el-select>
         </el-form-item>
         <el-form-item label="时间间隔:">
           <el-input
           v-model.number="changebulletindata['time_interval']"
           placeholder="请输入内容">
 </el-input>
         </el-form-item>
         

         <el-form-item label="权重:"  prop='weights'>
          <el-select   v-model="changebulletindata['weights']"  placeholder="请选择" size='small' style="border-radius: 10px;" >
            <el-option v-for="(item,index) in Marqueeweights"   :key="index"  :label='item.label' :value="item.value" >
            </el-option></el-select>
        </el-form-item>
         </el-form>
       </div>
 
   </div>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogBulletinFormchange = false">取 消</el-button>
       <el-button type="primary" @click='putchangeoneannounced'>确 定</el-button>
     </div>
   </el-dialog>
  </div>
</template>

<script>
import { deepCopy } from '@/utils/zoneSettings';
import elementResizeDetectorMaker from 'element-resize-detector';
import { findComponents } from '@/api/components.js';
import { postcreateAnnouncement, putchangeoneannouncedreq, getqueryservernames, getqueryMarqueeweights, postsendAnnouncement, getqueryAnnouncement, putupdateAnnouncement } from '@/api/announcedManagement';
import { findServername } from '@/api/character.js';
import dayjs from 'dayjs';
export default {

  name: 'rolequery',
  data() {
    var textruleone = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请至少输入一个字符'));
      }
      callback();
    };
    var titleruleone = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请至少输入一个字符'));
      }
      callback();
    };
    var linkruleone = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请至少输入一个字符'));
      }
      callback();
    };
    var dateruleone = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请选择一个时间'));
      }
      if (new Date() > value) {
        return callback(new Error('不可以选择超过现在时间得时间'));
      }
      callback();
    };
    var dateruletwo = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请选择一个时间'));
      }
      if (new Date(value) <= this.createForm['stime']) {
        return callback(new Error('结束时间不可等于或小于开始时间'));
      }
      callback();
    };
    var intervalFormRule = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请输入时间间隔'));
      }
      if (!/^[0-9]*$/.test(value)) {
        return callback(new Error('请输入纯数字'));
      }
      callback();
    };
    return {
      radio: true,
      changebulletindata: '',
      dialogBulletinFormchange: false,
      sendtime: false,
      sendtimes: '',
      dialogFormVisiblesend: false,
      AnnouncementBody: '',
      serverCreatedialogFormVisible: false,
      dialogFormVisiblechange: false,
      dialogFormchange: false,
      file: [],
      filelist: [],
      multipleTable: '',
      servernamesselect: [],
      total: 0,
      filterForm: {
        bulletinid: '',
        setime: '',
        plaform: '',
        channel: '',
        servername: '',
        type: '',
        page: 1,
        pagesize: 10
      },
      createForm: {
        bulletinid: '',
        stime: '',
        etime: '',
        plaform: '',
        channel: '',
        servername: '',
        interval: '',
        weights: '',
        title: '',
        images: '',
        a: '',
        text: ''

      },
      textrule: {
        text: [
          { validator: textruleone, trigger: ['blur', 'change'] }
        ]      
      },
      announcementrule: { 
        title: [{ validator: titleruleone, trigger: ['blur', 'change'] }],
        a: [{ validator: linkruleone, trigger: ['blur', 'change'] }] 
      },
      createFormMarqueeRules: { 
        stime: [{ validator: dateruleone, trigger: ['blur', 'change'] }],
        etime: [{ validator: dateruletwo, trigger: ['blur', 'change'] }],
        interval: [{ validator: intervalFormRule, trigger: ['blur', 'change'] }],
        weights: [{ validator: linkruleone, trigger: ['blur', 'change'] }]
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
      }, {
        label: '公告类型',
        key: 'type',
        multiple: false,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }, {
          label: '跑马灯',
          value: '1'

        }, {
          label: '公告板',
          value: '2'
        }]
      }],
      idoptions: [{
        label: '角色ID',
        value: 'roleid'
      }
      ],
      tableData: [],
      tablecolumn: [
        { label: '公告ID', prop: 'bulletinid' },
        { label: '公告类型', prop: 'type' },
        { label: '平台', prop: 'plaform' },
        { label: '客户端', prop: 'client' },
        { label: '区服名称', prop: 'servername' },
        { label: '公告标题', prop: 'title' },
        { label: '公告状态', prop: 'anno_status' },
        { label: '开始时间', prop: 'start_time' },
        { label: '结束时间', prop: 'end_time' }
      ],
      fileName: '',
      screenWidth: 145,
      screenHeight: '',
      tableTrue: [],
      Marqueeweights: []
    };
    
  }, computed: {
    send() {
      return this.tableTrue.length > 0 ? false : true;
    }
    // changeisshow() {

    // },
    // stopisshow() {
      
    // }
  
  },


  methods: {
    async changeQueryMarqueeweights(val) {
      if (val !== 'index') {
        this.changebulletindata['weights'] = '';
      }
      this.Marqueeweights = [];
      let { start_time: stime, end_time: etime, plaform, client, servername } = this.changebulletindata;
      switch (plaform) {
        case '不限制':plaform = ''; break;
        case '安卓':plaform = '1'; break;
        case '苹果':plaform = '2'; break;
      }
      let res = await getqueryMarqueeweights({ stime, etime, plaform, client, servername });
      let { data } = res;
      this.Marqueeweights = data.filter(a => a.value);
      let arr1 = [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
        { label: 6, value: 6 },
        { label: 7, value: 7 },
        { label: 8, value: 8 },
        { label: 9, value: 9 },
        { label: 10, value: 10 }
      ];
      this.Marqueeweights = arr1.filter(item => {
        return !this.Marqueeweights.some(ele => +ele.label === +item.label);
      });
    },
    arrayUnique(arr, name) {
      let hash = {};
      return arr.reduce(function(item, next) {
        hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
        return item;
      }, []);
    },
    async queryMarqueeweights() {
      this.createForm['weights'] = '';
      let { stime, etime, plaform, channel, servername } = this.createForm;
      if (plaform && channel) {
        let servername = await getqueryservernames({ channel, plaform });
        let { data } = servername;
        this.servernamesselect = this.arrayUnique(data, 'value');
      } else {
        this.createForm['servername'] = '';
        this.servernamesselect = [];
      }
      let res = await getqueryMarqueeweights({ stime, etime, plaform, channel, servername });
      let { data } = res;
      this.Marqueeweights = data.filter(a => a.value);
      let arr1 = [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
        { label: 6, value: 6 },
        { label: 7, value: 7 },
        { label: 8, value: 8 },
        { label: 9, value: 9 },
        { label: 10, value: 10 }
      ];
      this.Marqueeweights = arr1.filter(item => {
        return !this.Marqueeweights.some(ele => +ele.label === +item.label);
      });
    },
    async putchangeoneannounced() {
      let { code } = await putchangeoneannouncedreq(this.changebulletindata);
      if (+code === +200) {this.dialogBulletinFormchange = false; this.filterFormChangeget(); this.$message.success('修改成功'); return;}
      this.$message.warning('修改失败');
    },
    async postsendannounced() {
      let sendtime = this.sendtimes ? dayjs(this.sendtimes).format('YYYY-MM-DD HH:mm:ss') : '';
      if (!this.sendtime) {sendtime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');}
      if (!sendtime) {this.$message.info('请选择时间'); return;}
      let res = await postsendAnnouncement({ data: this.tableTrue, sendtime });
      if (res.code !== 200) { this.$message.warning('发布失败'); return;}
      this.$message.success('发布成功');
      this.dialogFormVisiblesend = false; 
      this.filterFormChangeget();
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.anno_status !== '待用' || row.type !== '公告板') {
        return 'success-row';
      }  
    },
    placardrelease(index, row) {
      console.log(index, row);
    },
    placardmodify(index, row) {
      this.dialogBulletinFormchange = true;
      this.changebulletindata = deepCopy(row);
      this.changeQueryMarqueeweights('index');
      
      // console.log(this.changebulletindata);
 
    },
    async placarddeactivate(index, row) {
      let res = await putupdateAnnouncement(row);
      if (+res.code === 200) {
        this.$message.success('停用成功');
        this.tableData[index]['anno_status'] = '停用';
        this.tableData[index].stopshow = false;
        this.tableData[index].changeshow = false;

        console.log(this);
        // this.filterFormChangePage();
        return;
      }
      this.$message.warning('停用失败');

    },
    
    dialogFormVisiblechangealter() {
      this.dialogFormVisiblechange = true;
      this.createForm['bulletinid'] = this.$store.getters.gameid + '' + new Date().getTime();
    },

    
    fileupload(e) {
      this.createForm['images'] = e.target.files[0];
      this.fileName = this.createForm['images'].name;
    },
    async postannounced() {
      let maintext = await this.$refs['createForm'].validate().catch(err=>false);
     
      let allRules = this.radio ? await this.$refs['createFormMarqueeRule'].validate().catch(err=>false) : await this.$refs['createFormbulletin'].validate().catch(err=>false);
      if (!allRules || !maintext) {return;}
      let a = new FormData();
      for (let [key, value] of Object.entries(this.createForm)) {
        a.append(key, value);
      }
      if (this.radio) {a.append('type', 1);} else {a.append('type', 2);}
      let res = await postcreateAnnouncement(a);
      if (res.code !== 200) {this.$message.warning('创建失败!'); return; }
      for (let key in this.createForm) {
        this.createForm[key] = '';
      }
      this.file = '';
      this.fileName = '';
      this.dialogFormVisiblechange = false;
      this.filterFormChangeget();
      this.$message.success('创建成功!'); 
    },
    uploadimages(file) {
      console.log(file);
    },
    handleSelectionChange(val) {
      this.tableTrue = val.filter(item => item.anno_status === '待用' && item.type === '公告板');
    },
    filterFormChange(val) {
      switch (val) {
        case 'click':this.filterFormChangeClick(); break;
        case 'change':this.filterFormChangeget(); break;
        case 'flush':this.filterFormChangeFlush(); break;
        case 'page':this.filterFormChangePage(); break;
      }
    },
    filterFormChangeClick() {
      for (let key in this.filterForm) {
        if (key === 'bulletinid' || key === 'page' || key === 'pagesize') {
          continue;
        }
        this.filterForm[key] = '';
      }
      this.filterFormGET(this.filterForm);
    },
    filterFormChangeget() {
      this.filterForm['bulletinid'] = '';
      this.filterFormGET(this.filterForm);
    },
 
    async filterFormGET(value) {
      let res = await getqueryAnnouncement(this.filterForm);
      if (+res.code !== +200) {this.tableData = []; return;} 
      this.tableData = res.data.res;
      this.total = +res.data.total;
      this.tableData.map(item =>{
        item.type = +item.type === 1 ? '跑马灯' : '公告板'; 
        item.plaform = item.plaform === 1 ? '安卓' : item.plaform === 2 ? '苹果' : '不限制';
        item.client = JSON.stringify(item.client) === JSON.stringify(['']) ? '' : item.client;
        item.servername = JSON.stringify(item.servername) === JSON.stringify(['']) ? '' : item.servername;
        try {
          item['start_time'] = item.start_time ? dayjs(item.start_time).format('YYYY-MM-DD HH:mm:ss') : '';   
          item['end_time'] = item.end_time ? dayjs(item.end_time).format('YYYY-MM-DD HH:mm:ss') : '';    
        } catch (err) {
          console.log(err);
        }
        switch (+item.anno_status) {
          case 1: item['anno_status'] = '停用'; item.changeshow = false; item.stopshow = false; break;
          case 2: item['anno_status'] = '发布中'; item.changeshow = false; item.stopshow = true; break;
          case 3: item['anno_status'] = '发布失败'; item.changeshow = false; item.stopshow = false; break;
          case 4: item['anno_status'] = '发布完成'; item.changeshow = false; item.stopshow = false; break;
          default:item['anno_status'] = '待用'; item.changeshow = true; item.stopshow = true;
        }
        return item;
      });
    }
  },

  async mounted() {
    // const _this = this;
    const erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById('body'), element =>{
      this.screenWidth = element.offsetWidth * 0.09;
    });
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
  .anno-container{
  .tablesendclass{
  }
  .tablesendheader{
    /* display: flex;
    align-items: baseline; */
  }
.announceddialog{
    input {
      width: 15vw;
    }
    textarea{
      width: 15vw;
    }
        .headradio{
          margin-left: 3%;
           margin-top: -2%;
        }
      .container{
        display: grid;
        grid-template-columns: 2fr 2fr;
        margin-top: 2%;
      }
      #file-upload-button{
        display: none;
      }
      .a-upload {
    position: relative;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    margin-right: 10px;
}
.a-upload input {
    position: absolute;
    /* font-size: 100px; */
    bottom: 0;
    top: 0;
    left: 0;
    opacity: 0;
}
.a-upload:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
}
      /* #uploadimage{
        border: 0;
    padding: 0;
    border-radius: 0;
    height: 100%;
    line-height: 200%;

    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    outline: 0;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
    
    display: inline-block;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;

        :hover{
          background: #AADFFD;
          border-color: #78C3F3;
          color: #004974;
          text-decoration: none;
        } */
        
      /* } */
}

.success-row td:first-child div{
  visibility: hidden;
}

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
            height: 32px;
            margin-right: 20px;
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

