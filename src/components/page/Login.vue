<template>
    <div class="login-wrap">
        <div class="ms-title">活动管理系统</div>
        <div class="ms-login" v-show="showLogin">
            <h3>登录</h3>
            <!--：model为绑定自定义属性model（v-bind:model="" ) v-model为数据双向绑定v-model是动态绑定值到value，然后监听input的input事件获取值后赋给dataA的一个过程。-->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <!--在 Vue 2.0 中，为自定义组件绑定原生事件必须使用 .native 修饰符： 当输入密码后监听回车事件-->
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" id="logbtn" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <div class="register-btn">
                    <span class="register-content" v-on:click="ToRegister">还没有账号？马上注册</span>
                </div>
            </el-form>
        </div>
        <div class="ms-login" v-show="showRegister">
            <h3>注册</h3>
            <!--：model为绑定自定义属性model（v-bind:model="" ) v-model为数据双向绑定v-model是动态绑定值到value，然后监听input的input事件获取值后赋给dataA的一个过程。-->
            <el-form :model="regForm" :rules="regrules" ref="regForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="regusername">
                    <el-input v-model="regForm.regusername" v-on:blur="isUsernameOk" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="regpassword">
                    <!--在 Vue 2.0 中，为自定义组件绑定原生事件必须使用 .native 修饰符： 当输入密码后监听回车事件-->
                    <el-input type="password" placeholder="密码" v-model="regForm.regpassword" ></el-input>
                </el-form-item>
                <el-form-item prop="regrepassword">
                    <!--在 Vue 2.0 中，为自定义组件绑定原生事件必须使用 .native 修饰符： 当输入密码后监听回车事件-->
                    <el-input type="password" placeholder="确认密码"  v-model="regForm.regrepassword"  @keyup.enter.native="submitReg('regForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" id="regbtn" @click="submitReg('regForm')">注册</el-button>
                </div>
                <div class="register-btn">
                    <span class="register-content" v-on:click="ToLogin">已有账号？马上登录</span>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            showLogin:true,
            showRegister:false,
            ruleForm: {
                username: '',
                password: ''
            },
            regForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
            },
            regrules:{
                regusername: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                regpassword: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                regrepassword: [{
                    required: true,
                    message: '请输入确认密码',
                    trigger: 'blur'
                }]
            }
        }
    },
    beforeCreate() {
        var self = this;
        self.$axios({
                url: '/is-maintaining',
                method: 'get'
            })
            .then((res) => {
                if (res.data) {
                    //项目正在维护
                    window.location.href = "./static/html/maintaining.html";
                }
            })
    },
    methods: {
        isUsernameOk(){
            const self=this;
            var userName = self.regForm.regusername;
            console.log(userName);
            if(userName!=''){
                self.$axios({
                    method: 'post',
                    url: '/is-username-ok',
                    data: {
                        username: userName,
                    }
                })
                //60为60s，localstorage过期后自动失效，本程序设置为1小时后自动失效，之后需要重新登录
                    .then(function(res) {
                        var code=res.code;
                        if(code==200){
                            var result=res.data.result;
                            if(result==false){
                                self.$message.error("用户名已被占用");
                            }
                        }else{
                            console.log(res);
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            }
        },
        ToRegister(){
            this.showRegister=true;
            this.showLogin=false;
        },
        ToLogin(){
            this.showRegister=false;
            this.showLogin=true;
        },
        submitForm(formName) {
            const self = this;
            document.getElementById('logbtn').disabled=true;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    var userName = self.ruleForm.username;
                    var password = self.ruleForm.password;

                    self.$axios({
                            method: 'post',
                            url: '/login',
                            data: {
                                username: userName,
                                password: password
                            }
                        })
                        //60为60s，localstorage过期后自动失效，本程序设置为1小时后自动失效，之后需要重新登录
                        .then(function(res) {
                            if (res != null && res.data.result) {
                                self.$wsCache.set("username", userName, {
                                    exp: 60 * 60
                                });
                                self.$router.push('/home');
                            } else
                            {
                                document.getElementById('logbtn').disabled=false;
                                self.$message.error("用户名或密码输入有误！");
                            }
                        })
                        .catch(function(error) {
                            document.getElementById('logbtn').disabled=false;
                            console.log(error);
                        });
                } else {
//                    弹出错误，Element 注册了一个$message方法用于调用，Message 可以接收一个字符串作为参数，它会被显示为正文内容。设置type字段可以定义不同的状态//
                    self.$message.error("输入有误");
                    document.getElementById('logbtn').disabled=false;
                    return false;
                }
            });
        },
        submitReg(formName) {
            const self = this;
            document.getElementById('regbtn').disabled=true;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    var userName = self.regForm.regusername;
                    var password = self.regForm.regpassword;
                    var repassword=self.regForm.regrepassword;
                    if(password!=repassword){
                        document.getElementById('regbtn').disabled=false;
                        self.$message.error("两次输入的密码不一致，请重新输入！");
                    }else{
                        self.$axios({
                            method: 'post',
                            url: '/register',
                            data: {
                                username: userName,
                                password: password
                            }
                        })
                            .then(function(res) {
                                if (res != null && res.data.result) {
                                    self.$message.info("注册成功！");
                                    self.ToLogin();
                                }else{
                                    document.getElementById('regbtn').disabled=false;
                                    self.$message.error("注册失败！");
                                }
                            })
                            .catch(function(error) {
                                document.getElementById('regbtn').disabled=false;
                                console.log(error);
                            });
                    }

                } else {
//                    弹出错误，Element 注册了一个$message方法用于调用，Message 可以接收一个字符串作为参数，它会被显示为正文内容。设置type字段可以定义不同的状态//
                    self.$message.error("输入有误");
                    document.getElementById('regbtn').disabled=false;
                    return false;
                }
            });
        }
    }
}
</script>
<style scoped>
.ms-login{
    padding: 30px 60px 120px 60px!important;
}
h3{
    margin-bottom: 10px;
    text-align: center;
}
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}

.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 180px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
}
.register-btn{
    margin-top: 15px;
}
.register-content{
    color: #20a0ff;
}
span{
    cursor: pointer;
}
span:hover{
    color:#41b883;
}
</style>
