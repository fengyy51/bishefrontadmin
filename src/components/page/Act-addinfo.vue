<template>
    <div>
        <div class="top-left-btn">
            <el-button  @click="reActDetail">返回活动编辑</el-button>
            <el-button type="primary" @click="addModal">添加</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="title" label="项目名称" :formatter="formatter_title" sortable>
            </el-table-column>
            <el-table-column prop="dtype" label="类型" :formatter="formatter_dtype">
            </el-table-column>
            <el-table-column prop="ifneed" label="是否必填"  >
            </el-table-column>
            <el-table-column prop="tableoptions" label="选项" :formatter="formatter_options" empty-text="无">
            </el-table-column>
            <el-table-column label="操作"  width="200">
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
        <modal name="addinfo-modal" transition="pop-out" height="auto" :scrollable="true" :resizable="true" :pivotY="0.2">
            <div class="modal-form">
                <el-form ref="form" label-width="90px" :rules="rules" :model="form">
                    <el-form-item label="名称" prop="title" >
                        <el-input v-model="form.title" placeholder="请输入报名项名称"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="dtype">
                        <el-select v-model="form.dtype" placeholder="请选择报名项类型">
                            <el-option label="输入框" value="输入框"></el-option>
                            <el-option label="多文本" value="多文本"></el-option>
                            <el-option label="下拉" value="下拉"></el-option>
                            <el-option label="多选" value="多选"></el-option>
                            <el-option label="图片" value="图片"></el-option>
                            <el-option label="单选" value="单选"></el-option>
                            <el-option label="日期" value="日期"></el-option>
                            <el-option label="数字" value="数字"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否必填" prop="ifneed">
                        <el-switch  on-text="是" off-text="否" v-model="form.ifneed"></el-switch>
                    </el-form-item>
                    <el-form-item v-if="form.dtype=='下拉'||form.dtype=='多选'||form.dtype=='单选'"
                                     v-for="(option, index) in form.options"
                                     :label="'选项' + index"
                                     :key="option.key"
                                     :prop="'options.' + index + '.value'"
                                     :rules="{
                    required: true, message: '选项不能为空', trigger: 'blur'
                    }">
                        <el-input v-model="option.value"  class="form_small"></el-input>
                        <el-button @click.prevent="removeOption(option)">删除</el-button>
                    </el-form-item>
                    <el-form-item v-if="form.dtype=='下拉'||form.dtype=='多选'||form.dtype=='单选'">
                        <el-button type="primary" @click="addOption">增加</el-button>
                    </el-form-item>
                    <el-form-item class="modal-btn-group">
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button @click="closeModal">取消</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </modal>
    </div>
