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
                <el-form-item class="top_search">
                    <el-input v-model="search_form.id" class="search_input" placeholder="请输入选择序号"></el-input>
                </el-form-item>
                <el-form-item class="top_search" prop="actName">
                    <el-select v-model="search_form.actName" placeholder="请选择投票活动名称">
                        <el-option :name="search_form.actName" v-for="item in actNameList"  :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="top_search" prop="begin">
                    <el-date-picker v-model="tempBegin" type="datetime" placeholder="选择起始日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="top_search" prop="end">
                    <el-date-picker v-model="tempEnd" type="datetime" placeholder="选择结束日期时间">
                    </el-date-picker>
                </el-form-item>
                <!--<el-form-item class="top_search" prop="interval">-->
                    <!--<el-select v-model="search_form.interval"  placeholder="请选择时间区间">-->
                        <!--<el-option-->
                            <!--v-for="item in options"-->
                            <!--:key="item.value"-->
                            <!--:label="item.label"-->
                            <!--:value="item.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item class="top_search" prop="num">
                    <el-input v-model="search_form.num" class="search_input" placeholder="输入票数上限"></el-input>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-button type="success" @click="searchHandle">查看具体数据</el-button>
                    <el-button type="success" @click="searchHandleNum">查看统计个数</el-button>
                </el-form-item>
                <el-tag type="danger" class="collect_top_tag">共{{sum}}个结果</el-tag>
            </el-form>
        </div>
        <el-table :data="tableData" border style="width: 100%;display: none;" id="detailtable">
            <el-table-column prop="id" label="投票活动序号" sortable>
            </el-table-column>
            <el-table-column prop="ip" label="ip地址" :formatter="formatter_ip"sortable>
            </el-table-column>
            <el-table-column prop="addtime" label="添加时间" sortable>
            </el-table-column>
            <el-table-column prop="record" label="投票记录" sortable>
            </el-table-column>
            <el-table-column prop="openId" label="微信id" sortable>
            </el-table-column>
            <el-table-column prop="useragent" label="投票设备" sortable>
            </el-table-column>
            <!--<el-table-column label="操作">-->
                <!--<template scope="scope">-->
                    <!--<el-button size="small" type="success" @click="handleResult(scope.row.id)">查看投票结果</el-button>-->
                <!--</template>-->
            <!--</el-table-column>-->
        </el-table>
        <div class="pagination" id="detailpagination"  style="display: none;" >
            <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :pageSize="pageSum" :page-sizes="[2,4,6,8,10,12,14]" layout="total,sizes, prev, pager, next, jumper"  :total="sum">
            </el-pagination>
        </div>
        <el-table :data="numtableData" border style="width: 100%;display: none;" id="numtable">
            <el-table-column prop="voteId" label="投票活动序号" :formatter="formatter_voteId">
            </el-table-column>
            <el-table-column prop="id" label="投票选择序号" sortable>
            </el-table-column>
            <el-table-column prop="num" label="时间区间内投票个数" :formatter="formatter_num"sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="success" @click="handleResult(scope.row.voteId,scope.row.id)">投票结果修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination" id="numpagination"  style="display: none;" >
            <el-pagination  @size-change="handleSizeChangeNum" @current-change="handleCurrentChangeNum"
                             :pageSize="numpageSum" :page-sizes="[2,4,6,8,10,12,14]" layout="total,sizes, prev, pager, next, jumper"  :total="numsum">
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
                search_form:{
                    id:'',
                    actName:'',
                    begin:'',
                    end:'',
//                    interval:'',
                    num:'',
                },
                tempBegin: '',
                tempEnd: '',
                tableData: [],
                numtableData:[],
                numpageSum:5,
                pageSum: 5,
                sum: 0,
                numsum:0,
                cur_page: 1,
                numcur_page:1,
                actNameList:[],
//                options: [{
//                    label: '1秒',
//                    value: '1',
//                }, {
//                    label: '1分钟',
//                    value:'60',
//                }, {
//                    label: '5分钟',
//                    value:'300'
//                }, {
//                    label: '10分钟',
//                    value:'600'
//                }, {
//                    label: '30分钟',
//                    value:'1800'
//                }, {
//                    label: '1小时',
//                    value:'3600'
//                }, {
//                    label: '1天',
//                    value:'86400'
//                }],
                rules: {
                    actName: [{
                        required: true,
                        message: '请选择投票活动名称',
                        trigger: 'blur'
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
//                    interval: [{
//                        required: true,
//                        message: '请选择时间区间',
//                        trigger: 'blur'
//                    }],
                    num: [{
                        required: true,
                        message: '请输入票数上限',
                        trigger: 'blur'
                    }],
                }
            }
        },
        watch: {
            tempBegin: function(val) {
                this.search_form.begin = TransDetailDateToString(val);
            },
            tempEnd: function(val) {
                this.search_form.end = TransDetailDateToString(val);
            },
        },
        mounted() {
            this.getSearch();
        },
        methods: {
            formatter_ip(row,column){
                return row.ip;
            },
            formatter_voteId(row,column){
                return row.voteId;
            },
            formatter_num(row,column){
                return row.num;
            },
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
            searchHandleNum(){
                this.getNumData();
            },
            searchHandle() {
                this.getData();
            }, handleSizeChange(val) {
                this.pageSum=val;
                this.getData();
            }, handleSizeChangeNum(val) {
                this.numpageSum=val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            handleCurrentChangeNum(val) {
                this.numcur_page = val;
                this.getNumData();
            },
            getNumData() {
                const self = this;
                self.$refs["search_form"].validate((valid) => {
                    if (valid) {
                        document.getElementById("detailtable").style.display='none';
                        document.getElementById("detailpagination").style.display='none';
                        document.getElementById("numtable").style.display='block';
                        document.getElementById("numpagination").style.display='block';
                        var id = self.search_form.id;
                        var num=self.search_form.num;
                        if(id==''){
                            id=-1;
                        }
                        self.$axios({
                            url: '/collect/brush-list-num',
                            method: 'get',
                            params: {
                                id:id,
                                actName: self.search_form.actName,
//                              /interval: parseInt(self.search_form.interval),
                                begin: self.search_form.begin,
                                end: self.search_form.end,
                                num:num,
                                curPage: self.numcur_page,
                                pageSum: self.numpageSum
                            }
                        })
                            .then((res) => {
                                if (res != null) {
                                    self.numtableData = res.data.list;
                                    self.numsum = res.data.sum;
                                }
                            })
                    }

                })
            },
            getData() {
                const self = this;
                self.$refs["search_form"].validate((valid) => {
                    if (valid) {
                        document.getElementById("detailtable").style.display='block';
                        document.getElementById("detailpagination").style.display='block';
                        document.getElementById("numtable").style.display='none';
                        document.getElementById("numpagination").style.display='none';
                        var id = self.search_form.id;
                        var num=self.search_form.num;
                        if(id==''){
                            id=-1;
                        }
                        self.$axios({
                            url: '/collect/brush-list',
                            method: 'get',
                            params: {
                                id:id,
                                actName: self.search_form.actName,
//                              /interval: parseInt(self.search_form.interval),
                                begin: self.search_form.begin,
                                end: self.search_form.end,
                                num:num,
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
            handleResult(voteId,id){
                this.$router.push("/vote-list/result/"+voteId+"/"+id);
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
