<template>
    <div>
        <div class="search_form">
            <el-form ref="search_form" :model="search_form">
                <el-form-item>
                    <div class="collect_top_num_div">
                        <p class="collect_top_p">审核通过&nbsp;&nbsp;</p>
                        <el-tag type="danger" class="collect_top_tag">{{approved_num}}</el-tag>
                    </div>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-radio-group v-model="search_form.type">
                        <el-radio class="radio" :label="-1">全部</el-radio>
                        <el-radio class="radio" :label="1">已审核</el-radio>
                        <el-radio class="radio" :label="0">未审核</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-button type="success" @click="searchHandle">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="top-btn">
            <el-button type="primary" @click="openFirstImgModal">上传首屏展示图</el-button>
        </div>
        <div class="top-btn top-btn-right">
            <el-button type="success" @click="openMulImgModal">上传详情图</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading.body="loading">
            <template>
                <el-table-column label="序号" prop="id" :formatter="formatter_id">
                </el-table-column>
                <el-table-column label="图片详情" prop="detail">
                    <template scope="scope">
                        <el-button type="success" @click="handleDetail(scope.row.id)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <div v-if="scope.row.isOk == 0">
                            <el-button type="info" @click="handleReq(scope.row.id,1)">去通过</el-button>
                        </div>
                        <div v-else>
                            <el-button :plain="true" type="info" @click="handleReq(scope.row.id,0)">取消通过</el-button>
                        </div>
                    </template>
                </el-table-column>
                <template v-for="(item,index) in regItem" >
                    <el-table-column   v-if="item.title" prop="item.title" :label="item.title" :formatter="formatter_items">
                    </el-table-column>
                </template>

            </template>

                <!--<el-table-column label="操作">-->
                    <!--<template scope="scope">-->
                        <!--<div v-if="scope.row.isOk == 0">-->
                            <!--<el-button type="info" @click="handleReq(scope.row.id,1)">去通过</el-button>-->
                        <!--</div>-->
                        <!--<div v-else>-->
                            <!--<el-button :plain="true" type="info" @click="handleReq(scope.row.id,0)">取消通过</el-button>-->
                        <!--</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->


        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :pageSize="pageSum" layout="prev, pager, next" :total="sum">
            </el-pagination>
        </div>
        <!-- 首屏上传模态框 -->
        <modal name="first-img-modal" transition="pop-out" :height="420" :pivotY="0.2">
            <div class="modal-form">
                <el-form ref="first-img-form" label-width="90px">
                    <el-form-item label="序号">
                        <el-input type="text" v-model="firstImgForm.id" class="form_small"></el-input>
                    </el-form-item>
                    <el-form-item label="首屏图片">
                        <div>
                            <el-tag type="gray">请上传宽高比4:3图片</el-tag>
                        </div>
                        <br/>
                        <SingleImg :img="firstImgForm.url" :actionUrl="imgUploadUrl" v-on:imgChange="firstImgChange" :size43="true"></SingleImg>
                    </el-form-item>
                    <el-form-item class="modal-btn-group">
                        <el-button type="primary" @click="onFirstImgSubmit">提交</el-button>
                        <el-button @click="closeFirstImgModal">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </modal>
        <!-- 详情上传模态框 -->
        <modal name="detail-img-modal" transition="pop-out" :width="1000" :height="550" :pivotY="0.2">
            <div class="modal-form">
                <el-form ref="detail-img-form" label-width="90px">
                    <el-form-item label="序号">
                        <el-input type="text" v-model="detailImgForm.id" class="form_small"></el-input>
                    </el-form-item>
                    <el-form-item label="详情图片组">
                        <MultiImg :imgArray="detailImgForm.urls" :actionUrl="imgUploadUrl" v-on:imgsChange="detailImgChange"></MultiImg>
                    </el-form-item>
                    <el-form-item class="modal-btn-group">
                        <el-button type="primary" @click="onDetailImgSubmit">提交</el-button>
                        <el-button @click="closeDetailImgModal">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </modal>
        <!-- 详情模态框 -->
        <modal name="collect-modal" transition="pop-out" :pivotY="0.2" :height="600" :resizable="true" :width="800">
            <div class="modal_close_btn">
                <i class="el-icon-close" @click="closeModal"></i>
            </div>
            <div class="modal-form">
                <el-form label-width="90px">
                    <el-form-item label="作品集">
                        <div>
                            <el-tag type="gray">点击图片查看大图</el-tag>
                        </div>
                        <br/>
                        <div v-for="item in detail.imgList" class="detail_img_list_div ">
                            <span class="green"> {{item.type}}</span>
                            <img :src="item.src" :title="item.type" class="image detail_img_div" @click="handleImgPreview(item.src)">

                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </modal>
    </div>
