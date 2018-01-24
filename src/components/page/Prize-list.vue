<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/prize-list/' }">
                    <i class="el-icon-date"></i>抽奖活动管理
                </el-breadcrumb-item>
                <el-breadcrumb-item >我发起的抽奖活动</el-breadcrumb-item>
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
        <!--&lt;!&ndash;抽奖活动模态框&ndash;&gt;-->
        <!--<modal name="prize-modal" transition="pop-out" :height="720" :resizable="true" :pivotY="0.2">-->
            <!--<div class="modal_close_btn">-->
                <!--<i class="el-icon-close" @click="closePrizeModal"></i>-->
            <!--</div>-->
            <!--<div class="modal-form">-->
                <!--<el-form ref="prizeForm" :model="prizeForm" :rules="rules" label-width="80px" >-->
                    <!--<el-form-item label="活动序号" prop="id">-->
                        <!--<el-input v-model="prizeForm.id"  class="form_middle "disabled></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="活动名称" prop="act_name">-->
                        <!--<el-input v-model="prizeForm.act_name"  class="form_middle"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="起始时间" prop="begin">-->
                        <!--<el-date-picker v-model="temBegin" type="datetime" placeholder="选择日期时间">-->
                        <!--</el-date-picker>-->
                    <!--</el-form-item>-->
                    <!--<br/>-->
                    <!--<el-form-item label="结束时间" prop="end">-->
                        <!--<el-date-picker v-model="temEnd" type="datetime" placeholder="选择日期时间">-->
                        <!--</el-date-picker>-->
                    <!--</el-form-item>-->
                    <!--<br/>-->
                    <!--<el-form-item label="兑奖码" prop="code">-->
                        <!--<el-input v-model="prizeForm.code" class="form_middle"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<br/>-->
                    <!--<el-form-item label="每天抽奖次数" prop="prize_num">-->
                        <!--<el-input v-model="prizeForm.prize_num"  class="form_small"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="分享是否增加次数" prop="share_num">-->
                        <!--<el-switch-->
                            <!--v-model="prizeForm.share_num"-->
                            <!--on-text="是" off-text="否"-->
                            <!--on-color="#13ce66"-->
                            <!--off-color="#ff4949">-->
                        <!--</el-switch>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="每天抽奖次数上限" prop="prize_max_num">-->
                        <!--<el-input v-model="prizeForm.prize_max_num"  class="form_small"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="抽奖活动规则说明" prop="prizedecoration">-->
                        <!--<span style="color: red">您在分段落换行时请添加&lt;br&nbsp;/&gt;符号</span>-->
                        <!--<br/>-->
                        <!--<el-input-->
                            <!--id="prizedecoration"-->
                            <!--type="textarea"-->
                            <!--:rows="2"-->
                            <!--:autosize="true"-->
                            <!--placeholder="请输入抽奖规则说明"-->
                            <!--v-model="prizeForm.prizedecoration">-->
                        <!--</el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item class="modal-btn-group">-->
                        <!--<el-button type="primary" @click="onPrizeSubmit">保存修改</el-button>-->
                        <!--<el-button @click="closePrizeModal">取消</el-button>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
            <!--</div>-->
        <!--</modal>-->
        <!--&lt;!&ndash;抽奖活动模态框结束&ndash;&gt;-->
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="活动id" sortable>
            </el-table-column>
            <el-table-column prop="name" label="活动名称">
            </el-table-column>
            <el-table-column prop="begin" label="起始日期" sortable>
            </el-table-column>
            <el-table-column prop="end" label="结束日期" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="success" @click="handleUser(scope.row.id)">用户管理</el-button>
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
                    name: '',
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
                prizeForm: {
                    act_name:'',
                    begin:'',
                    end:'',
                    code:'',
                    prize_num: '',
                    share_num: true,
                    prize_max_num:'',
                    prizedecoration: '',
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
                    code:[{
                        required: true,
                        message: '请填写兑奖码',
                        trigger: 'blur'
                    }],
                    prize_num:[{
                        required: true,
                        message: '请设定每天抽奖次数',
                        trigger: 'blur'
                    }],
                    prize_max_num:[{
                        required: true,
                        message: '请设定每天抽奖次数上限',
                        trigger: 'blur'
                    }],
                    prizedecoration:[{
                        required:true,
                        message:'请填写抽奖规则',
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
            getData() {
                const self = this;
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                self.$axios({
                    url: '/prize/list-prize',
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
            handleDelete(id) {
                const self = this;
                MessageBox.confirm('确定删除？').then(function(action) {
                    self.$axios({
                        url: '/prize/delete-prize-param',
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
                    console.log("取消活动删除");
                });

            },
            handleEdit(id) {
                this.linkToOtherUrl(id,"/prize-launch/");
            },
            handleUser(id){
                this.linkToOtherUrl(id,"/prize-list/user/");
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
