<template>
    <div>
        <div class="search_form">
            <el-form ref="search_form" :model="search_form">
                <el-form-item class="top_search">
                    <el-radio-group v-model="search_form.type">
                        <el-radio class="radio" :label="0">一等奖与二等奖</el-radio>
                        <el-radio class="radio" :label="1">三等奖与幸运奖</el-radio>
                        <el-radio class="radio" :label="2">不限量奖</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-button type="success" @click="searchHandle">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="top-btn">
            <el-button type="primary" @click="openChangeNumModal">修改数量</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading.body="loading">
            <el-table-column label="奖品序号" prop="id">
            </el-table-column>
            <el-table-column label="种类" prop="type">
                <template scope="scope">
                    <div v-if="scope.row.type === 1">
                        一等奖
                    </div>
                    <div v-else-if="scope.row.type == 2">
                        二等奖
                    </div>
                    <div v-else-if="scope.row.type == 3">
                        三等奖
                    </div>
                    <div v-else>
                        幸运奖
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="名称" prop="name">
            </el-table-column>
            <el-table-column label="库存" prop="num">
            </el-table-column>
        </el-table>
        <!-- 修改数量 -->
        <modal name="change-num-modal" transition="pop-out" :height="200" :pivotY="0.2">
            <div class="modal-form">
                <el-form ref="change-num-modal" label-width="90px">
                    <el-form-item label="奖品序号">
                        <el-input type="text" v-model="changeNumForm.id" class="form_small"></el-input>
                    </el-form-item>
                    <el-form-item label="数量">
                        <el-input type="text" v-model="changeNumForm.num" class="form_small"></el-input>
                    </el-form-item>
                    <el-form-item class="modal-btn-group">
                        <el-button type="primary" @click="onChangeNumSubmit">提交</el-button>
                        <el-button @click="closeChangeNumModal">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </modal>
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
                type: 0
            },
            changeNumForm: {
                id: '',
                num: ''
            },
            tableData: [],
            // pageSum: 10,
            // sum: 0,
            // cur_page: 1,
            loading: false,
            collectId: 1
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        openChangeNumModal() {
            this.changeNumForm.id = '';
            this.changeNumForm.num = '';
            this.$modal.show('change-num-modal');
        },
        closeChangeNumModal() {
            this.$modal.hide('change-num-modal');
        },
        onChangeNumSubmit() {
            var id = this.changeNumForm.id;
            var num = this.changeNumForm.num;
            const self = this;
            console.log(id + ":" + num);
            self.$axios({
                    url: '/prize/change-num',
                    method: 'post',
                    params: {
                        id: id,
                        num: num,
                        relationId: self.collectId
                    }
                })
                .then((res) => {
                    if (res != null && res.data.result) {
                        self.getData();
                        self.$message('修改成功!');
                    } else
                        self.$message.error("修改失败！请确保id为不限量奖品");
                    self.$modal.hide('change-num-modal');
                })
        },
        getData() {
            const self = this;
            self.$axios({
                    url: '/prize/list',
                    method: 'get',
                    params: {
                        type: self.search_form.type,
                        relationId: self.collectId
                    }
                })
                .then((res) => {
                    if (res != null) {
                        self.tableData = res.data.list;
                    }
                })
        },
        searchHandle() {
            this.getData();
        }
    }
}
</script>
