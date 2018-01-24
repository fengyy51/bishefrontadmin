<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/act-list/' }">
                    <i class="el-icon-date"></i>活动管理
                </el-breadcrumb-item>
                <el-breadcrumb-item >我发起的活动</el-breadcrumb-item>
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
        <!--<div class="top-btn">-->
        <!--<el-button type="primary" @click="linkToOtherUrl('0','/act-list/detail/')">添加</el-button>-->
        <!--</div>-->
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="活动名称">
            </el-table-column>
            <el-table-column prop="begin" label="起始日期" sortable>
            </el-table-column>
            <el-table-column prop="end" label="结束日期" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="success" @click="handleVote(scope.row.id)">发起投票</el-button>
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
                tempBegin: '',
                tempEnd: '',
                tableData: [],
                pageSum: 10,
                sum: 0,
                cur_page: 1
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
        },
        methods: {
            linkToOtherUrl(id, url) {
                if (id == 0)
                    this.$router.push(url + "0");
                else
                    this.$router.push(url + id);
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
                    url: '/act/list',
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
            handleVote(id) {
                this.linkToOtherUrl(id, '/collect/');
            }
        }
    }
</script>
