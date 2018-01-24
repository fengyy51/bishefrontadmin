<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/vote-list/' }">
                    <i class="el-icon-date"></i>投票活动管理
                </el-breadcrumb-item>
                <el-breadcrumb-item >投票结果管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search_form">
            <el-form ref="search_form" :model="search_form">
                <el-form-item class="top_search">
                    <el-input v-model="search_form.item_id" class="search_input" placeholder="搜索投票序号"></el-input>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-button type="success" @click="searchHandle">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--投票结果模态框-->
        <modal name="vote-modal" transition="pop-out" :height="300" :resizable="true" :pivotY="0.2">
            <div class="modal_close_btn">
                <i class="el-icon-close" @click="closeVoteModal"></i>
            </div>
            <div class="modal-form">
                <el-form ref="voteForm" :model="voteForm" :rules="rules" label-width="80px" >
                    <el-form-item prop="id" label="索引" >
                        <el-input v-model="voteForm.id"  class="form_middle" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="投票序号" prop="itemId" >
                        <el-input v-model="voteForm.itemId"  class="form_middle" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="投票结果数" prop="votenum">
                        <el-input v-model="voteForm.votenum"  class="form_middle"></el-input>
                    </el-form-item>
                    <el-form-item class="modal-btn-group">
                        <el-button type="primary" @click="onVoteSubmit">修改数量</el-button>
                        <el-button @click="closeVoteModal">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </modal>
        <!--投票结果模态框结束-->
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="索引" sortable>
            </el-table-column>
            <el-table-column prop="itemId" label="投票序号" sortable>
            </el-table-column>
            <el-table-column prop="voteNum" label="投票结果数" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
        MessageBox
    } from 'element-ui';
    export default {
        data() {
            return {
                search_form: {
                    item_id:'',
                },
                tableData: [],
                pageSum: 10,
                sum: 0,
                cur_page: 1,
                voteForm: {
                    itemId:'',
                    votenum:'',
                },
                rules: {
                    votenum:[{
                        required:true,
                        message:'请填写投票结果数',
                        trigger:'blur'
                    }],
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            //       修改抽奖模态框结束
            linkToOtherUrl(id, url) {
                if (id == 0)
                    this.$router.push(url + "0");
                else
                    this.$router.push(url + id);
            }, handleSizeChange(val) {
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
                        console.log(self.voteForm.id);
                        self.$axios({
                            url:'/collect/vote-result-edit',
                            method:'post',
                            params:{
                                id:parseInt(self.voteForm.id),
                                itemId:self.voteForm.itemId,
                                voteNum:self.voteForm.votenum,
                            }
                        })
                            .then((res) => {
                                if (res != null && res.data.result){
                                    self.$message('修改成功!');
                                    self.getData();
                                }
                                else
                                    self.$message.error("修改失败！");
                                self.$modal.hide('vote-modal');
                            })
                    }
                })
            },
            getData() {
                const self = this;
                var itemId=self.search_form.item_id;
                if(self.search_form.item_id==''){
                    itemId=-1;
                }
                console.log(self.$route.params.itemId);
                if(self.$route.params.itemId!=undefined){
                    itemId=self.$route.params.itemId
                }
                self.$axios({
                    url: '/collect/vote-result',
                    method: 'get',
                    params: {
                        actId:self.$route.params.id,
                        itemId: parseInt(itemId),
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
            handleEdit(row) {
                const self=this;
                self.voteForm.id=row.id;
                self.voteForm.itemId=row.itemId;
                self.voteForm.votenum=row.voteNum;
                self.openVoteModal();
            },
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
