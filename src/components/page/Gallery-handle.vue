<template>
    <div>
        <!--投票活动模态框-->
        <modal name="vote-modal" transition="pop-out" :height="680" :resizable="true" :pivotY="0.2">
            <div class="modal_close_btn">
                <i class="el-icon-close" @click="closeVoteModal"></i>
            </div>
            <div class="modal-form">
                <el-form ref="voteForm" :model="voteForm" :rules="rules" label-width="80px" >
                    <el-form-item label="活动名称" prop="act_name">
                        <el-input v-model="voteForm.act_name"  class="form_middle"></el-input>
                    </el-form-item>
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
                    <el-form-item label="每次投票作品数" prop="pro_num">
                        <el-input v-model="voteForm.pro_num"   class="form_small"></el-input>
                    </el-form-item>
                    <el-form-item label="每天投票次数" prop="vote_num">
                        <el-input v-model="voteForm.vote_num"  class="form_small"></el-input>
                    </el-form-item>
                    <el-form-item label="分享是否增加次数" prop="share_num">
                        <el-switch
                            v-model="voteForm.share_num"
                            on-text="是" off-text="否"
                            on-color="#13ce66"
                            off-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="每天投票次数上限" prop="vote_max_num">
                        <el-input v-model="voteForm.vote_max_num"  class="form_small"></el-input>
                    </el-form-item>
                    <el-form-item label="投票活动规则说明" prop="votedecoration">
                        <span style="color: red">您在分段落换行时请添加&lt;br&nbsp;/&gt;符号</span>
                        <el-input
                            class="form_small"
                            id="votedecoration"
                            type="textarea"
                            :rows="2"
                            :autosize="true"
                            placeholder="请输入投票规则说明"
                            v-model="voteForm.votedecoration">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="modal-btn-group">
                        <el-button type="primary" @click="onVoteSubmit">发起投票</el-button>
                        <el-button @click="closeVoteModal">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </modal>
        <!--投票活动模态框结束-->
        <!--投票页面链接模态框-->
        <modal name="vote-link-modal" transition="pop-out" :height="600" :pivotY="0.2">
            <div class="modal_close_btn">
                <i class="el-icon-close" @click="closeVoteLinkModal"></i>
            </div>
            <div class="modal-form">
                <div class="vote-link">
                    二维码/微信链接地址
                </div>
                <div class="vote-link" style="text-align: center" >
                    <img src="../../../static/img/votelink.png" >
                    <div id="vote-link"></div>
                </div>

                <div class="modal-btn-group">
                    <el-button @click="closeVoteLinkModal">关闭</el-button>
                </div>
            </div>

        </modal>
        <!--投票页面链接模态框结束-->

        <div class="search_form">
            <el-form ref="search_form" :model="search_form">
                <el-form-item>
                    <div class="collect_top_num_div">
                        <p class="collect_top_p">审核通过&nbsp;&nbsp;</p>
                        <el-tag type="danger" class="collect_top_tag">{{approved_num}}</el-tag>
                        <el-tag class="collect_top_tag">共{{sum}}个用户</el-tag>
                    </div>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-form-item class="top_search">
                        <el-input v-model="search_form.name" class="search_input" placeholder="搜索作品名称"></el-input>
                    </el-form-item>
                    <el-form-item class="top_search">
                        <el-radio-group v-model="search_form.type">
                            <el-radio class="radio" :label="-1">全部</el-radio>
                            <el-radio class="radio" :label="1">已审核</el-radio>
                            <el-radio class="radio" :label="0">未审核</el-radio>
                        </el-radio-group>
                    </el-form-item>

                </el-form-item>
                <el-form-item class="top_search">
                    <el-button type="success" @click="searchHandle">搜索</el-button>
                </el-form-item>
            </el-form>

        </div>
        <div class="top-btn top-btn-left">
            <el-button type="info" @click="updateAllStatus">{{allStatus}}</el-button>
            <!--<el-button type="danger" @click="openVoteLinkModal">投票页面链接</el-button>-->
            <!--<el-button type="primary" @click="openFirstImgModal">上传首屏展示图</el-button>-->
        </div>
        <div class="top-btn top-btn-right">
            <el-button type="primary" @click="openVoteModal">发起投票</el-button>
            <!--<el-button type="success" @click="openMulImgModal">上传详情图</el-button>-->
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading.body="loading">
            <template>
                <!--index为自增序号，id为活动中的id为数据库中保存的，此程序中保留id，仅不显示-->
                <!--<el-table-column type="index" width="100">-->
                <!--</el-table-column>-->
                <el-table-column label="序号" prop="id" :formatter="formatter_id">
                </el-table-column>
                <!--<el-table-column label="图片" :formatter="formatter_image">-->
                    <!--<template scope="scope">-->
                        <!--<img :src="scope.row.image" style="width: 20px;height: 20px">-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="名称" prop="name">
                </el-table-column>
                <el-table-column label="作者" prop="authorId">
                </el-table-column>
                <el-table-column label="作品详情" prop="detail">
                    <template scope="scope">
                        <el-button type="success" @click="handleDetail(scope.row.productionId)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <div v-if="scope.row.adminChecked == 0">
                            <el-button type="info" @click="handleReq(scope.row.productionId,1)">去通过</el-button>
                        </div>
                        <div v-else>
                            <el-button :plain="true" type="info" @click="handleReq(scope.row.productionId,0)">取消通过</el-button>
                        </div>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <div class="pagination">
            <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :pageSize="pageSum" :page-sizes="[2,4,6,8,10,12,14]" layout="total,sizes, prev, pager, next, jumper"  :total="sum">
            </el-pagination>
        </div>

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
        TransDetailDateToString,
        TransDetailStringToDate
    } from '../../util/date-helper.js';
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
                    name:'',
                    type: -1,
                },
                allStatus:"全部审核通过",
                tableData: [],
                pageSum: 10,
                sum: 0,
                cur_page: 1,
                loading: false,
                approved_num: 0,
                loading: false,
                detail: {
                    imgList: []
                },
                firstImgForm: {
                    id: '',
                    url: ''
                },
                detailImgForm: {
                    id: '',
                    urls: ''
                },
                imgUploadUrl: uploadImgUrl,
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                tempBegin: '',
                tempEnd: '',
                voteForm: {
                    act_name:'',
                    begin:'',
                    end:'',
                    pro_num: '',
                    vote_num: '',
                    share_num: true,
                    vote_max_num:'',
                    votedecoration: '',
                },
                rules: {
                    act_name:[{
                        required:true,
                        message:'请填写活动名称',
                        trigger:'blur'
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
                    pro_num: [{
                        required: true,
                        message: '请设定每次投票作品数',
                        trigger: 'blur'
                    }],
                    vote_num:[{
                        required: true,
                        message: '请设定每天投票次数',
                        trigger: 'blur'
                    }],
                    vote_max_num:[{
                        required: true,
                        message: '请设定每天投票次数上限',
                        trigger: 'blur'
                    }],
                    votedecoration:[{
                        required:true,
                        message:'请填写投票规则',
                        trigger:'blur'
                    }]
                }

            }
        },

        mounted() {
            this.getData();
        },
        watch: {
            tempBegin: function(val) {
                this.voteForm.begin = TransDetailDateToString(val);
            },
            tempEnd: function(val) {

                this.voteForm.end = TransDetailDateToString(val);
            },
        },
        components: {
            'SingleImg': SingleImg,
            'MultiImg': MultiImg
        },
        methods: {
            linkToOtherUrl(){
                var id=this.$route.params.id;
                window.location.href="http://wechat.tuopinpin.com/goods/page/listWork.html?id="+id;
            },
            updateAllStatus(){
                if(this.allStatus=="全部审核通过"){
                    this.allPass();
                }else{
                    this.allReject();
                }
            },
            allPass(){
                var id=this.$route.params.id;
                var self=this;
                self.$axios({
                    url:'/gallery/allpass',
                    method:'post',
                    params:{
                       galleryId:id
                    }
                })
                    .then((res) => {
                        if (res != null && res.data.result){
                            self.$message('全部审核通过成功!');
                            self.allStatus="全部取消通过";
                            this.getData();
                        }
                        else{
                            self.$message.error("全部审核通过失败！");
                        }
                    })
            },
            allReject(){
                var id=this.$route.params.id;
                var self=this;
                self.$axios({
                    url:'/gallery/allreject',
                    method:'post',
                    params:{
                        galleryId:id
                    }
                })
                    .then((res) => {
                        if (res != null && res.data.result){
                            self.$message('全部取消审核成功!');
                            self.allStatus="全部审核通过";
                            this.getData();
                        }
                        else{
                            self.$message.error("全部取消审核失败！");
                        }
                    })
            },
            resetForm(){
                this.begin='';
                this.end='';
                this.pro_num='';
                this.vote_num='';
                this.share_num=true;
                this.votedecoration='';
            },
            formatter_id(row,column){
                return row["id"];
            },
            formatter_image(row,column){
                return "http://www.tuopinpin.com/files/"+row["image"]
            },
            formatter_items(row,column){
                if(row[column.label].indexOf('http')>-1){
                    localStorage.setItem(column.label,column.label);
                }
                return row[column.label];
            },
//       发起投票模态框开始
            openVoteModal(){
//            this.resetForm();
                this.$modal.show('vote-modal');
            },
            closeVoteModal(){
                this.$modal.hide('vote-modal');
            },
            onVoteSubmit(){
                var actId = this.$route.params.id;
                const self=this;
                self.$refs["voteForm"].validate((valid) => {
                    if (valid) {
                        if(self.voteForm.begin>self.voteForm.end){
                            this.$message.error("请填写正确的活动起止时间!");
                            return;
                        }
                        var wsCache = window.$wsCache;
                        var username=wsCache.get("username");
                        self.$axios({
                            url:'/collect/post-vote',
                            method:'post',
                            params:{
                                username:username,
                                actId:actId,
                                actName:self.voteForm.act_name,
                                begin:self.voteForm.begin,
                                end:self.voteForm.end,
                                proNum:parseInt(self.voteForm.pro_num),
                                voteNum:parseInt(self.voteForm.vote_num),
                                shareNum:self.voteForm.share_num,
                                voteMaxNum:parseInt(self.voteForm.vote_max_num),
                                voteDecoration:self.voteForm.votedecoration,
                                proApproved:parseInt(self.approved_num),

                            }
                        })
                            .then((res) => {
                                if (res != null && res.data.result)
                                    self.$message('发起成功!');
                                else
                                    self.$message.error("发起失败！");
                                self.$modal.hide('vote-modal');
                            })
                    }
                })
            },
            //       发起投票模态框结束
//       投票页面链接模态框开始
            openVoteLinkModal(){
                this.$modal.show('vote-link-modal');
                setTimeout(function () {
                    var id=localStorage.getItem("id");
                    document.getElementById("vote-link").innerHTML='http://wechat.tuopinpin.com/goods/page/listWork.html?id='+id;
                },100)
            },
            closeVoteLinkModal(){
                this.$modal.hide('vote-link-modal');
            },
            //       投票页面链接模态框结束
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
            handleSizeChange(val) {
                this.pageSum=val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() {
//                专题id
                var galleryId = this.$route.params.id;
                localStorage.setItem("id",galleryId);
                const self = this;
                self.$axios({
                    url: '/gallery/list-production',
                    method: 'get',
                    params: {
                        //作品名称
                        name:self.search_form.name,
                       //是否已审核
                        type: self.search_form.type,
                        // 专题id
                        galleryId: galleryId,
                        curPage: self.cur_page,
                        pageSum: self.pageSum
                    }
                })
                    .then((res) => {
                        if (res != null) {
                            self.tableData=res.data.list;
                            self.sum = res.data.sum;
                            self.approved_num = res.data.approveSum;
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
                window.location.href = "http://m.tuopinpin.com/#production_detail/"+id;
//                var collectId = this.$route.params.id;
//                const self = this;
//                self.$axios({
//                    url: '/collect/detail',
//                    method: 'get',
//                    params: {
//                        collectId: collectId,
//                        itemId: id
//                    }
//                })
//                    .then((res) => {
//                        if (res != null) {
//                            let data = res.data.regItem.split(';');
//                            for(let i in data){
//                                let itemtitle=data[i].split('?')[0];
//                                let itemval=data[i].split('?')[1];
//                                if(localStorage.getItem(itemtitle)==itemtitle){
//                                    let _tems=[];
//                                    let _urls=itemval.split('&');
//                                    for(let i in _urls){
//                                        _tems.push({type:itemtitle,src:_urls[i]});
//                                    }
//                                    self.detail.imgList=_tems;
//                                }
//                            }
//                            self.$modal.show('collect-modal');
//                        }
//                    })
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
            handleReq(productionId, type) {
                const self = this;
                var galleryId = this.$route.params.id;
                self.loading = true;
                self.$axios({
                    url: '/gallery/handle',
                    method: 'post',
                    params: {
                        galleryId: galleryId,
                        productionId: productionId,
                        type: type//是否审核
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
    #votedecoration{
        width: 450px!important;
        height: 40px!important;
    }

    .sign_tag {
        font-size: 14px;
    }

    .sign_button {
        padding: 3px 5px;
    }
    .collect_top_vote_div{
        font-size: 13px;
    }
    .collect_top_num_div {
        display: inline;
        padding-top: 100px;
    }

    .collect_top_p {
        display: inline;
        color: #04be02;
    }
    .vote-link{
        padding:10px 0 20px 0;
        border-bottom:1px solid #bbbbbb ;
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
    .top-btn-left{
        float: left;
    }

    .top-btn-right {
        margin-right: 20px;
    }

</style>
