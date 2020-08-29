<template>
  <div class="app-header" style="height: 100px;" >
   <div class="app-left">
      <div class="log-container">
      <!-- <span>加拉泰亚</span><span>▲</span><span>GM</span> -->
    </div>
    <div class="app-select-container">
      <el-dropdown trigger="click" @command ='peojectCommand' > 
        <span class="el-dropdown-link">
          {{currentGameName}}<i class="el-icon-caret-right el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(project, index) in games"  :key="index"  :command='project'  v-text="project"></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown trigger="click" @command ='peopleCommand'>
        <span class="el-dropdown-link">
          {{selectpeople}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(people) in peoplelist"  :key="people.id"  :command='people.name'  v-text="people.name"></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    </div>
    <div class="app-right">
      <div class="app-photo-container"><el-avatar :size='50'   :src="avatar"></el-avatar></div>
      <div class="app-time-container" style="color:white;"><span class="headertime">{{newTime}}</span><br><span  class="headerdate"  >{{newDate}}</span></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DFocus from '@/directive/d-focus';


let icnow = new Date();
let interval;
export default {
  name: 'Navbar',
  directives: { DFocus },
  components: {
  },
  props: {
  },
  data() {
    return {
      selectpeople: '',
      peoplelist: [
        {
          id: 1,
          name: 'GM'
        },
        {
          id: 2,
          name: '客服'
        },
        {
          id: 3,
          name: 'BP'
        },
        {
          id: 4,
          name: '上古纷争'
        }
      ],
      datedays: {
        year: icnow.getFullYear(),
        month: icnow.getMonth() + 1,
        date: icnow.getDate(),
        time: icnow.toTimeString().substring(0, 8)
      }
    };
  },
  computed: {
    ...mapGetters([
      'avatar',
      'nickName'
    ]),
    newDate: function() {
      return this.datedays.year + '年' + this.datedays.month + '月' + this.datedays.date + '日'
      
      
      ;
    },
    newTime: function() {
      return this.datedays.time;
    },
    games() {
      return this.$store.state.user.permissionInfo.games;
    },
    currentGameName() {
      return this.$store.state.user.permissionInfo.gamename;
    }
  },
  mounted() {
    this.selectpeople = this.peoplelist[0].name;
  },
  methods: {
    peojectCommand: function(command) {
      // 如果未发生改变则直接退出
      if (this.currentGameName === command) { return; }
      // 备份当前游戏名称
      sessionStorage.setItem('currentGameName', command);
      // 刷新页面
      location.reload();
    },
    peopleCommand: function(command) {
      this.selectpeople = command;
    }
  },
  created() {
    interval = setInterval(() =>{
      let icnow = new Date();
      this.datedays.year = icnow.getFullYear();
      this.datedays.month = icnow.getMonth() + 1;
      this.datedays.date = icnow.getDate();
      this.datedays.time = icnow.toTimeString().substring(0, 8);
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(interval);
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
$url: '../../';
$navbarHeight: 60px;
flex-row{
  display: flex;
  align-items: center;
  justify-content: center;
  
  
}

.app-header {
  background-image: url(../../styles/images/BANNER.png);
  background-size: cover;
  padding: 0;
  @extend flex-row;
  justify-content: space-between;
  
  .app-left {
    background-color: rgba(224,255,0,0.3);
    height: 100%;
    width: 428px;
     @extend flex-row;
     bgc
    .log-container {
      font-size: 27px;
      color: white;
      font-weight: 700;
      line-height: $navbarHeight;
      span+span{
        margin-left: 10px;
      }
    }
    .app-select-container {
      
      margin-left: -100px;
      .el-dropdown-link {
         color: white;
         font-size: 28px;
         cursor: pointer;
      }
    }
  }
  .app-right {
    background-color: rgba(143,184,190,0.5);
    height: 100%;
    width: 15%;
     @extend flex-row;
    .app-photo-container {

    }
    .app-time-container {
      margin-left: 10px;
      text-align-last: center;
    }
  }
  .headertime{
    font-size: 30px;
  
  }
  .headerdate{
    font-size: 20px;
  
  }
}
</style>
