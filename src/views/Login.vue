<template>
  <div>

    <el-container>
      <el-main>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" placeholder="username">
              <i slot="suffix" class="el-icon-user"/>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :type="flag?'text':'password'" v-model="ruleForm.password" placehorlder="password">
              <i slot="suffix" :class="[flag?'el-icon-minus':'el-icon-view']" @click="flag=!flag" autocomplete="auto"/>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">Login</el-button>
            <el-button @click="dialogVisible = true">Log up</el-button>
          </el-form-item>
        </el-form>

      </el-main>
    </el-container>

    <!--log up dialog-->
    <el-dialog
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose">

      <el-form :model="editForm" :rules="editFormRules" ref="editForm">
<!--        username-->
        <el-form-item prop="username">
          <el-input v-model="editForm.username" placeholder="Username">
            <i slot="suffix" class="el-icon-user"/>
          </el-input>
        </el-form-item>
<!--        password-->
        <el-form-item prop="password" placeholder="Password">
          <el-input :type="flag?'text':'password'" v-model="editForm.password" placehorlder="password">
            <i slot="suffix" :class="[flag?'el-icon-minus':'el-icon-view']" @click="flag=!flag" autocomplete="auto"/>
          </el-input>
        </el-form-item>
<!--        email-->
        <el-form-item prop="email">
          <el-input v-model="editForm.email" placeholder="Email" autocomplete="off">
            <i slot="suffix" class="el-icon-message"/>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('editForm')">Confirm</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // log up dialog
      dialogVisible: false,
      //password view
      flag:false,
      // avatar
      hideUpload: false,
      dialogImageUrl: '',
      formLabelWidth: '80px',
      limitNum: 1,
      //log up form
      editForm: {
        password:'111111'
      },
      //log in form
      ruleForm: {
        username: 'xiayi',
        password: '111111'
      },
      //log in rules
      rules: {
        username: [
          { required: true, message: 'Plz enter username', trigger: 'blur' },
          { min: 3, max: 15, message: 'range from 3 to 15 characters', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Plz enter password', trigger: 'change' }
        ]
      },
      //log up rules
      editFormRules: {
        username: [
          {required: true, message: 'Plz enter username', trigger: 'blur'}
        ],
        password: [
          { required: true, message: 'Plz enter password', trigger: 'blur' }
        ],
        email: [
          {required: true, message: 'Plz enter email', trigger: 'blur'}
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      if(formName === 'ruleForm'){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _this = this
            this.$axios.post('/login', this.ruleForm).then(res => {
              console.log(res.data)
              const jwt = res.headers['authorization']
              const userInfo = res.data.data

              _this.$store.commit("SET_TOKEN", jwt)
              _this.$store.commit("SET_USERINFO", userInfo)

              console.log(_this.$store.getters.getUser)
              _this.$router.push("/blogs")
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }else if(formName === 'editForm'){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const _this = this
            this.$axios.post('/user/save', this.editForm).then(res => {
              console.log(res.data)
              const userInfo = res.data.data
              //pop up->success
              _this.$alert('Success', 'Note', {
                confirmButtonText: 'Confirm',
              });

              _this.$store.commit("SET_USERINFO", userInfo)
              console.log(_this.$store.getters.getUser)
              //to blogs component
              _this.$router.push("/blogs")
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
      this.editForm = {password:'111111'}
    },

    handleClose() {
      this.resetForm('editForm')
    },
  }
}
</script>

<style scoped>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.el-main {
  /*background-color: #E9EEF3;*/
  color: #333;
  text-align: center;
  line-height: 160px;
}
body > .el-container {
  margin-bottom: 40px;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}
.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.mlogo {
  height: 60%;
  margin-top: 10px;
}
.demo-ruleForm {
  max-width: 500px;
  margin: 0 auto;
}
</style>
