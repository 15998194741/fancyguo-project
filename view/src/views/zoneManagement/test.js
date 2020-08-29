// ()=> {
//   this.$confirm('是否继续2222?', '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning'
//   })

// const { generateCodeFrame } = require("vue-template-compiler");




//     .then(() => {
//       let serverCreateStatus = servercreate({ ...this.createForm, 'gamename': this.gamename, 'gameid': this.gameid }).then(res => {
//         if (res.code === 200) {
//           this.$message({
//             type: 'success',
//             message: '创建成功!'
//           });
//           this.$refs[formName].resetFields();
//           return Promise.resolve(true);
//         } else {
//           this.$message({
//             type: 'warning',
//             message: '创建失败!'
//           });
//           return Promise.resolve(false);
//         }
//       }
    
    
//       ).catch((error) => {
//       });
//       return Promise.resolve(serverCreateStatus);
//     });
// };



var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];


function generateCodeFrame() {
  var res = '';
  for (let i = 0; i < 10; i++) {
    var id = Math.ceil(Math.random() * 61);
    res += chars[id];
  }
  return res;
}

console.log(generateCodeFrame());
