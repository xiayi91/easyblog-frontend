import axios from 'axios'
import Element from 'element-ui'
import router from './router'
import store from './store'


axios.defaults.baseURL = "http://54.177.15.182:8081"
// axios.defaults.baseURL = "http://localhost:8081"

// interception
axios.interceptors.request.use(config => {
    return config
})

axios.interceptors.response.use(response => {
        let res = response.data;

        console.log("=================")
        console.log(res)
        console.log("=================")

        if (res.code === 200) {
            console.log("code=200,okay")
            return response
        } else {
            // pop up error
            console.log("code!=200,not okay")
            Element.Message({
                message: response.data.msg,
                type: 'error',
                duration: 2 * 1000
            })
            // reject to return response message
            return Promise.reject(response.data.msg)
        }
    },
    // error => {
    //     console.log(error)
    //     if(error.response.data) {
    //         error.message = error.response.data.msg
    //     }
    //
    //     if(error.response.status === 401) {
    //         store.commit("REMOVE_INFO")
    //         router.push("/login")
    //     }
    //
    //     Element.Message.error(error.message, {duration: 3 * 1000})
    //     return Promise.reject(error)
    // }
    error => {
        console.log('err' + error)// for debug
        if (error.response.data) {
            error.message = error.response.data.msg
        }
        // decide whether login or not based on response status
        if (error.response.status === 401) {
            store.commit('REMOVE_INFO');
            router.push({
                path: '/login'
            });
            error.message = 'Plz re-login';
        }
        if (error.response.status === 403) {
            error.message = 'No permission';
        }
        Element.Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error)
    }
)
