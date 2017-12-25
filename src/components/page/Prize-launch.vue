<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-date"></i>抽奖活动管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{ type_name }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="big_form">
            <el-form ref="prizeForm" :model="prizeForm" :rules="rules" label-width="80px" >
                <el-form-item label="活动名称" prop="act_name">
                    <el-input v-model="prizeForm.act_name"  class="form_large"></el-input>
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
                <el-form-item label="兑奖码" prop="code">
                    <el-input v-model="prizeForm.code" class="form_middle"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="每天抽奖次数" prop="prize_num">
                    <el-input v-model="prizeForm.prize_num"  class="form_small"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="分享是否增加次数" prop="share_num">
                    <el-switch
                        v-model="prizeForm.share_num"
                        on-text="是" off-text="否"
                        on-color="#13ce66"
                        off-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <br/>
                <el-form-item label="每天抽奖次数上限" prop="prize_max_num">
                    <el-input v-model="prizeForm.prize_max_num"  class="form_small"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="抽奖活动规则说明" prop="prizedecoration">
                    <span style="color: red">您在分段落换行时请添加&lt;br&nbsp;/&gt;符号</span>
                    <br/>
                    <el-input
                        class="form_large"
                        id="prizedecoration"
                        type="textarea"
                        :rows="2"
                        :autosize="true"
                        placeholder="请输入抽奖规则说明"
                        v-model="prizeForm.prizedecoration">
                    </el-input>
                </el-form-item>
                <br/>
                <el-form-item label="顶部宣传图">
                    <span style="color: #48576a;">(建议尺寸600*400，500k以内)</span>
                    <SingleImg :img="prizeForm.topImg" :actionUrl="imgUploadUrl" v-on:imgChange="topImgChange" v-on:handleChange="handleTopImgChange"></SingleImg>
                </el-form-item>
                <br/>
                <el-form-item label="奖项列表图">
                    <span style="color: #48576a;">(建议尺寸600*400，500k以内)</span>
                    <SingleImg :img="prizeForm.prizelistImg" :actionUrl="imgUploadUrl" v-on:imgChange="prizelistImgChange" v-on:handleChange="handlePrizelistImgChange"></SingleImg>
                </el-form-item>
                <br/>
                <el-form-item label="背景颜色">
                    <colorPicker v-model="prizeForm.color" v-on:change="headleChangeColor"></colorPicker>
                </el-form-item>
                <br/>
                <el-form-item class="submit_center_btn_form">
                    <el-button type="primary" @click="onSubmit" size="large" icon="edit">{{ type_name }}</el-button>
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
                prizeForm: {
                    act_name:'',
                    begin:'',
                    end:'',
                    code:'',
                    prize_num: '',
                    share_num: true,
                    prize_max_num:'',
                    prizedecoration: '',
                    topImg: "",
                    prizelistImg:"",
                    color: '#f00',//背景颜色
                },
                rules: {
                    act_name: [{
                        required: true,
                        message: '请填写活动名称',
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
                    code: [{
                        required: true,
                        message: '请填写兑奖码',
                        trigger: 'blur'
                    }],
                    prize_num: [{
                        required: true,
                        message: '请设定每天抽奖次数',
                        trigger: 'blur'
                    }],
                    prize_max_num: [{
                        required: true,
                        message: '请设定每天抽奖次数上限',
                        trigger: 'blur'
                    }],
                    prizedecoration: [{
                        required: true,
                        message: '请填写抽奖规则',
                        trigger: 'blur'
                    }]
                },
                imgUploadUrl: uploadImgUrl,
                isTopImgChange: false,
                isPrizelistImgChange:false,
            }
        },
        mounted() {
            var id = this.$route.params.id;
            this.type_name = id == 0 ? "发起抽奖活动" : "编辑抽奖活动";
            this.id = id;
            if (id != 0){
                this.getData();
            }
        },
        watch: {
            tempBegin: function(val) {
                this.prizeForm.begin = TransDetailDateToString(val);
            },
            tempEnd: function(val) {
                this.prizeForm.end = TransDetailDateToString(val);
            },
        },
        components: {
            'SingleImg': SingleImg,
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
            headleChangeColor (color) {
                this.prizeForm.color=color;
            },
            onSubmit() {
                const self=this;
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                self.$refs["prizeForm"].validate((valid) => {
                    if (valid) {
                        if(self.prizeForm.begin>self.prizeForm.end){
                            this.$message.error("请填写正确的活动起止时间!");
                            return;
                        }
                        if (self.id == 0) {
                            self.$axios({
                                url: '/prize/post-prize-param',
                                method: 'post',
                                params: {
                                    name: self.prizeForm.act_name,
                                    begin: self.prizeForm.begin,
                                    end: self.prizeForm.begin,
                                    code: self.prizeForm.code,
                                    prizeNum: parseInt(self.prizeForm.prize_num),
                                    shareNum: self.prizeForm.share_num,
                                    prizeMaxNum: parseInt(self.prizeForm.prize_max_num),
                                    prizeDecoration: self.prizeForm.prizedecoration,
                                    username: username,
                                    topImg: self.prizeForm.topImg,
                                    prizelistImg: self.prizeForm.prizelistImg,
                                    color:self.prizeForm.color,

                                }
                            })
                                .then((res) => {
                                    if (res != null && res.data.result){
                                        self.$message('发起成功!');
                                        self.$router.push('/prize-list');
                                    }
                                    else
                                        self.$message.error("发起失败！");
                                })
                        }else{
                            self.$axios({
                                url:'/prize/edit-prize-param',
                                method:'post',
                                params:{
                                    id:this.$route.params.id,
                                    name:self.prizeForm.act_name,
                                    begin:self.prizeForm.begin,
                                    end:self.prizeForm.end,
                                    code:self.prizeForm.code,
                                    prizeNum:parseInt(self.prizeForm.prize_num),
                                    shareNum:self.prizeForm.share_num,
                                    prizeMaxNum:parseInt(self.prizeForm.prize_max_num),
                                    prizeDecoration:self.prizeForm.prizedecoration,
                                    topImg: self.prizeForm.topImg,
                                    prizelistImg: self.prizeForm.prizelistImg,
                                    color:self.prizeForm.color,
                                }
                            })
                                .then((res) => {
                                    if (res != null && res.data.result){
                                        self.$message('编辑成功!');
                                        self.isTopImgChange = false;
                                        self.isPrizelistImgChange = false;
                                        self.$router.push('/prize-list');
                                    }
                                    else
                                        self.$message.error("编辑失败！");
                                })
                        }
                    }
                })
            },
            getData(){
                var id = this.$route.params.id;
                this.prizeForm.act_name='';
                this.tempBegin='';
                this.tempEnd='';
                this.prizeForm.code='';
                this.prizeForm.prize_num='';
                this.prizeForm.share_num='';
                this.prizeForm.prize_max_num='';
                this.prizeForm.prizedecoration='';
                this.prizeForm.topImg="";
                this.prizeForm.prizelistImg="";

                this.$axios({
                    url:'/prize/get-prize-param',
                    method:'get',
                    params:{
                        id:id,
                    }
                })
                    .then((res) => {
                            this.prizeForm.act_name=res.data.name,
                            this.tempBegin=res.data.begin,
                            this.tempEnd=res.data.end,
                            this.prizeForm.code=res.data.code,
                            this.prizeForm.prize_num=res.data.prizeNum.toString(),
                            this.prizeForm.share_num=res.data.shareNum,
                            this.prizeForm.prize_max_num=res.data.prizeMaxNum.toString(),
                            this.prizeForm.prizedecoration=res.data.prizeDecoration;
                            if(res.data.topImg!=null){
                                this.prizeForm.topImg=res.data.topImg;
                            }
                            if(res.data.prizelistImg!=null){
                                this.prizeForm.prizelistImg=res.data.prizelistImg;
                            }
                            if(res.data.color!=null){
                                this.prizeForm.color=res.data.color;
                            }

                    })
            },

            topImgChange(img) {
                this.prizeForm.topImg = img;
            },
            prizelistImgChange(img) {
                this.prizeForm.prizelistImg = img;
            },
            //监听图是否变化
            handleTopImgChange() {
                console.log("imgbian");
                this.isTopImgChange = true;
            },
            handlePrizelistImgChange(){
                this.isPrizelistImgChange=true;
            }

        }
    }
</script>
<style type="text/css" scope>
    #prizedecoration textarea {
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
