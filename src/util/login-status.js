import { MessageBox } from 'element-ui';
import router from '../router';

var judgeStatus = function(to) {
    if (to == '/login')
        return true;
    var wsCache = window.$wsCache;
    if (wsCache.get("username")) {
        wsCache.touch('username', 60*60);
        return true;
    } else {
        MessageBox({
            message: '请重新登录',
            type: 'warning',
            showCancelButton: false
        }).then(function() {
            router.push("/login");
        });
    }
}

export default judgeStatus;
