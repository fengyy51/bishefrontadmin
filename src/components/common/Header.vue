<template>
    <div class="header">
        <router-link to="/home">
            <div class="logo">宾王158管理系统</div>
        </router-link>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo"src="../../../static/img/user.png"> {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="updatepwd">修改密码</el-dropdown-item>
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <!-- 模态框  :pivotY为垂直距离百分比 -->
        <modal name="updatepwd-modal" transition="pop-out" :height="380" :resizable="true" :pivotY="0.2">
            <div class="modal_close_btn">
                <i class="el-icon-close" @click="closeModal"></i>
            </div>
            <div class="modal-form">
                <el-form ref="ruleForm" label-width="80px" :rules="rules" :model="ruleForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="ruleForm.username" placeholder="用户名"  ></el-input>
                    </el-form-item>
                    <el-form-item label="新的密码" prop="password">
                        <el-input type="password" placeholder="新的密码" v-model="ruleForm.password" ></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="repassword">
                        <el-input type="password" placeholder="确认密码" v-model="ruleForm.repassword" ></el-input>
                    </el-form-item>
                    <el-form-item class="modal-btn-group">
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button @click="closeModal">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </modal>
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: 'binwang158',
            ruleForm: {
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
                repassword: [{
                    required: true,
                    message: '请输入确认密码',
                    trigger: 'blur'
                }],
            },
        }
    },
    computed: {
        username() {
            let username = this.$wsCache.get("username");
            return username ? username : this.name;
        }
    },
    methods: {
        closeModal() {
            this.$modal.hide('updatepwd-modal');
        },
        addModal() {
            this.$modal.show('updatepwd-modal');
        },
        onSubmit(){
            const self=this;
            self.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    var password = self.ruleForm.password;
                    var repassword=self.ruleForm.repassword;
                    if(password!=repassword) {
                        self.$message.error("两次输入的密码不一致，请重新输入！");
                    }else {
                        self.$axios({
                            url: '/update-pwd',
                            method: 'post',
                            params: {
                                username: self.ruleForm.username,
                                password: self.ruleForm.password
                            }
                        })
                            .then((res) => {
                                if (res != null && res.data.result)
                                    self.$message('修改成功!');
                                else
                                    self.$message.error("修改失败！");
                                self.$modal.hide('updatepwd-modal');
                            })
                    }
                }
            })
        },
        handleCommand(command) {
            if(command=='updatepwd'){
                this.addModal();
            }
            if (command == 'loginout') {
                this.$wsCache.delete('username');
                this.$router.push("/login");
            }
        }
    }
}
</script>
<style scoped>
    .modal_close_btn {
        width: 10px;
        float: right;
        margin: 15px 20px 0px 0;
        color: #999;
    }
    .el-icon-close:hover {
        color: #333;
        cursor: pointer;
    }
    .modal-form{
        margin-top: 90px;
    }
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
}

.header .logo {
    float: left;
    width: 250px;
    text-align: center;
    color: white;
}

.user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
}

.user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
}

.user-info .user-logo {
    position: absolute;
    left: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-dropdown-menu__item {
    text-align: center;
}
</style>
