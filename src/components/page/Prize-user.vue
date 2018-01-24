<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <router-link to="/prize-list">抽奖活动列表</router-link>
                </el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search_form">
            <el-form ref="search_form" :model="search_form">
                <el-form-item class="top_search">
                    <el-input v-model="search_form.code" class="search_input" placeholder="搜索验证码"></el-input>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-radio-group v-model="search_form.isUse">
                        <el-radio class="radio" :label="-1">全部</el-radio>
                        <el-radio class="radio" :label="0">未使用</el-radio>
                        <el-radio class="radio" :label="1">已使用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-button type="success" @click="searchHandle">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-button type="success" @click="export2Excel">导出</el-button>
            <el-tag>共{{sum}}个用户</el-tag>
        </div>
        <el-table :data="allData" border style="display: none" v-loading.body="loading">
            <el-table-column type="index" width="100" sortable>
            </el-table-column>
            <el-table-column label="奖券序号" prop="id" sortable>
            </el-table-column>
            <el-table-column label="微信id" prop="openId">
            </el-table-column>
            <el-table-column label="验证码" prop="code">
            </el-table-column>
            <el-table-column label="奖项编号" prop="prizeId">
            </el-table-column>
            <el-table-column label="添加时间" prop="addtime" sortable>
            </el-table-column>
            <el-table-column label="修改时间" prop="modtime" sortable>
            </el-table-column>
            <el-table-column label="是否使用" prop="isUse">
                <template scope="scope">
                    <div v-if="scope.row.isUse == 0">
                        <el-button type="success" @click="handleUse(scope.row.id)" class="sign_button">去验证</el-button>
                    </div>
                    <div v-else>
                        <el-tag type="gray" class="sign_tag">已使用</el-tag>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-table :data="tableData" border style="width: 100%" v-loading.body="loading">
            <el-table-column type="index" width="100" sortable>
            </el-table-column>
            <el-table-column label="奖券序号" prop="id" sortable>
            </el-table-column>
            <el-table-column label="微信id" prop="openId">
            </el-table-column>
            <el-table-column label="验证码" prop="code">
            </el-table-column>
            <el-table-column label="奖项编号" prop="prizeId">
            </el-table-column>
            <el-table-column label="添加时间" prop="addtime" sortable>
            </el-table-column>
            <el-table-column label="修改时间" prop="modtime" sortable>
            </el-table-column>
            <el-table-column label="是否使用" prop="isUse">
                <template scope="scope">
                    <div v-if="scope.row.isUse == 0">
                        <el-button type="success" @click="handleUse(scope.row.id)" class="sign_button">去验证</el-button>
                    </div>
                    <div v-else>
                        <el-tag type="gray" class="sign_tag">已使用</el-tag>
                    </div>
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
                    isUse: -1,
                    code: '',
                },
                tableData: [],
                allData:[],
                pageSum: 10,
                sum: 0,
                cur_page: 1,
                actId: this.$route.params.id,
                loading: false
            }
        },
        mounted() {
            this.getData();
            this.getAllData();
        },
        methods: {
//        导出全部数据excel
            export2Excel() {
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../excel/Export2Excel');
                    const { blob }=require('../../excel/Blob');
                    const tHeader = ['奖券序号','微信id','验证码','奖项编号','添加时间','修改时间','是否使用'];
                    const filterVal = ['id','openId','code','prizeId','addtime','modtime','isUse'];
                    const list = this.allData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '抽奖用户列表excel');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
//       导出excel结束
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
                    url: '/prize/list-user',
                    method: 'get',
                    params: {
                        code: self.search_form.code,
                        isUse: self.search_form.isUse,
                        actId: self.actId,
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
            getAllData(){
                const self = this;
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                self.$axios({
                    url: '/prize/list-user-all',
                    method: 'get',
                    params: {
                        code: self.search_form.code,
                        isUse: self.search_form.isUse,
                        actId: self.actId
                    }
                })
                    .then((res) => {
                        if (res != null) {
                            self.allData = res.data.list;
//                            console.log(self.allData);
                            self.sum = res.data.sum;
                        }
                    })
            },
            searchHandle() {
                this.getData();
                this.getAllData();
            },
            handleUse(id) {
                const self = this;
                self.loading = true;
                self.$axios({
                    url: '/prize/do-use',
                    method: 'post',
                    params: {
                        id:id
                    }
                })
                    .then((res) => {
                        self.loading = false;
                        if (res != null && res.data.result) {
                            self.$message('验证成功!');
                            self.getData();
                        } else
                            self.$message.error("验证失败!请重试！");
                    })
                    .catch(function(error) {
                        self.loading = false;
                        console.log(error);
                    });
            },
            handleStatus(openId){
                const self = this;
                self.loading = true;
                self.$axios({
                    url: '/act/do-reg',
                    method: 'post',
                    params: {
                        openId: openId,
                        actId: self.actId
                    }
                })
                    .then((res) => {
                        self.loading = false;
                        if (res != null && res.data.result) {
                            self.$message('报名成功!');
                            self.getData();
                        } else
                            self.$message.error("报名失败!请重试！");
                    })
                    .catch(function(error) {
                        self.loading = false;
                        console.log(error);
                    });
            }
        }
    }
</script>
<style type="text/css">
    .search_input {
        width: 150px!important;
    }

    .sign_tag {
        font-size: 14px;
    }

    .sign_button {
        padding: 3px 5px;
    }
</style>

