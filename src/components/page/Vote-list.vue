<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/vote-list/' }">
                    <i class="el-icon-date"></i>投票活动管理
                </el-breadcrumb-item>
                <el-breadcrumb-item >我发起的投票活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search_form">
            <el-form ref="search_form" :model="search_form">
                <el-form-item class="top_search">
                    <el-input v-model="search_form.act_name" class="search_input" placeholder="搜索名称"></el-input>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-date-picker type="date" placeholder="起始日期" v-model="tempBegin" class="search_input"></el-date-picker>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-date-picker type="date" placeholder="结束日期" v-model="tempEnd" class="search_input"></el-date-picker>
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
                    <el-form-item label="活动序号" prop="id" style="display: none">
                        <el-input v-model="voteForm.id"  class="form_middle" ></el-input>
                    </el-form-item>
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
                    <br/>
                    <el-form-item label="投票活动规则说明" prop="votedecoration">
                        <span style="color: red">您在分段落换行时请添加&lt;br&nbsp;/&gt;符号</span>
                        <br/>
                        <el-input
                            class="form_middle"
                            id="votedecoration"
                            type="textarea"
                            :rows="2"
                            :autosize="true"
                            placeholder="请输入投票规则说明"
                            v-model="voteForm.votedecoration">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="modal-btn-group">
                        <el-button type="primary" @click="onVoteSubmit">修改设置</el-button>
                        <el-button @click="closeVoteModal">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </modal>
        <!--投票活动模态框结束-->
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="投票活动序号" sortable>
            </el-table-column>
            <el-table-column prop="actName" label="活动名称">
            </el-table-column>
            <el-table-column prop="begin" label="起始日期" sortable>
            </el-table-column>
            <el-table-column prop="end" label="结束日期" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="success" @click="handleResult(scope.row.id)">投票结果管理</el-button>
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
<script>
    import {
        GetCurrentDate,
        TransDateToString
    } from '../../util/date-helper.js';
    import {
        TransDetailDateToString,
        TransDetailStringToDate,
    } from '../../util/date-helper.js';
    import {
        MessageBox
    } from 'element-ui';
    export default {
        data() {
            return {
                search_form: {
                    act_name: '',
                    begin: '',
                    end: ''
                },
                tempBegin: '',
                tempEnd: '',
                temBegin:'',
                temEnd:'',
                tableData: [],
                pageSum: 10,
                sum: 0,
                cur_page: 1,
                voteForm: {
                    id:'',
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
        watch: {
            tempBegin: function(val) {
                this.search_form.begin = TransDateToString(val);
            },
            tempEnd: function(val) {
                this.search_form.end = TransDateToString(val);
            },
            temBegin: function(val) {
                this.prizeForm.begin = TransDetailDateToString(val);
            },
            temEnd: function(val) {

                this.prizeForm.end = TransDetailDateToString(val);
            },
        },
        mounted() {
            this.getData();
        },
        methods: {
            linkToOtherUrl(id, url) {
                if (id == 0)
                    this.$router.push(url + "0");
                else
                    this.$router.push(url + id);
            },   handleSizeChange(val) {
                this.pageSum=val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            openVoteModal(){
                this.$modal.show('vote-modal');
            },
            closeVoteModal(){
                this.$modal.hide('vote-modal');
            },
            onVoteSubmit(){
                const self=this;
                self.$refs["voteForm"].validate((valid) => {
                    if (valid) {
                        if(self.voteForm.begin>self.voteForm.end){
                            this.$message.error("请填写正确的活动起止时间!");
                            return;
                        }
                        console.log(self.voteForm.id);
                        self.$axios({
                            url:'/collect/vote-param-edit',
                            method:'post',
                            params:{
                                id:parseInt(self.voteForm.id),
                                actName:self.voteForm.act_name,
                                begin:self.voteForm.begin,
                                end:self.voteForm.end,
                                proNum:parseInt(self.voteForm.pro_num),
                                voteNum:parseInt(self.voteForm.vote_num),
                                shareNum:self.voteForm.share_num,
                                voteMaxNum:parseInt(self.voteForm.vote_max_num),
                                voteDecoration:self.voteForm.votedecoration,
                            }
                        })
                            .then((res) => {
                                if (res != null && res.data.result)
                                    self.$message('修改成功!');
                                else
                                    self.$message.error("修改失败！");
                                self.$modal.hide('vote-modal');
                            })
                    }
                })
            },
            getData() {
                const self = this;
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                self.$axios({
                    url: '/collect/list-vote',
                    method: 'get',
                    params: {
                        username:username,
                        actName: self.search_form.act_name,
                        begin: self.search_form.begin,
                        end: self.search_form.end,
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
                        url: '/collect/vote-param-delete',
                        method: 'post',
                        data: {
                            id: id
                        }
                    })
                        .then((res) => {
                            if (res != null) {
                                self.$message("删除成功");
                                self.getData();
                            }
                        })
                }).catch(function() {
                    console.log("取消投票活动删除");
                });

            },
            handleEdit(id) {
                const self=this;
                self.$axios({
                    url: '/collect/vote-param-get',
                    method: 'get',
                    params: {
                        id:id
                    }
                })
                    .then((res) => {
                        if (res != null) {
                            self.voteForm.id=id;
                            self.voteForm.act_name=res.data.actName;
                            self.tempBegin=res.data.begin;
                            self.tempEnd=res.data.end;
                            self.voteForm.begin=res.data.begin;
                            self.voteForm.end=res.data.end;
                            self.voteForm.pro_num=res.data.proNum.toString();
                            self.voteForm.vote_num=res.data.voteNum.toString();
                            self.voteForm.share_num=res.data.shareNum;
                            self.voteForm.vote_max_num=res.data.voteMaxNum.toString();
                            self.voteForm.votedecoration=res.data.voteDecoration;
                            self.openVoteModal();
                        }
                    })

            },
            handleResult(id){
                this.linkToOtherUrl(id,"/vote-list/result/");
            }
        }
    }
</script>
<style type="text/css">
    .search_input {
        width: 150px!important;
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
</style>
