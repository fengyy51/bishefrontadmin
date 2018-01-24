<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <router-link to="/act-list">活动列表</router-link>
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
                    <el-radio-group v-model="search_form.sign">
                        <el-radio class="radio" :label="-1">全部</el-radio>
                        <el-radio class="radio" :label="0">未签到</el-radio>
                        <el-radio class="radio" :label="1">已签到</el-radio>
                        <el-radio class="radio" :label="2">未支付</el-radio>
                        <el-radio class="radio" :label="3">已报名</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-button type="success" @click="searchHandle">搜索</el-button>
                </el-form-item>
            </el-form>
                <el-button type="success" @click="export2Excel">导出</el-button>
                <el-tag>共{{sum}}个用户</el-tag>
        </div>
        <el-table :data="allData" border style="display: none;" v-loading.body="loading">
            <el-table-column type="index" width="100" >
            </el-table-column>
            <el-table-column label="微信id" prop="openId">
            </el-table-column>
            <el-table-column label="验证码" prop="code">
            </el-table-column>
            <el-table-column label="报名信息" prop="regItem">
            </el-table-column>
            <el-table-column label="报名状态" prop="status">
                <template scope="scope">
                    <div v-if="scope.row.status == 0">
                        已报名
                    </div>
                    <div v-else-if="scope.row.status==2">
                        未支付
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="更改报名状态" >
                <template scope="scope">
                    <div v-if="scope.row.status == 2">
                        <el-button type="success" @click="handleStatus(scope.row.openId)" class="status_button">已支付</el-button>
                    </div>
                    <div v-else>
                        <el-tag type="gray" class="status_tag">已报名</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="是否签到" prop="sign">
                <template scope="scope">
                    <div v-if="scope.row.sign == 0">
                        <el-button type="success" @click="handleSign(scope.row.openId)" class="sign_button">去签到</el-button>
                    </div>
                    <div v-else>
                        <el-tag type="gray" class="sign_tag">已签到</el-tag>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-table :data="tableData" border style="width: 100%" v-loading.body="loading">
            <el-table-column type="index" width="100" >
            </el-table-column>
            <el-table-column label="微信id" prop="openId">
            </el-table-column>
            <el-table-column label="验证码" prop="code">
            </el-table-column>
            <el-table-column label="报名信息" prop="regItem">
            </el-table-column>
            <el-table-column label="报名状态" prop="status">
                <template scope="scope">
                    <div v-if="scope.row.status == 0">
                        已报名
                    </div>
                    <div v-else-if="scope.row.status==2">
                        未支付
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="更改报名状态" >
                <template scope="scope">
                    <div v-if="scope.row.status == 2">
                        <el-button type="success" @click="handleStatus(scope.row.openId)" class="status_button">已支付</el-button>
                    </div>
                    <div v-else>
                        <el-tag type="gray" class="status_tag">已报名</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="是否签到" prop="sign">
                <template scope="scope">
                    <div v-if="scope.row.sign == 0">
                        <el-button type="success" @click="handleSign(scope.row.openId)" class="sign_button">去签到</el-button>
                    </div>
                    <div v-else>
                        <el-tag type="gray" class="sign_tag">已签到</el-tag>
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
<script>
import {
    MessageBox
} from 'element-ui';
export default {
    data() {
            return {
                search_form: {
                    sign: -1,
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
//        导出excel 导出全部数据
            export2Excel() {
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../excel/Export2Excel');
                    const { blob }=require('../../excel/Blob');
                    const tHeader = ['微信id','验证码','报名信息','报名状态','是否签到'];
                    const filterVal = ['openId','code','regItem','status','sign'];
                    const list = this.allData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '列表excel');
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
                        url: '/act/sign/list',
                        method: 'get',
                        params: {
                            code: self.search_form.code,
                            sign: self.search_form.sign,
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
            //获取导出的数据
            getAllData(){
                const self = this;
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                self.$axios({
                    url: '/act/sign/list-all',
                    method: 'get',
                    params: {
                        code: self.search_form.code,
                        sign: self.search_form.sign,
                        actId: self.actId
                    }
                })
                    .then((res) => {
                        if (res != null) {
                            self.allData = res.data.list;
                            self.sum = res.data.sum;
                        }
                    })
            },
            searchHandle() {
                this.getData();
                this.getAllData();
            },
            handleSign(openId) {
                const self = this;
                self.loading = true;
                self.$axios({
                        url: '/act/do-sign',
                        method: 'post',
                        params: {
                            openId: openId,
                            actId: self.actId
                        }
                    })
                    .then((res) => {
                        self.loading = false;
                        if (res != null && res.data.result) {
                            self.$message('签到成功!');
                            self.getData();
                        } else
                            self.$message.error("签到失败!请重试！");
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
