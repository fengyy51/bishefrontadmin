import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import router from '../router';
import {baseUrl} from './common-helper.js'


axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = baseUrl;
// axios.defaults.withCredentials = true;


axios.interceptors.request.use((config) => {
    config.data = qs.stringify(config.data);
    return config;
});

//code状态码200判断
axios.interceptors.response.use((res) => {
    if (res.data.code == '500') {
        Message.error(res.data.error.msg);
        return null;
    }
    return res.data;
}, (error) => {
    Message.error("网络异常");
    return Promise.reject(error);
});

export default axios;
