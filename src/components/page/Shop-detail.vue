<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <router-link to="/shop-list">店铺列表</router-link>
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{ type_name }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="big_form">
            <el-form :model="shopForm" :rules="rules" ref="shopForm" label-width="80px" :inline="true">
                <el-form-item label="店铺名称" prop="name">
                    <el-input v-model="shopForm.name" class="form_large"></el-input>
                </el-form-item>
                <el-form-item label="区" prop="area">
                    <el-select v-model="shopForm.area">
                        <el-option label="一区" :value="1"></el-option>
                        <el-option label="二区" :value="2"></el-option>
                        <el-option label="三区" :value="3"></el-option>
                        <el-option label="四区" :value="4"></el-option>
                        <el-option label="五区" :value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="楼层" prop="floor">
                    <el-select v-model="shopForm.floor">
                        <el-option label="一楼" :value="1"></el-option>
                        <el-option label="二楼" :value="2"></el-option>
                        <el-option label="三楼" :value="3"></el-option>
                        <el-option label="四楼" :value="4"></el-option>
                        <el-option label="五楼" :value="5"></el-option>
                    </el-select>
                </el-form-item>
                <!--隐藏域，iframe获取楼层信息 -->
                <input type="hidden" v-model="shopForm.floor" id="hidden_floor">
                <el-form-item label="位置信息" prop="loc_about">
                    <el-input type="textarea" v-model="shopForm.loc_about" class="textarea_full" :rows="2"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="keeper_name">
                    <el-input v-model="shopForm.keeper_name" class="form_middle"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="shopForm.phone" class="form_middle"></el-input>
                </el-form-item>
                <el-form-item label="地图关联" prop="loc_about_id">
                    <el-switch on-text="关闭地图" off-text="开启地图" v-model="mapSwitch" off-color="#13ce66" on-color="#ff4949" @change="mapSwitchHandle" :width="90"></el-switch>
                    <input ref="relation_loc" v-model="shopForm.loc_about_relation" style="width:205px" disabled="true" id="relation_loc"></input>
                </el-form-item>
                <br/>
                <el-form-item label="基本信息">
                    <el-input type="textarea" v-model="shopForm.shop_about" class="textarea_full" :rows="4"></el-input>
                </el-form-item>
                <el-form-item label="店铺照片">
                    <MultiImg :imgArray="resources.shopImgs" :actionUrl="imgUploadUrl" v-on:imgsChange="shopImgsChange" v-on:handleChange="handleShopImgsChange"></MultiImg>
                </el-form-item>
                <br/>
                <el-form-item label="公众号" id="qr_el_item_div">
                    <SingleImg :img="shopForm.qr_code_url" :actionUrl="imgUploadUrl" v-on:imgChange="qrUrlChange" v-on:handleChange="handleQrUrlChange"></SingleImg>
                </el-form-item>
                <br/>
                <el-form-item class="submit_center_btn_form">
                    <el-button type="primary" @click="onSubmit" size="large" icon="edit">{{type_name}}</el-button>
                </el-form-item>
            </el-form>
            <!-- 地图模态框 -->
            <modal name="map-modal" transition="pop-out" :height="780" :pivotY="0.2" :width="1000">
                <div class="modal-form">
                    <el-form ref="form" label-width="90px">
                        <iframe :src="mapUrl" frameborder="0" height="700" width="100%"></iframe>
                        <el-form-item class="modal-btn-group">
                            <el-button type="primary" @click="okCloseMap">确认</el-button>
                            <el-button @click="closeMap">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </modal>
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
                mapSwitch: false,
                mapUrl: '',
                shopForm: {
                    name: '',
                    area: '',
                    floor: '',
                    shop_about: '',
                    loc_about: '',
                    keeper_name: '',
                    phone: '',
                    qr_code_url: '',
                    loc_about_relation: ''
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请输入店铺名称',
                        trigger: 'blur'
                    }],
                    area: [{
                        required: true,
                        type: 'number',
                        message: '请选择区',
                        trigger: 'change'
                    }],
                    floor: [{
                        required: true,
                        type: 'number',
                        message: '请选择楼层',
                        trigger: 'change'
                    }],
                    loc_about: [{
                        required: true,
                        message: '请输入位置信息',
                        trigger: 'blur'
                    }],
                    keeper_name: [{
                        required: true,
                        message: '请输入负责人',
                        trigger: 'blur'
                    }],
                    phone: [{
                        required: true,
                        message: '请输入联系方式',
                        trigger: 'blur'
                    }],
                    loc_about_realtion: [{
                        required: true,
                        message: '请关联地图',
                        trigger: 'blur'
                    }]
                },
                resources: {
                    shopImgs: []
                },
                imgUploadUrl: uploadImgUrl,
                isQrUrlChange: false,
                isShopImgsChange: false
            }
        },
        mounted() {
            var id = this.$route.params.id
            this.type_name = id == 0 ? "添加" : "编辑";
            this.id = id;
            if (id != 0)
                this.getData();
        },
        watch: {

        },
        components: {
            'SingleImg': SingleImg,
            'MultiImg': MultiImg
        },
        //路由离开前判断图片组件是否有变化
        beforeRouteLeave(to, from, next) {
            if (this.isQrUrlChange || this.isShopImgsChange) {
                this.$message.error("请先保存修改！");
                return false;
            } else
                next()
        },
        methods: {
            mapSwitchHandle() {
                this.mapSwitch ? false : true;
                if (this.mapSwitch) {
                    if (this.shopForm.floor == '') {
                        //楼层未选择
                        this.$message.error("请先选择楼层");
                        this.mapSwitch = false;
                        return;
                    }
                    this.$modal.show('map-modal');
                    this.mapUrl = './static/map/map_shop.html';
                } else
                    this.$modal.hide('map-modal');

            },
            shopImgsChange(img) {
                this.resources.shopImgs = img;
            },
            qrUrlChange(img) {
                this.shopForm.qr_code_url = img;
            },
            //监听店铺照片组件是否变化
            handleShopImgsChange() {
                this.isShopImgsChange = true;
            },
            //监听二维码组件是否变化
            handleQrUrlChange() {
                this.isQrUrlChange = true;
            },
            okCloseMap() {
                this.mapSwitch = false;
                this.shopForm.loc_about_relation = this.$refs.relation_loc.value;
                this.$modal.hide('map-modal');
            },
            closeMap() {
                this.mapSwitch = false;
                this.$refs.relation_loc.value = this.shopForm.loc_about_relation;
                this.$modal.hide('map-modal');
            },
            getData() {
                const self = this;
                self.$axios({
                        url: '/shop/get',
                        method: 'post',
                        data: {
                            id: this.id
                        }
                    })
                    .then((res) => {
                        if (res != null) {
                            let obj = res.data;
                            self.shopForm.name = obj.name;
                            self.shopForm.area = obj.area;
                            self.shopForm.floor = obj.floor;
                            self.shopForm.shop_about = obj.shopAbout;
                            self.shopForm.loc_about = obj.locAbout;
                            self.shopForm.keeper_name = obj.keeperName;
                            self.shopForm.phone = obj.phone;
                            self.shopForm.qr_code_url = obj.qrCodeUrl;
                            self.shopForm.loc_about_relation = obj.locAboutRelation;
                            let imgs = obj.shopImgs;
                            let _imgs = [];
                            for (let i in imgs) {
                                let o = {
                                    url: imgs[i]
                                };
                                _imgs.push(o);
                            }
                            self.resources.shopImgs = _imgs;
                        }
                    })
            },
            onSubmit() {
                const self = this;
                this.$refs["shopForm"].validate((valid) => {
                    if (valid) {
                        let shopImgs = [];
                        let imgs = self.resources.shopImgs;
                        for (let s in imgs) {
                            shopImgs.push(imgs[s].url);
                        }
                        if (self.id == 0) {
                            //添加
                            self.$axios({
                                    url: '/shop/add',
                                    method: 'post',
                                    data: {
                                        name: self.shopForm.name,
                                        area: self.shopForm.area,
                                        floor: self.shopForm.floor,
                                        shopAbout: self.shopForm.shop_about,
                                        locAbout: self.shopForm.loc_about,
                                        keeperName: self.shopForm.keeper_name,
                                        phone: self.shopForm.phone,
                                        qrCodeUrl: self.shopForm.qr_code_url,
                                        locAboutRelation: self.shopForm.loc_about_relation,
                                        shopImgs: shopImgs
                                    }
                                })
                                .then((res) => {
                                    self.isQrUrlChange = false;
                                    self.isShopImgsChange = false;
                                    self.$router.push('/shop-list');
                                })
                        } else {
                            //编辑
                            self.$axios({
                                    url: '/shop/edit',
                                    method: 'post',
                                    data: {
                                        id: self.id,
                                        name: self.shopForm.name,
                                        area: self.shopForm.area,
                                        floor: self.shopForm.floor,
                                        shopAbout: self.shopForm.shop_about,
                                        locAbout: self.shopForm.loc_about,
                                        keeperName: self.shopForm.keeper_name,
                                        phone: self.shopForm.phone,
                                        qrCodeUrl: self.shopForm.qr_code_url,
                                        locAboutRelation: self.shopForm.loc_about_relation,
                                        shopImgs: shopImgs,
                                        shopImgsChange: self.isShopImgsChange
                                    }
                                })
                                .then((res) => {
                                    self.isShopImgsChange = false;
                                    self.isQrUrlChange = false;
                                    self.$router.push('/shop-list');
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