</template>
<script >
    import {
        MessageBox
    } from 'element-ui';
    export default {
        data(){
            return {
                tableData:[],
                cur_page: 1,
                isAdd: 0, // 0为添加，编辑时代表相应id
                sum: 0,
                pageSum: 10,
                type_name: '',
                form: {
                    options:[{
                        value:''
                    }],
                    title: '',
                    dtype: '',
                    ifneed:false,
                },
                rules: {
                    title: [{
                        required: true,
                        message: '请输入报名项标题',
                        trigger: 'blur'
                    }],
                    dtype: [{
                        required: true,
                        message: '请选择报名项类型',
                        trigger: 'change'
                    }]
                }
            }
        },
        mounted() {
            var id = this.$route.params.id;
            this.type_name = id == 0 ? "添加报名项" : "编辑报名项";
            this.id = id;
            this.getData();
        },
        methods:{
            resetForm(){
                this.form.title="";
                this.form.ifneed=false;
                this.form.dtype="";
                this.form.options=[{
                    value:'',
                    key:Date.now()
                }];
            },
            removeOption(item){
                var index=this.form.options.indexOf(item);
                if(index!==-1){
                    this.form.options.splice(index,1);
                }
            },
            addOption(){
                this.form.options.push({
                    value:'',
                    key:Date.now()
                });
            },
            reActDetail(){
                var id=this.$route.params.id;
//                console.log(id);
                this.linkToOtherUrl(id,'/act-list/detail/');
            },
            linkToOtherUrl(id, url) {
                if (id == 0)
                    this.$router.push(url + "0");
                else
                    this.$router.push(url + id);
            },
            formatter_title(row, column) {
                return row.title;
            },
            formatter_dtype(row,column){
                return row.dtype;
            },
            formatter_options(row,column){
                return row.options;
            },
            handleSizeChange(val) {
                this.pageSum=val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            //获取列表
            getData() {
                var wsCache = window.$wsCache;
                var username=wsCache.get("username");
                const self = this;
                self.$axios({
                    url: '/act/reg_item_list',
                    method: 'get',
                    params: {
                        curPage: self.cur_page,
                        pageSum: self.pageSum,
                        username:username
                    }
                })
                    .then((res) => {
                        if (res != null) {
                            self.tableData = res.data.list;
                            self.sum = res.data.sum;
                        }
                    })
            },
//            增加时清空初始
            addModal(){
                this.$modal.show('addinfo-modal');
                this.resetForm();
            },
//            关闭时清空
            closeModal(){
                this.$modal.hide("addinfo-modal");
                this.resetForm();
            },
            //            编辑的isAdd=row的实际id，添加时isAdd为0
            handleEdit(row) {
                if('true'==row.ifneed){
                    this.form.ifneed=true;
                }else{
                    this.form.ifneed=false;
                }
                this.form.title = row.title;
                this.form.dtype = row.dtype;
                var options=row.options.split('@@@');
                this.isAdd = row.id;
                this.form.options.splice(0,this.form.options.length);
                for(var i=0;i<options.length;i++){
                    if(options[i]!=""){
                        this.form.options.push({
                            value:options[i],
                            key:Date.now()
                        });
                    }
                }
                this.$modal.show('addinfo-modal');
            },
            handleDelete(index) {
                var self = this;
                MessageBox.confirm('确定删除？','提示',{type:'warning'}).then(function(action) {
                    var wsCache = window.$wsCache;
                    var username=wsCache.get("username");
                    self.$axios({
                        url: '/act/reg_item_delete',
                        method: 'post',
                        data: {
                            id: index,
                            username:username
                        }
                    })
                        .then((res) => {
                            if (res) {
                                self.$message("删除成功");
                                self.getData();
                            }
                        });
                }).catch(function() {
                    console.log("取消报名项删除");
                });
            },
            onSubmit() {
                const self = this;
                self.$refs["form"].validate((valid) => {
                    if (valid) {
                        var optionstr=self.form.options;
                        var options=[];
                        for(var i=0;i<optionstr.length;i++){
                            options.push(optionstr[i].value);
                        }
                        options=options.join("@@@");

                        //添加
                        if (self.isAdd == 0) {
                            var wsCache = window.$wsCache;
                            var username=wsCache.get("username");
                            var title = self.form.title;
                            var dtype = self.form.dtype;
                            var ifneed= self.form.ifneed;
                            self.$axios({
                                url: '/act/reg_item_add',
                                method: 'post',
                                data: {
                                    title: title,
                                    dtype: dtype,
                                    ifneed: ifneed,
                                    username:username,
                                    options:options,
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
                            var wsCache = window.$wsCache;
                            var username=wsCache.get("username");
                            var title = self.form.title;
                            var dtype = self.form.dtype;
                            var ifneed= self.form.ifneed;
                            self.$axios({
                                url: '/act/reg_item_edit',
                                method: 'post',
                                data: {
                                    id: self.isAdd,
                                    title: title,
                                    dtype: dtype,
                                    ifneed: ifneed,
                                    options:options,
                                    username:username
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
<style type="text/css" scope>
</style>
