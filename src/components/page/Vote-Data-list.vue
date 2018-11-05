<template>
    <div>
        <div class="search_form">
            <el-form ref="search_form" :model="search_form">
                <el-form-item class="top_search">
                    <el-input v-model="search_form.content" class="search_input" placeholder="搜索投票作品内容"></el-input>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-input v-model="search_form.actId"  class="search_input"  placeholder="搜索投票活动序号"></el-input>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-button type="success" @click="searchHandle">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
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
                    <el-form-item label="关联活动序号" prop="act_id">
                        <el-input v-model="voteForm.act_id"  class="form_middle"></el-input>
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
        <div class="top-btn top-btn-left">
            <el-button type="primary" @click="openVoteModal">发起投票</el-button>
        </div>
        <div class="top-btn">
            <el-button type="primary" @click="linkToDetail('0')">添加</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="作品序号" sortable>
            </el-table-column>
            <el-table-column prop="actId" label="投票活动序号" sortable>
            </el-table-column>
            <el-table-column prop="content" label="投票作品数据内容">
            </el-table-column>
            <el-table-column prop="imgUrls" label="作品图片">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :pageSize="pageSum" :page-sizes="[2,4,6,8,10,12,14]" layout="total,sizes, prev, pager, next, jumper"  :total="sum">
            </el-pagination>
        </div>
    </div>



</template>
<style type="text/css">
    .search_input {
        width: 150px!important;
    }
</style>
<script>
    import {
        TransDetailDateToString,
        TransDetailStringToDate
    } from '../../util/date-helper.js';
    import {
        MessageBox
    } from 'element-ui';
    export default {
        data() {
            return {
                search_form: {
                    content: '',
                    actId:''
                },
                tableData: [],
                pageSum: 10,
                sum: 0,
                cur_page: 1,
                tempBegin: '',
                tempEnd: '',
                voteForm: {
                    act_name:'',
                    act_id:'',
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
        watch: {
            tempBegin: function(val) {
                this.voteForm.begin = TransDetailDateToString(val);
            },
            tempEnd: function(val) {

                this.voteForm.end = TransDetailDateToString(val);
            },
        },
        mounted() {
            this.getData();
        },
        methods: {
            linkToDetail(id) {
                if (id == 0)
                    this.$router.push("/vote-data-list/detail/0");
                else
                    this.$router.push("/vote-data-list/detail/" + id);
            }, handleSizeChange(val) {
                this.pageSum=val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() {
                const self = this;
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                self.$axios({
                    url: '/vote-data/list',
                    method: 'get',
                    params: {
                        username:username,
                        content:self.search_form.content,
                        actId:self.search_form.actId,
                        curPage: self.cur_page,
                        pageSum: self.pageSum
                    }
                })
                    .then((res) => {
                        if (res != null) {
                            self.tableData = res.data.list;
                            self.sum = res.data.sum;
                        }
                    })
            },
            searchHandle() {
                this.getData();
            },
            handleDelete(id) {
                const self = this;
                MessageBox.confirm('确定删除？').then(function(action) {
                    self.$axios({
                        url: '/vote-data/delete',
                        method: 'post',
                        data: {
                            id: id
                        }
                    })
                        .then((res) => {
                            if (res.data==true) {
                                self.$message("删除成功");
                                self.getData();
                            }
                        })
                }).catch(function() {
                    console.log("取消投票作品数据删除");
                });
            },
            handleEdit(id) {
                this.linkToDetail(id);
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
                        var actId=0;
                        if(self.voteForm.act_id!=""){
                            actId=parseInt(self.voteForm.act_id);
                        }
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
//                                proApproved:parseInt(self.approved_num),

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
        }
    }
</script>
<style>
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
