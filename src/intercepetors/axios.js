import axios from 'axios'
import join from 'url-join'
import dayjs from 'dayjs'
import 'dayjs/locale/th'

const api = "http://191.20.110.4:8091/api" //Deploy to server
// const api = "http://localhost:8264/api" //Test Debug

export 
const LoginAPI={
    API_URL: api + "/Authenticate"
}
export 
const AuthenAPI={
    API_URL: "/Authenticate"
}
export 
const ViewAPI={
    API_URL: "/CreateSOs"
}
export
const DetailAPI={
    API_URL: "/DetailSO"
}
export
const CommentAPI={
    API_URL: "/Comment"
}
export
const MasterAPI={
    API_URL: "/Master"
}

axios.interceptors.request.use(async (config) => {
    // Do something before request is sent
    const token = await localStorage.getItem("accessToken")
    const expiration = localStorage.getItem("expiration")
    const expirationTime = dayjs(expiration).format('YYYY-MM-DD HH:mm')
    const DateNow = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
    
    if(expirationTime > DateNow) { //แนบ Token เพื่อ Authorize
        config.headers = {
            'Authorization' :'Bearer '+ token
        }
    }
    else {//ออกจากระบบเมื่ออายุ Token หมด
        localStorage.removeItem("accessToken");
        localStorage.removeItem("account");
        localStorage.removeItem("userID");
        localStorage.removeItem("user");
        localStorage.removeItem("roleID");
        localStorage.removeItem("expiration");
        window.location.href = "/";
        // window.location.reload(false);
    }
 
    config.url = join(api , config.url)
    return config
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
export const CallAPI = axios