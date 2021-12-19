<template>
    <div>
        <Header></Header>
        <div class="m-content">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="title" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>

                <el-form-item label="abstract" prop="description">
                    <el-input type="textarea" v-model="ruleForm.description"></el-input>
                </el-form-item>

                <el-form-item label="content" prop="content">
                    <mavon-editor ref=md @imgAdd="imgAdd" language="en" v-model="ruleForm.content"></mavon-editor>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">Confirm</el-button>
                    <el-button @click="resetForm('ruleForm')">Reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Header from "../components/Header";
    import axios from "axios";
    export default {
        name: "BlogEdit.vue",
        components: {Header},
        data() {
            return {
                ruleForm: {
                    id: '',
                    title: '',
                    description: '',
                    content: ''
                },
                rules: {
                    title: [
                        { required: true, message: 'Please enter title', trigger: 'blur' },
                        { min: 3, max: 25, message: 'Title should be between 3 and 25 characters', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: 'Please enter abstract', trigger: 'blur' }
                    ],
                    content: [
                        { trequired: true, message: 'Please enter content', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const _this = this
                        this.$axios.post('/blog/edit', this.ruleForm, {
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        }).then(res => {
                            console.log(res)
                            _this.$alert('Success', 'Note', {
                                confirmButtonText: 'Confirm',
                            });
                          this.$router.push("/blogs")
                        })
                    } else {
                        console.log('error submit!!');
                        window.alert("Please fill in all required info")
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
          //绑定@imgAdd event
          imgAdd(pos, $file){
            // 第一步.将图片上传到服务器.
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
              // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
              /**
               * $vm 指为mavonEditor实例，可以通过如下两种方式获取
               * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
               * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
               */
              this.$refs.md.$img2Url(pos, res.data.data.url)
            })
          }
        },
        created() {
            const blogId = this.$route.params.blogId
            console.log("==============blogId")
            console.log(blogId)
            const _this = this
            if(blogId) {
                this.$axios.get('/blog/' + blogId).then(res => {
                    const blog = res.data.data
                    _this.ruleForm.id = blog.id
                    _this.ruleForm.title = blog.title
                    _this.ruleForm.description = blog.description
                    _this.ruleForm.content = blog.content
                })
            }
        }
    }
</script>

<style scoped>
    .m-content {
        text-align: center;
    }
</style>
