<template>
    <div>
        <div class="search_form">
            <el-form ref="search_form" :model="search_form">
                <el-form-item class="top_search">
                    <el-input v-model="search_form.name" class="search_input" placeholder="搜索名称"></el-input>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-select v-model="search_form.area" placeholder="所在区">
                        <el-option label="所有" value="-1"></el-option>
                        <el-option label="一区" value="1"></el-option>
                        <el-option label="二区" value="2"></el-option>
                        <el-option label="三区" value="3"></el-option>
                        <el-option label="四区" value="4"></el-option>
                        <el-option label="五区" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-select v-model="search_form.floor" placeholder="所在楼层">
                        <el-option label="所有" value="-1"></el-option>
                        <el-option label="一楼" value="1"></el-option>
                        <el-option label="二楼" value="2"></el-option>
                        <el-option label="三楼" value="3"></el-option>
                        <el-option label="四楼" value="4"></el-option>
                        <el-option label="五楼" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-button type="success" @click="searchHandle">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="top-btn">
            <el-button type="primary" @click="linkToDetail('0')">添加</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="店铺名称">
            </el-table-column>
            <el-table-column prop="area" label="所在区">
                <template scope="scope">
                    <div v-if="scope.row.area === 1">
                        一区
                    </div>
                    <div v-else-if="scope.row.area == 2">
                        二区
                    </div>
                    <div v-else-if="scope.row.area == 3">
                        三区
                    </div>
                    <div v-else-if="scope.row.area == 4">
                        四区
                    </div>
                    <div v-else>
                        五区
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="floor" label="所在楼层">
                <template scope="scope">
                    <div v-if="scope.row.floor === 1">
                        一楼
                    </div>
                    <div v-else-if="scope.row.floor == 2">
                        二楼
                    </div>
                    <div v-else-if="scope.row.floor == 3">
                        三楼
                    </div>
                    <div v-else-if="scope.row.floor == 4">
                        四楼
                    </div>
                    <div v-else>
                        五楼
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
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
<style type="text/css">
.search_input {
    width: 150px!important;
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
                    name: '',
                    area: '',
                    floor: ''
                },
                tableData: [],
                pageSum: 10,
                sum: 0,
                cur_page: 1
            }
        },
        watch: {

        },
        mounted() {
            this.getData();
        },
        methods: {
            linkToDetail(id) {
                if (id == 0)
                    this.$router.push("/shop-list/detail/0");
                else
                    this.$router.push("/shop-list/detail/" + id);
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
                self.$axios({
                        url: '/shop/list',
                        method: 'get',
                        params: {
                            name: self.search_form.name,
                            area: self.search_form.area,
                            floor: self.search_form.floor,
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
                            url: '/shop/delete',
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
                    console.log("取消店铺删除");
                });
            },
            handleEdit(id) {
                this.linkToDetail(id);
            }
        }
}
</script>