</template>
<script>
import {
    MessageBox
} from 'element-ui';
import SingleImg from '../common/SingleImg.vue';
import MultiImg from '../common/MultiImg.vue';
import {
    uploadImgUrl
} from '../../util/upload-helper.js';
export default {
    data() {
        return {
            search_form: {
                type: -1
            },
            regItem:[],
            tableData: [],
            pageSum: 10,
            sum: 0,
            cur_page: 1,
            loading: false,
            approved_num: 0,
            loading: false,
            detail: {
                name: '',
                recUnit: '',
                mobile: '',
                brandName: '',
                imgList: [],
                intro: ''
            },
            firstImgForm: {
                id: '',
                url: ''
            },
            detailImgForm: {
                id: '',
                urls: ''
            },
            imgUploadUrl: uploadImgUrl
        }
    },
    mounted() {
        this.getData();
    },
    components: {
        'SingleImg': SingleImg,
        'MultiImg': MultiImg
    },
    methods: {
        formatter_id(row,column){
            return row["id"];
        },
        formatter_items(row,column){
            if(row[column.label].indexOf('http')>-1){
                localStorage.setItem(column.label,column.label);
            }
            return row[column.label];
        },
        openFirstImgModal() {
            this.firstImgForm.id = '';
            this.firstImgForm.url = '';
            this.$modal.show('first-img-modal');
        },
        closeFirstImgModal() {
            this.$modal.hide('first-img-modal');
        },
        firstImgChange(img) {
            this.firstImgForm.url = img;
        },
        openMulImgModal() {
            this.detailImgForm.id = '';
            this.detailImgForm.urls = '';
            this.$modal.show('detail-img-modal');
        },
        detailImgChange(img) {
            this.detailImgForm.urls = img;
        },
        onDetailImgSubmit() {
            let id = this.detailImgForm.id;
            let urls = this.detailImgForm.urls;
            let imgs = '';
            for (let s in urls) {
                imgs = urls[s].url + '@@@' + imgs;
            }
            this.$axios({
                    url: '/collect/post-detail-img',
                    method: 'post',
                    params: {
                        id: id,
                        urls: imgs
                    }
                })
                .then((res) => {
                    if (res != null && res.data.result)
                        this.$message('修改成功!');
                    else
                        this.$message.error("修改失败！请确保序号对应");
                    this.$modal.hide('detail-img-modal');
                })
        },
        closeDetailImgModal() {
            this.$modal.hide('detail-img-modal');
        },
        onFirstImgSubmit() {
            var id = this.firstImgForm.id;
            var url = this.firstImgForm.url;
            const self = this;
            self.$axios({
                    url: '/collect/post-first-img',
                    method: 'post',
                    params: {
                        id: id,
                        url: url
                    }
                })
                .then((res) => {
                    if (res != null && res.data.result)
                        self.$message('修改成功!');
                    else
                        self.$message.error("修改失败！请确保序号对应");
                    self.$modal.hide('first-img-modal');
                })
        },
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        getData() {
            var collectId = this.$route.params.id;
            const self = this;
            self.$axios({
                    url: '/collect/list',
                    method: 'get',
                    params: {
                        type: self.search_form.type,
                        collectId: collectId,
                        curPage: self.cur_page,
                        pageSum: self.pageSum
                    }
                })
                .then((res) => {
                    if (res != null) {
                        var list=res.data.list;
                        for(var i=0;i<list.length;i++){
                            var data={};
                            data.id=list[i].id;
                            data.isOk=list[i].isOk;
//                            console.log(self.regItem);
                            var reglist=list[i].regItem.split(';');
                            for(var j=0;j<=reglist.length;j++){
                                if(reglist[j]!=undefined){
                                    console.log(reglist[j]);
                                    var regarr=reglist[j].split('?');
                                    var regDetail=regarr[0];
                                    var regVal=regarr[1];
//                                console.log(regDetail);
                                    data[regDetail]=regVal;
                                    var regstr={};
//                                regstr[regDetail]=regVal;
                                    regstr.title=regDetail;
//                                regstr.value=regVal;
                                    self.regItem[j]=regstr;

                                }

                            }
                            data.sum = res.data.sum;
                            data.approved_num = res.data.approveSum;
                            self.tableData.push(data);
                        }
//                        console.log(self.tableData);

                    }
                })
        },
        handleImgPreview(url) {
            window.open(url);
        },
        searchHandle() {
            this.getData();
        },
        handleDetail(id) {
            var collectId = this.$route.params.id;
            const self = this;
            self.$axios({
                    url: '/collect/detail',
                    method: 'get',
                    params: {
                        collectId: collectId,
                        itemId: id
                    }
                })
                .then((res) => {
                    if (res != null) {
                        let data = res.data.regItem.split(';');
                        for(let i in data){
                            let itemtitle=data[i].split('?')[0];
                            let itemval=data[i].split('?')[1];
                            if(localStorage.getItem(itemtitle)==itemtitle){
                                let _tems=[];
                                let _urls=itemval.split('&');
                                for(let i in _urls){
                                    _tems.push({type:itemtitle,src:_urls[i]});
                                }
                                self.detail.imgList=_tems;
                            }
                        }
                        self.$modal.show('collect-modal');
                    }
                })
        },
        closeModal() {
            this.detail.name = '';
            this.detail.recUnit = '';
            this.detail.mobile = '';
            this.detail.brandName = '';
            this.detail.productImgUrlList = [];
            this.detail.intro = '';
            this.$modal.hide('collect-modal');
        },
        handleReq(id, type) {
            const self = this;
            var collectId = this.$route.params.id;
            self.loading = true;
            self.$axios({
                    url: '/collect/handle',
                    method: 'post',
                    params: {
                        collectId: collectId,
                        itemId: id,
                        approve: type
                    }
                })
                .then((res) => {
                    self.loading = false;
                    if (res != null && res.data.result) {
                        self.$message('审核改变成功!');
                        self.getData();
                    } else
                        self.$message.error("审核改变失败!请重试！");
                })
                .catch(function(error) {
                    self.loading = false;
                    console.log(error);
                });
        }
    }
}

</script>
<style type="text/css" scoped>
.avatar-uploader .el-upload {
    width: 184px !important;
}

.search_input {
    width: 150px!important;
}

.sign_tag {
    font-size: 14px;
}

.sign_button {
    padding: 3px 5px;
}

.collect_top_num_div {
    display: inline;
    padding-top: 100px;
}

.collect_top_p {
    display: inline;
}

.brand_logo_table {
    width: 100px !important;
    height: 100px;
}
.green{
    color: #04be02;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.detail_img_div {
    width: 150px;
    height: 120px;
    margin-top: 5px;
    display: inline;
}

.detail_img_list_div {
    margin-right: 10px;
    margin-bottom: 10px;
    width: 150px;
    height: 155px;
    float: left;
    border: 1px solid #999;
}

.modal_close_btn {
    float: right;
    margin: 15px 20px 0 0;
    color: #999;
}

.el-icon-close:hover {
    color: #333;
    cursor: pointer;
}

.modal-form {
    margin-top: 40px;
}

.top-btn-right {
    margin-right: 20px;
}

</style>
