<template>
    <div class="m-content">
        <h3>Let's edit our blogs</h3>
        <div class="block">
            <el-avatar :size="100" :src="user.avatar"></el-avatar>
            <div>{{ user.username }}</div>
        </div>

        <div class="maction">
            <span><el-link @click="routerLink(0)">Home page</el-link></span>
            <el-divider direction="vertical"></el-divider>
            <span><el-link type="success" @click="routerLink(1)">New blog</el-link></span>
            <el-divider direction="vertical"></el-divider>
            <span v-show="!hasLogin"><el-link type="primary" @click="routerLink(2)">Login</el-link></span>
            <span v-show="hasLogin"><el-link type="danger" @click="logout">Log out</el-link></span>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
                user: {
                    username: 'Please login',
                    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                },
                hasLogin: false
            }
        },
        methods: {
            logout() {
                const _this = this
                _this.$axios.get("/logout", {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                  if(res.config === "1"){
                    console.log("11")
                  }
                    _this.$store.commit("REMOVE_INFO")
                    _this.$router.push("/login")
                })
            },
          routerLink(temp){
            const _this = this
            if(temp === 0){
              _this.$router.push("/blogs")
            }else if(temp === 1){
              _this.$router.push("/blog/add")
            }else if(temp === 2){
              _this.$router.push("/login")
            }

          },
        },
        created() {
          console.log("===============username")
          console.log(this.$store.getters.getUser.username)
            if(this.$store.getters.getUser.username) {
                this.user.username = this.$store.getters.getUser.username
                this.user.avatar = this.$store.getters.getUser.avatar
                this.hasLogin = true
            }
        }
    }
</script>

<style scoped>
    .m-content {
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
    }
    .maction {
        margin: 10px 0;
    }
</style>
