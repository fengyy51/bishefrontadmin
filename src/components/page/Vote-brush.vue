<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/vote-brush/' }">
                    <i class="el-icon-date"></i>刷票数据统计
                </el-breadcrumb-item>
                <el-breadcrumb-item >数据统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search_form">
            <el-form ref="search_form" :model="search_form" :rules="rules">

                <el-form-item class="top_search" prop="actName">
                    <el-select v-model="search_form.actName" placeholder="请选择投票活动名称">
                        <el-option :name="search_form.actName" v-for="item in actNameList"  :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="top_search" prop="interval">
                    <el-select v-model="search_form.interval"  placeholder="请选择时间区间">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="top_search" prop="num">
                    <el-input v-model="search_form.num" class="search_input" placeholder="输入票数上限"></el-input>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-button type="success" @click="searchHandle">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--<el-table :data="tableData" border style="width: 100%">-->
            <!--<el-table-column prop="id" label="投票活动序号" sortable>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="actName" label="活动名称">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="begin" label="起始日期" sortable>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="end" label="结束日期" sortable>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="操作">-->
                <!--<template scope="scope">-->
                    <!--<el-button size="small" type="success" @click="handleResult(scope.row.id)">查看投票结果</el-button>-->
                <!--</template>-->
            <!--</el-table-column>-->
        <!--</el-table>-->
        <!--<div class="pagination">-->
            <!--<el-pagination @current-change="handleCurrentChange" :pageSize="pageSum" layout="prev, pager, next" :total="sum">-->
            <!--</el-pagination>-->
        <!--</div>-->
    </div>
</template>
<script>
    export default {
        data() {
            return {
                search_form:{
                    actName:'',
                    interval:'',
                    num:'',
                },
                actNameList:[],
                options: [{
                    value: '1秒',
                }, {
                    value: '1分钟',
                }, {
                    value: '5分钟',
                }, {
                    value: '10分钟',
                }, {
                    value: '30分钟',
                }, {
                    value: '1小时',
                }, {
                    value: '1天',
                }],
                rules: {
                    actName: [{
                        required: true,
                        message: '请选择投票活动名称',
                        trigger: 'blur'
                    }],
                    interval: [{
                        required: true,
                        message: '请选择时间区间',
                        trigger: 'blur'
                    }],
                    num: [{
                        required: true,
                        message: '请输入票数上限',
                        trigger: 'blur'
                    }],
                }
            }
        },
        mounted() {
            this.getSearch();
        },
        methods: {
            getSearch(){
                const self=this;
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                self.$axios({
                    url:'collect/search',
                    method:'get',
                    params:{
                        username:username
                    }
                })
                    .then((res)=>{
                        if(res!=null){
                            self.typeList=res.data.type;
                            self.actNameList=res.data.actName;
                        }
                    })
            },
            searchHandle() {
                this.getData();
            },
            getData() {
                const self = this;
                self.$refs["search_form"].validate((valid) => {
                    if (valid) {
                        var actName = self.search_form.actName;
                        var interval=self.search_form.interval;
                        var num=self.search_form.num;

                        self.$axios({
                            url: '/collect/brush-list',
                            method: 'get',
                            params: {
                                actName: self.search_form.actName,
                                interval: self.search_form.interval,
                                num: self.search_form.num,
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
                        }

                })
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
