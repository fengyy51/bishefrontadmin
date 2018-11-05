<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <router-link to="/vote-data-list">投票数据列表</router-link>
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{ type_name }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="big_form">
            <el-form :model="voteDataForm" :rules="rules" ref="voteDataForm" label-width="80px" :inline="true">
                <el-form-item label="投票活动序号" prop="actId">
                    <el-input v-model="voteDataForm.actId" class="form_large"></el-input>
                </el-form-item>
                <el-form-item label="作品内容" prop="content">
                    <el-input type="textarea" :rows="5" v-model="voteDataForm.content" class="form_large"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <MultiImg :imgArray="resources.voteDataImgs" :actionUrl="imgUploadUrl" v-on:imgsChange="voteDataImgsChange" v-on:handleChange="handleVoteDataImgsChange"></MultiImg>
                </el-form-item>
                <br/>
                <el-form-item class="submit_center_btn_form">
                    <el-button type="primary" @click="onSubmit" size="large" icon="edit">{{type_name}}</el-button>
                </el-form-item>
            </el-form>
            <!-- 地图模态框 -->
            <!--<modal name="map-modal" transition="pop-out" :height="780" :pivotY="0.2" :width="1000">-->
                <!--<div class="modal-form">-->
                    <!--<el-form ref="form" label-width="90px">-->
                        <!--<iframe :src="mapUrl" frameborder="0" height="700" width="100%"></iframe>-->
                        <!--<el-form-item class="modal-btn-group">-->
                            <!--<el-button type="primary" @click="okCloseMap">确认</el-button>-->
                            <!--<el-button @click="closeMap">取消</el-button>-->
                        <!--</el-form-item>-->
                    <!--</el-form>-->
                <!--</div>-->
            <!--</modal>-->
        </div>
    </div>
</template>
<script>
    import SingleImg from '../common/SingleImg.vue';
    import MultiImg from '../common/MultiImg.vue';
    import {
        uploadImgUrl
    } from '../../util/upload-helper.js';
    import {
        MessageBox
    } from 'element-ui';
    export default {
        data() {
            return {
                id: '',
                type_name: '',
                voteDataForm: {
                    content: '',
                    actId:''
                },
                rules: {
//                    content: [{
//                        required: true,
//                        message: '请输入作品相关内容',
//                        trigger: 'blur'
//                    }],

                },
                resources: {
                    voteDataImgs: []
                },
                imgUploadUrl: uploadImgUrl,
                isVoteDataImgsChange: false,
                actId:0
            }
        },
        mounted() {
            var id = this.$route.params.id
            this.type_name = id == 0 ? "添加" : "编辑";
            this.id = id;
            if (id != 0)
                this.getData();
        },

        components: {
            'SingleImg': SingleImg,
            'MultiImg': MultiImg
        },
        //路由离开前判断图片组件是否有变化
        beforeRouteLeave(to, from, next) {
            if ( this.isVoteDataImgsChange) {
                this.$message.error("请先保存修改！");
                return false;
            } else
                next()
        },
        methods: {
            voteDataImgsChange(img) {
                this.resources.voteDataImgs = img;
            },
            //监听照片组件是否变化
            handleVoteDataImgsChange() {
                this.isVoteDataImgsChange = true;
            },

            getData() {
                const self = this;
                self.$axios({
                    url: '/vote-data/get',
                    method: 'post',
                    data: {
                        id: this.id
                    }
                })
                    .then((res) => {
                        if (res != null) {
                            let obj = res.data;
                            self.voteDataForm.actId=obj.actId;
                            self.voteDataForm.content = obj.content;
                            let imgs = obj.voteDataImgs;
                            if(imgs.length>=1){
                                imgs[0]=imgs[0].slice(1);
                                let len=imgs[imgs.length-1].length;
                                imgs[imgs.length-1]=imgs[imgs.length-1].slice(0,len-1);
                            }
                            let _imgs = [];
                            for (let i=0;i<imgs.length;i++) {
                                let itemlen=imgs[i].length
                                let o = {
                                    url: imgs[i].slice(1,itemlen-1)
                                };
                                _imgs.push(o);
                            }
                            self.resources.voteDataImgs = _imgs;
                        }
                    })
            },
            onSubmit() {
                const self = this;
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                this.$refs["voteDataForm"].validate((valid) => {
                    if (valid) {
                        let voteDataImgs = [];
                        let imgs = self.resources.voteDataImgs;
                        for (let s in imgs) {
                            voteDataImgs.push(imgs[s].url);
                        }
                        if(self.voteDataForm.actId!=""){
                            self.actId=parseInt(self.voteDataForm.actId);
                        }
                        if (self.id == 0) {
                            //添加
                            self.$axios({
                                url: '/vote-data/add',
                                method: 'post',
                                data: {
                                    actId:self.actId,
                                    username:username,
                                    content: self.voteDataForm.content,
                                    voteDataImgs:JSON.stringify(voteDataImgs),

                                }
                            })
                                .then((res) => {
                                    self.isVoteDataImgsChange = false;
                                    if(res.data==true){
                                        self.$message("添加成功");
                                    }
                                    self.$router.push('/vote-data-list');
                                })
                        } else {
                            //编辑
                            self.$axios({
                                url: '/vote-data/edit',
                                method: 'post',
                                data: {
                                    id: self.id,
                                    actId:self.actId,
                                    content: self.voteDataForm.content,
                                    voteDataImgs:JSON.stringify(voteDataImgs)
                                }
                            })
                                .then((res) => {
                                    self.isVoteDataImgsChange = false;
                                    if(res.data==true){
                                        self.$message("编辑成功");
                                        self.$router.push('/vote-data-list');
                                    }
                                })
                        }

                    }
                });
            }
        }
    }
</script>
<style type="text/css" scope>
    .el-textarea {
        vertical-align: normal!important;
    }

    .big_form .el-form-item__label {
        font-size: 10px;
    }

    .submit_center_btn_form {
        display: block!important;
        text-align: center!important;
    }
</style>
