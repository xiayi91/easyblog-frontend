<template>
  <div class="m-container">
    <Header></Header>
    <div class="mblog">
      <h2>{{ blog.title }}</h2>
      <el-link icon="el-icon-edit" v-if="ownBlog">
        <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}">Edit</router-link>
      </el-link>
      <el-divider></el-divider>
      <div class="content markdown-body" v-html="blog.content"></div>
    </div>

    <div>
      <span></span>
      <el-divider></el-divider>
      <span>Welcome to leave comments here~</span>
      <el-divider></el-divider>
    </div>

    <!--add a comment-->
    <div class="m-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="comment">
          <mavon-editor ref=md @imgAdd="imgAdd" language="en" v-model="ruleForm.comment"></mavon-editor>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">Confirm</el-button>
          <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--comments list-->
    <div class="block">
        <el-timeline>
          <el-timeline-item :timestamp="comment.created" placement="top" v-for="comment in comments" :key="comment.id">
            <el-card>
              <h4>{{ comment.userName}}</h4>
              <p>{{ comment.comment }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
    </div>
  </div>
</template>

<script>
import 'github-markdown-css/github-markdown.css'
import Header from "@/components/Header";
import axios from "axios";

export default {
  name: "BlogDetail",
  components: {
    Header
  },
  data() {
    return {
      blog: {
        userId: null,
        title: "",
        description: "",
        content: ""
      },
      ownBlog: false,
      //comment
      comments:{},
      ruleForm: {
        id: '',
        comment: '',
        blogId: ''
      },
      rules: {
        comment: [
          { trequired: true, message: 'Please enter content', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    page(id) {
      const _this = this
      this.ruleForm.comment = ""
      // comment
      _this.$axios.get("/comment/comment?id=" + id).then(res => {
        _this.comments = res.data.data

      })
    },

    getBlog() {
      const blogId = this.$route.params.blogId
      const _this = this
      this.$axios.get('/blog/' + blogId).then((res) => {
        console.log(res)
        console.log(res.data.data)
        _this.blog = res.data.data
        var MarkdownIt = require('markdown-it'),
            md = new MarkdownIt();
        var result = md.render(_this.blog.content);
        _this.blog.content = result
        // if it is users' own blog and if they can edit it.
        _this.ownBlog = (_this.blog.userId === _this.$store.getters.getUser.id)
        //comment list
        this.page(_this.blog.id);
      });
    },

    //add a comment
    submitForm(formName) {
      //
      if(!localStorage.getItem("token")){
        window.alert("Please login")
        return
      }
      if(this.ruleForm.comment === ""){
        window.alert("Please enter comment");
        return
      }
        this.ruleForm.blogId = this.blog.id
        console.log("ruleForm:")
        console.log(this.ruleForm)
        this.$refs[formName].validate((valid) => {
          console.log(valid)
          if (valid) {
            const _this = this
            this.$axios.post('/comment/edit', this.ruleForm, {
              headers: {
                "Authorization": localStorage.getItem("token")
              }
            }).then(res => {
              console.log(res)
              _this.$alert('Success', 'Note', {
                confirmButtonText: 'Confirm',
              });
              this.page(this.$route.params.blogId);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //bind @imgAdd event
    imgAdd(pos, $file){
      // upload pic to server.
      let formdata = new FormData();
      formdata.append('image', $file);
      axios({
        url: '/blog/uploadpic',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => {
        console.log(res)
        console.log(res.data.data.url)
        //第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        /**
         * $vm 指为mavonEditor实例，可以通过如下两种方式获取
         * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
         * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
         */
        this.$refs.md.$img2Url(pos, res.data.data.url)
      })
    },
  },
  created() {
    this.getBlog();
  }
}
</script>
