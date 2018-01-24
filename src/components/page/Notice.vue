<template>
    <div>
        <div class="table">
            <div class="top-btn">
                <el-button type="primary" @click="addModal">添加</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="content" label="内容" :formatter="formatter">
                </el-table-column>
                <el-table-column prop="pubDate" label="日期" width="200" sortable>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :pageSize="pageSum" :page-sizes="[2,4,6,8,10,12,14]" layout="total,sizes, prev, pager, next, jumper"  :total="sum">
                </el-pagination>
            </div>
            <!-- 模态框  :pivotY为垂直距离百分比 -->
            <modal name="notice-modal" transition="pop-out" :height="280" :pivotY="0.2">
                <div class="modal-form">
                    <el-form ref="form" label-width="90px" :rules="rules" :model="form">
                        <el-form-item label="公告内容" prop="content">
                            <el-input type="textarea" :rows="5" v-model="form.content"></el-input>
                        </el-form-item>
                        <el-form-item label="发布日期" prop="pubDate">
                            <!--span为长度 element-ui-->
                            <el-col :span="11">
                                <el-date-picker type="date" v-model="tempDate" style="width: 100%;"></el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item class="modal-btn-group">
                            <el-button type="primary" @click="onSubmit">提交</el-button>
                            <el-button @click="closeModal">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </modal>
        </div>
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
                tableData: [],
                cur_page: 1,
                isAdd: 0, // 0为添加，编辑时代表相应id
                sum: 0,
                pageSum: 10,
                tempDate: '', //时间控件临时值
                form: {
                    content: '',
                    pubDate: ''
                },
                rules: {
                    content: [{
                        required: true,
                        message: '请输入公告内容',
                        trigger: 'blur'
                    }],
                    pubDate: [{
                        required: true,
                        message: '请选择发布时间',
                        trigger: 'blur'
                    }]
                }
            };
        },
//    可获取dom节点后，获取列表数据
        mounted() {
            this.getData();
        },
        //时间控件转化  监控tempDate变化，自动执行
        watch: {
            tempDate: function(val) {
                this.form.pubDate = TransDateToString(val);
            }
        },
        methods: { handleSizeChange(val) {
            this.pageSum=val;
            this.getData();
        },
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() {
                let self = this;
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                this.$axios({
                        url: '/notice/list',
                        method: 'get',
                        params: {
                            curPage: self.cur_page,
                            pageSum: self.pageSum,
                            username:username,
                        }
                    })
                    .then((res) => {
                        if (res != null) {
                            self.tableData = res.data.list;
                            self.sum = res.data.sum;
                        }
                    })
            },
            formatter(row, column) {
//                console.log(row.id);
                return row.content;
            },
//            编辑的isAdd=row的实际id，添加时isAdd为0
            handleEdit(row) {
                this.form.content = row.content;
                this.tempDate = row.pubDate;
                this.isAdd = row.id;
                this.$modal.show('notice-modal');
            },
            handleDelete(index) {
                var self = this;
                MessageBox.confirm('确定删除？','提示',{type:'warning'}).then(function(action) {
                    self.$axios({
                            url: '/notice/delete',
                            method: 'post',
                            data: {
                                id: index
                            }
                        })
                        .then((res) => {
                            if (res) {
                                self.$message("删除成功");
                                self.getData();
                            }
                        });
                }).catch(function() {
                    console.log("取消公告管理删除");
                });
            },
            closeModal() {
                this.$modal.hide('notice-modal');
            },
            addModal() {
                this.form.content = '';
                this.tempDate = GetCurrentDate();
                this.isAdd = 0;
                this.$modal.show('notice-modal');
            },
            onSubmit() {
                const self = this;
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                self.$refs["form"].validate((valid) => {
                    if (valid) {
                        //添加
                        if (self.isAdd == 0) {
                            var content = self.form.content;
                            var date = self.form.pubDate;
                            self.$axios({
                                    url: '/notice/add',
                                    method: 'post',
                                    data: {
                                        content: content,
                                        pubDate: date,
                                        username:username
                                    }
                                })
                                .then((res) => {
                                    if (res != null) {
                                        self.getData();
                                        self.$message("添加成功");
                                        self.closeModal();
                                    }
                                })
                        } else {
                            var content = self.form.content;
                            var date = self.form.pubDate;
                            self.$axios({
                                    url: '/notice/edit',
                                    method: 'post',
                                    data: {
                                        id: self.isAdd,
                                        content: content,
                                        pubDate: date
                                    }
                                })
                                .then((res) => {
                                    if (res) {
                                        self.getData();
                                        self.$message("编辑成功");
                                        self.closeModal();
                                    }
                                })
                        }
                    }
                })
            }
        }
}
</script>
