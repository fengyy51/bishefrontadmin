<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-date">专题管理</i>
                </el-breadcrumb-item>
                <el-breadcrumb-item >专题活动列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search_form">
            <el-form ref="search_form" :model="search_form">
                <el-form-item class="top_search">
                    <el-input v-model="search_form.name" class="search_input" placeholder="搜索名称"></el-input>
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
        <div class="top-btn-left">
            <el-button type="primary" v-if="Admin=='binwang158'" @click="addAdmin">添加管理者</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="活动名称">
            </el-table-column>
            <el-table-column prop="begin" label="起始日期" sortable>
            </el-table-column>
            <el-table-column prop="end" label="结束日期" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="success" @click="handleGallery(scope.row.id)">作品审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :pageSize="pageSum" :page-sizes="[2,4,6,8,10,12,14]" layout="total,sizes, prev, pager, next, jumper"  :total="sum">
            </el-pagination>
        </div>
        <!--增加活动管理员-->
        <modal name="add-admin-modal" transition="pop-out" :height="320" :pivotY="0.2">
            <div class="modal_close_btn">
                <i class="el-icon-close" @click="closeAdminModal"></i>
            </div>
            <div class="modal-form">
            <el-form ref="addAdminForm" :model="addAdminForm" :rules="rules" label-width="80px" >
                <el-form-item label="专题活动名称" prop="gallery_name">
                    <el-input v-model="addAdminForm.gallery_name"  class="form_middle"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="活动管理员名称" prop="admin_name">
                    <el-input v-model="addAdminForm.admin_name"  class="form_middle"></el-input>
                </el-form-item>
                <br/>
                <el-form-item class="modal-btn-group">
                    <el-button type="primary" @click="addAdminSubmit">确定</el-button>
                    <el-button @click="closeAdminModal">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        </modal>
    </div>
</template>
<script>
    import {
        GetCurrentDate,
        TransDateToString
    } from '../../util/date-helper.js';
    import {
        MessageBox
    } from 'element-ui';
    export default {
        data() {
            return {
                search_form: {
                    name: '',
                    begin: '',
                    end: ''
                },
                Admin:"",
                tempBegin: '',
                tempEnd: '',
                tableData: [],
                pageSum: 10,
                sum: 0,
                cur_page: 1,
                addAdminForm:{
                    gallery_name:"",
                    admin_name:""
                },
                rules:{
                    gallery_name:[{
                        required:true,
                        message:"请输入专题活动名称",
                        trigger:"blur"}],
                    admin_name:[{
                        required:true,
                        message:"请输入管理员名称",
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
            }
        },
        mounted() {
            this.getData();
            var wsCache = window.$wsCache;
            var username=wsCache.get("username");
            this.Admin=username;
        },
        methods: {
            linkToOtherUrl(id, url) {
                if (id == 0)
                    this.$router.push(url + "0");
                else
                    this.$router.push(url + id);
            },
//            增加专题活动管理员
            addAdmin(){
                this.$modal.show('add-admin-modal');
            },
//            全部审核通过
            allPass(){

            },
            closeAdminModal(){
                this.$modal.hide('add-admin-modal');
            },
            addAdminSubmit(){
                var actId = this.$route.params.id;
                const self=this;
                self.$refs["addAdminForm"].validate((valid) => {
                    if (valid) {
                        var wsCache = window.$wsCache;
                        var username=wsCache.get("username");
                        self.$axios({
                            url:'/gallery/add-admin',
                            method:'post',
                            params:{
                                galleryName:self.addAdminForm.gallery_name,
                                galleryAdmin:self.addAdminForm.admin_name,
                            }
                        })
                            .then((res) => {
                                if (res != null && res.data.result){
                                    self.$message('添加管理者成功!');
                                    this.getData();
                                }
                                else
                                    self.$message.error("添加管理者失败！");
                                self.$modal.hide('add-admin-modal');
                            })
                    }
                })
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            }, handleSizeChange(val) {
                this.pageSum=val;
                this.getData();
            },
            getData() {
                const self = this;
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                self.$axios({
                    url: '/gallery/list',
                    method: 'get',
                    params: {
                        username:username,
                        name: self.search_form.name,
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
            handleGallery(id) {
                this.linkToOtherUrl(id, '/gallery-handle/');
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

