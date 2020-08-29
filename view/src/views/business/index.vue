<template>
  <div
id='business-index' class="business-index"    >
    <div class="welcome">
    欢迎{{username}}登录
  </div>
    
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
export default {
  name: 'business-index',
  data() {
    return {
      
    };
  },
  computed: {
    ...mapGetters([
      'avatar',
      'nickName',
      'username'
    ])
  },
  mounted() {
  },
  methods: {
  },
  created() {
  
  }
};
</script>

<style lang="scss"  rel="stylesheet/scss" >
.business-index{
 background-image: url(../../styles/images/backimage.png);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
    font-family: cursive;
  background-size: cover;
  /* margin: 0 0 5px 0; */
     height: 89.3vh;
  .welcome{
    font-size: 100px;
  }
}
#business-index{
     height: 89.3vh;
}
</style>
