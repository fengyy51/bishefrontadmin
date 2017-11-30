<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-date"></i>活动管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{ type_name }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="big_form">
            <el-form :model="actForm" :rules="rules" ref="actForm" label-width="85px" :inline="true" >
                <el-form-item label="活动名称" prop="name">
                    <el-input v-model="actForm.name" class="form_large"></el-input>
                </el-form-item>
                <el-form-item label="面向对象" prop="faceObj">
                    <el-radio-group v-model="actForm.faceObj">
                        <el-radio label="0">顾客</el-radio>
                        <el-radio label="1">商户</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否收费" prop="judgeCharge">
                    <el-radio-group v-model="actForm.judgeCharge" @change="judgeChargeChange">
                        <el-radio label="0">免费</el-radio>
                        <el-radio label="1">收费</el-radio>
                    </el-radio-group>
                </el-form-item>
                <br/>
                <el-form-item label="起始时间" prop="begin">
                    <el-date-picker v-model="tempBegin" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <br/>
                <el-form-item label="结束时间" prop="end">
                    <el-date-picker v-model="tempEnd" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <br/>
                <el-form-item label="报名截止" prop="regDeadLine">
                    <el-date-picker v-model="tempRegDeadLine" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <br/>
                <el-form-item label="举办地址" prop="loc_about">
                    <el-input v-model="actForm.loc_about" class="form_large"></el-input>
                </el-form-item>
                <el-form-item label="上限人数" prop="limitNum">
                    <el-input v-model="actForm.limitNum" class="form_small"></el-input>
                </el-form-item>
                <el-form-item label="活动费用" prop="cost">
                    <el-input v-model.number="actForm.cost" type="number" class="form_small" :disabled="isCost"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="宣传图">
                    <span style="color: #48576a;">(建议尺寸600*400)</span>
                    <SingleImg :img="actForm.broadCastImg" :actionUrl="imgUploadUrl" v-on:imgChange="broadCastImgChange" v-on:handleChange="handleBroadCastImgChange"></SingleImg>
                </el-form-item>
                <br/>
                <el-form-item label="报名填写项" prop="reg">
                    <el-checkbox-group v-model="actForm.reg" >
                        <el-checkbox label="姓名" name="reg"></el-checkbox>
                        <el-checkbox label="联系电话" name="reg"></el-checkbox>
                        <el-checkbox label="性别" name="reg"></el-checkbox>
                        <el-checkbox label="单位" name="reg"></el-checkbox>
                        <el-checkbox label="部门" name="reg"></el-checkbox>
                        <el-checkbox label="职务" name="reg"></el-checkbox>
                        <el-checkbox label="行业" name="reg"></el-checkbox>
                        <el-checkbox label="邮箱" name="reg"></el-checkbox>
                        <el-checkbox label="备注" name="reg"></el-checkbox>
                        <el-checkbox label="身份证" name="reg"></el-checkbox>
                        <el-checkbox label="地址" name="reg"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <br/>
                <el-form-item label="添加报名项" prop="reg_item" id="reg_item_content" >
                    <div id="reg_item"></div>
                    <el-button size="small" type="primary" @click="onAddInfo">管理自定义报名项</el-button>
                </el-form-item>
                <br/>
                <el-form-item label="活动详情">
                    <quill-editor ref="myTextEditor" v-model="actForm.content" :config="editorOption" @change="onEditorChange($event)"></quill-editor>
                </el-form-item>
                <br/>
                <el-form-item prop="description" label="活动规则">
                    <span style="color: red">您在分段落换行时请添加&lt;br&nbsp;/&gt;符号</span>
                    <el-input type="textarea"  id="designer_textarea" :autosize="{ minRows: 2, maxRows: 4}"   placeholder="请输入活动相关规则"  v-model="actForm.description">
                    </el-input>
                </el-form-item>
                <br/>
                <el-form-item class="submit_center_btn_form">
                    <el-button type="primary" @click="onSubmit" size="large" icon="edit">{{type_name}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import SingleImg from '../common/SingleImg.vue';
import {
    uploadImgUrl
} from '../../util/upload-helper.js';
import {
    TransDetailDateToString,
    TransDetailStringToDate
} from '../../util/date-helper.js';
import {
    quillEditor
} from 'vue-quill-editor';
import {
    ImageImport
} from '../../util/richText/ImageImport.js';
import {
    ImageResize
} from '../../util/richText/ImageResize.js';
import Vue from 'vue';
Quill.register('modules/imageImport', ImageImport);
Quill.register('modules/imageResize', ImageResize);
export default {
    data() {
            return {
                id: '',
                type_name: '',
                tempBegin: '',
                tempEnd: '',
                tempRegDeadLine: '',
                isCost: true,
                actForm: {
                    name: '',
                    begin: '',
                    end: '',
                    regDeadLine: '',
                    loc_about: '',
                    limitNum:'',
                    faceObj: "",
                    judgeCharge: "",
                    broadCastImg: "",
                    content: '',
                    cost: '',
                    reg:[],
                    description:'',
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    }],
                    begin: [{
                        required: true,
                        message: '请选择起始日期',
                        trigger: 'blur'
                    }],
                    end: [{
                        required: true,
                        message: '请选择结束日期',
                        trigger: 'blur'
                    }],
                    regDeadLine: [{
                        required: true,
                        message: '请选择报名截止日期',
                        trigger: 'blur'
                    }],
                    loc_about: [{
                        required: true,
                        message: '请输入举办地点',
                        trigger: 'blur'
                    }],
                    limitNum:[{
                        required: true,
                        message: '请输入人数上限',
                        trigger: 'blur'
                    }],
                    faceObj: [{
                        required: true,
                        message: '请选择面向对象',
                        trigger: 'blur'
                    }],
                    judgeCharge: [{
                        required: true,
                        message: '请选择是否收费',
                        trigger: 'blur'
                    }],
//                    reg:[{
//                        type: 'array',
//                        required:true,
//                        message:"请选择报名填写项",
//                        trigger:'change'
//                    }]
                },
                imgUploadUrl: uploadImgUrl,
                isBroadCastImgChange: false,
                isContentChange: false,
                isInit: true,
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{
                                'list': 'ordered'
                            }, {
                                'list': 'bullet'
                            }],
                            [{
                                'size': ['small', false, 'large', 'huge']
                            }],
                            [{
                                'header': [1, 2, 3, 4, 5, 6, false]
                            }],

                            [{
                                'color': []
                            }, {
                                'background': []
                            }],
                            [{
                                'font': []
                            }],
                            [{
                                'align': []
                            }],
                            ['video', 'image']
                        ],
                        history: {
                            delay: 1000,
                            maxStack: 50,
                            userOnly: false
                        },
                        imageImport: true,
                        imageResize: {
                            displaySize: true
                        }
                    }
                }
            }
        },
        mounted() {
            var id = this.$route.params.id
            this.type_name = id == 0 ? "发起活动" : "编辑活动";
            this.id = id;
            this.getRegItemList();
            if (id != 0){
                this.getData();
            }

        },
        computed: {
            editor() {
                return this.$refs.myTextEditor.quillEditor;
            }
        },
        watch: {
            tempBegin: function(val) {
                this.actForm.begin = TransDetailDateToString(val);
            },
            tempEnd: function(val) {
                this.actForm.end = TransDetailDateToString(val);
            },
            tempRegDeadLine: function(val) {
                this.actForm.regDeadLine = TransDetailDateToString(val);
            }
        },
        components: {
            'SingleImg': SingleImg,
            'quillEditor': quillEditor
        },
        //路由离开前判断图片组件是否有变化
        beforeRouteLeave(to, from, next) {
//            this.$message.error("请先保存修改！");
            if (this.isBroadCastImgChange) {
                this.$message.error("请先保存修改！");
                return false;
            } else
                next()
        },
        methods: {
            handleBlur(){
                this.$refs.input.setCurrentValue(this.currentValue);
            },
            linkToOtherUrl(id, url) {
                if (id == 0)
                    this.$router.push(url + "0");
                else
                    this.$router.push(url + id);
            },
            onAddInfo(){
                var id = this.$route.params.id;
                this.linkToOtherUrl(id,'/act-addinfo/');
            },
            onEditorChange({
                editor,
                html,
                text
            }) {
                if (this.isInit) {
                    this.isInit = false;
                } else {
                    this.isContentChange = true;
                }
                this.actForm.content = html;
            },
            judgeChargeChange() {
                if (this.actForm.judgeCharge == 0) {
                    this.actForm.cost = 0;
                    this.isCost = true;
                } else {
                    this.isCost = false;
                }
            },
            getRegItemList(){
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                this.$axios({
                    url:"/act/act_reg_list",
                    method:'get',
                    params:{
                        username:username
                    }
                })
                    .then((res)=>{
                        if(res.data.sum!=0){
                            var temstr ='<div class="el-checkbox-group">';
                            for(var i=0;i<res.data.sum;i++) {
//                                temstr+='<label class="el-checkbox"><span class="el-checkbox__input"><span class="el-checkbox__inner"></span><input type="checkbox" name="reg_item" class="el-checkbox__original" '+
//                                'value='+res.data.list[i].title +'></span><span class="el-checkbox__label">'+res.data.list[i].title+'</span></label>'
                                temstr+='<el-checkbox name="reg_item" label= '+res.data.list[i].title + ' v-model="checked" ></el-checkbox>';
                            }
                            temstr+='</div>';
                            var id = this.$route.params.id
                            if (id != 0){
                                var regItem=localStorage.getItem("regItem").split(',');
                                var RegList = Vue.extend({
                                    template: temstr,
                                    data(){
                                        return{checked:regItem}
                                    },
                                    watch:{
                                        checked:function (val) {
                                            localStorage.setItem("checked",val);
                                        }
                                    }

                                })
                            }else{
                                var RegList = Vue.extend({
                                    template: temstr,
                                    data(){
                                        return{checked:[]}
                                    },
                                    watch:{
                                        checked:function (val) {
                                            console.log(val);
                                            localStorage.setItem("checked",val);
                                        }
                                    },
                                    mounted(){
                                        localStorage.setItem("checked","");
                                    }

                                })
                            }
                            new RegList().$mount('#reg_item');
                        }
                    })
            },
            getData() {
                const self = this;
                self.$axios({
                        url: '/act/get',
                        method: 'post',
                        data: {
                            id: this.id
                        }
                    })
                    .then((res) => {
                        if (res != null) {
                            let obj = res.data;
                            console.log(obj);
                            self.actForm.name = obj.name;
                            self.actForm.faceObj = obj.faceObj + '';
                            self.actForm.judgeCharge = obj.judgeCharge + '';
                            self.tempBegin = obj.begin;
                            self.tempEnd = obj.end;
                            self.tempRegDeadLine = obj.regDeadLine;
                            self.actForm.begin = obj.begin;
                            self.actForm.end = obj.end;
                            self.actForm.regDeadLine = obj.regDeadLine;
                            self.actForm.loc_about = obj.locAbout;
                            self.actForm.limitNum = obj.limitNum.toString();
                            self.actForm.cost = obj.cost.toString();
                            console.log(self.actForm.limitNum);
                            console.log(self.actForm.cost);
                            self.actForm.broadCastImg = obj.broadCastImg;
                            self.actForm.content = obj.content;
                            self.actForm.reg=obj.reg.split('@@@');
                            var regItem=obj.regItem.split('@@@');
                            localStorage.setItem('regItem',regItem);
                            self.actForm.description=obj.description;
                        }
                    })
            },
            onSubmit() {
                const self = this;
                this.$refs["actForm"].validate((valid) => {
                    if (valid) {
                        if(self.actForm.begin>self.actForm.end){
                            this.$message.error("请填写正确的活动起止时间!");
                            return;
                        }
                        if(self.actForm.end<self.actForm.regDeadLine){
                            this.$message.error("报名截止时间应早于活动结束时间!");
                            return;
                        }
                        if (self.id == 0) {
                            if (!this.isCost && this.actForm.cost == '') {
                                this.$message.error("请填写活动费用!");
                                return;
                            }
                            var reg=self.actForm.reg.join('@@@');
                            var regItem=localStorage.getItem('checked').split(',').join('@@@');
                            var wsCache = window.$wsCache;
                            var username=wsCache.get("username");
                            //添加
                            self.$axios({
                                    url: '/act/add',
                                    method: 'post',
                                    data: {
                                        name: self.actForm.name,
                                        faceObj: self.actForm.faceObj,
                                        judgeCharge: self.actForm.judgeCharge,
                                        begin: self.actForm.begin,
                                        end: self.actForm.end,
                                        regDeadLine: self.actForm.regDeadLine,
                                        locAbout: self.actForm.loc_about,
                                        limitNum: parseInt(self.actForm.limitNum),
                                        cost: parseInt(self.actForm.cost),
                                        broadCastImg: self.actForm.broadCastImg,
                                        content: self.actForm.content,
                                        description:self.actForm.description,
                                        reg:reg,
                                        regItem:regItem,
                                        username:username
                                    }
                                })
                                .then((res) => {
                                    self.isBroadCastImgChange = false;
                                    self.contentChange = false;
                                    // 导航到新的url，并向history栈添加一个新的记录，当点击后退按钮时，则回到之前的url
                                    self.$router.push('/act-list');
                                })
                        } else {
                            //编辑
                            if (!this.isCost && this.actForm.cost == '') {
                                this.$message.error("请填写活动费用!");
                                return;
                            }
                            var reg=self.actForm.reg.join('@@@');
                            var regItem=localStorage.getItem('checked').split(',').join('@@@');

                            self.$axios({
                                    url: '/act/edit',
                                    method: 'post',
                                    data: {
                                        id: self.id,
                                        name: self.actForm.name,
                                        faceObj: self.actForm.faceObj,
                                        judgeCharge: self.actForm.judgeCharge,
                                        begin: self.actForm.begin,
                                        end: self.actForm.end,
                                        regDeadLine: self.actForm.regDeadLine,
                                        locAbout: self.actForm.loc_about,
                                        limitNum: self.actForm.limitNum,
                                        cost: self.actForm.cost,
                                        broadCastImg: self.actForm.broadCastImg,
                                        content: self.actForm.content,
                                        contentChange: self.isContentChange,
                                        description:self.actForm.description,
                                        reg:reg,
                                        regItem:regItem
                                    }
                                })
                                .then((res) => {
                                    self.$message("编辑成功");
                                    self.isBroadCastImgChange = false;
                                    self.contentChange = false;
                                    self.$router.push('/act-list');
                                })
                        }

                    }
                    else{
                        window.alert("表单提交失败");
                    }
                });
            },
            broadCastImgChange(img) {
                this.actForm.broadCastImg = img;
            },
            //监听宣传图是否变化
            handleBroadCastImgChange() {
                console.log("imgbian");
                this.isBroadCastImgChange = true;
            },

        }
}
</script>
<style type="text/css" scope>
#designer_textarea textarea {
    width: 650px!important;
    height: 180px!important;
}

.big_form .el-form-item__label {
    font-size: 12px;
}

.submit_center_btn_form {
    display: block!important;
    text-align: center!important;
}

.ql-toolbar.ql-snow {
    max-width: 420px;
    line-height: 16px !important;
}
.ql-container .ql-editor {
    min-height: 20em;
    padding-bottom: 1em;
    max-height: 27em;
    max-width: 420px !important;

}
    /*.el-checkbox{*/
        /*margin-left: 15px;*/
    /*}*/
    .form_flex{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        width: 100%;
    }

</style>
