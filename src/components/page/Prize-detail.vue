<template>
    <div>
        <div class="upload">
            <ul>
                <li v-for="(file, index) in files" :key="file.id">
                    <span>{{file.name}}</span> -
                    <!--<span>{{file.size | formatSize}}</span> - -->
                    <span v-if="file.error">上传失败</span>
                    <span v-else-if="file.success">成功</span>
                    <span v-else-if="file.active">上传中</span>
                    <span v-else></span>
                </li>
            </ul>
            <div class="example-btn">
                <file-upload
                    prop="files"
                    class="btn btn-primary"
                    post-action="http://localhost:8083/manual/excel/prize"
                    extensions=""
                    accept="xlsx,xls"
                    :multiple="false"
                    :size="1024 * 1024 * 10"
                    v-model="files"
                    @input-filter="inputFilter"
                    @input-file="inputFile"
                    ref="upload">
                    <i class="fa fa-plus"></i>
                    选择excel表
                </file-upload>
                <el-button type="success"  v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                    开始上传
                </el-button>
                <el-button type="danger"   v-else @click.prevent="$refs.upload.active = false">
                    <i class="fa fa-stop" aria-hidden="true"></i>
                    停止上传
                </el-button>
                <el-button type="primary" @click="openMuban">奖品数据模板下载</el-button>
                <span style="font-size: 13px;color:red">此处为上传奖项、奖品数据配置，请上传前将单元格格式设置好</span>
            </div>
        </div>

        <div class="search_form">
            <el-form ref="search_form" :model="search_form"  >
                <el-form-item class="top_search">
                    <el-select v-model="search_form.actName" placeholder="请选择关联抽奖活动">
                        <el-option :name="search_form.actName" v-for="item in actNameList"  :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-select v-model="search_form.type" placeholder="请选择奖项类型" >
                        <el-option  :name="search_form.type" v-for="item in typeList"  :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="top_search">
                    <el-input v-model="search_form.name" placeholder="请输入奖品名称"></el-input>
                </el-form-item>

                <el-form-item class="top_search">
                    <el-button type="success" @click="searchHandle">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--<div class="top-btn">-->
            <!--<el-button type="primary" @click="openChangeNumModal">修改数量</el-button>-->
        <!--</div>-->
        <el-table :data="tableData" border style="width: 100%" v-loading.body="loading">
            <el-table-column label="奖品序号" prop="id">
            </el-table-column>
            <el-table-column label="关联活动" prop="actName">
            </el-table-column>
            <el-table-column label="种类" prop="type">
            </el-table-column>
            <el-table-column label="名称" prop="name">
            </el-table-column>
            <el-table-column label="库存" prop="num">
            </el-table-column>
            <el-table-column label="抽中概率" prop="ratio">
            </el-table-column>
            <el-table-column label="奖品说明" prop="info">
            </el-table-column>
            <el-table-column label="兑奖时间" prop="duijiangTime">
            </el-table-column>
            <el-table-column label="兑奖地点" prop="duijiangLoc">
            </el-table-column>
            <el-table-column label="操作">
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
        <!-- 修改数具 -->
        <modal name="change-num-modal" transition="pop-out" :height="700" :pivotY="0.2">
            <div class="modal_close_btn">
                <i class="el-icon-close" @click="closeChangeNumModal"></i>
            </div>
            <div class="modal-form">
                <el-form ref="change-num-modal" label-width="90px">
                    <el-form-item label="奖品序号">
                        <el-input type="text" v-model="changeNumForm.id" :disabled="true" class="form_small"></el-input>
                    </el-form-item>
                    <el-form-item label="关联活动">
                        <el-input type="text" v-model="changeNumForm.actName" :disabled="true" ></el-input>
                    </el-form-item>
                    <el-form-item label="名称" >
                        <el-input type="text" v-model="changeNumForm.name" class="form_middle"></el-input>
                    </el-form-item>
                    <el-form-item label="种类">
                        <el-input type="text" v-model="changeNumForm.type" class="form_small"></el-input>
                    </el-form-item>
                    <el-form-item label="库存">
                        <el-input type="text" v-model="changeNumForm.num" class="form_small"></el-input>
                    </el-form-item>
                    <el-form-item label="抽中概率">
                        <el-input type="text" v-model="changeNumForm.ratio" class="form_small"></el-input>
                    </el-form-item>
                    <el-form-item label="奖品说明">
                        <el-input type="text" v-model="changeNumForm.info" ></el-input>
                    </el-form-item>
                    <el-form-item label="兑奖时间">
                        <el-input type="text" v-model="changeNumForm.duijiangTime" class="form_middle"></el-input>
                    </el-form-item>
                    <el-form-item label="兑奖地点">
                        <el-input type="text" v-model="changeNumForm.duijiangLoc" class="form_middle"></el-input>
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
        TransDetailDateToString,
        TransDetailStringToDate
    } from '../../util/date-helper.js';
import FileUpload from 'vue-upload-component'
import {
    MessageBox
} from 'element-ui';
export default {
    data() {
        return {
            files:[],
            search_form: {
                name:'',
                type:'',
                actName:''
            },
            typeList: [],
            actNameList:[],
            changeNumForm: {
                id: '',
                num: ''
            },
            tableData: [],
             pageSum: 8,
             sum: 0,
             cur_page: 1,
            loading: false,

        }
    },
    mounted() {
        this.getSearch();
    },
    components: {
        FileUpload
    },
    methods: {
        //导入excel，模板
        openMuban(){
            window.open('/static/muban.xlsx','_self');
        },
        inputFilter(newFile, oldFile, prevent) {
            if (newFile && !oldFile) {
                // 添加文件前
                // Filter system files or hide files
                // 过滤系统文件 和隐藏文件
                if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
                    return prevent()
                }
                // Filter php html js file
                // 过滤 php html js 文件
                if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
                    return prevent()
                }
            }
        },

        inputFile(newFile, oldFile) {
            if (newFile && !oldFile) {
                // add
                console.log('add', newFile)
            }
            if (newFile && oldFile) {
                // update
                console.log('update', newFile)
            }

            if (!newFile && oldFile) {
                // remove
                console.log('remove', oldFile)
            }
            if (newFile && oldFile && !newFile.active && oldFile.active) {
//                // 获得相应数据
                console.log('response', newFile.response)
                if (newFile.xhr) {
                    //  获得响应状态码
                    console.log('status', newFile.xhr.status)
                }
            }
        },
//导入excel，模板
        handleSizeChange(val) {
            this.pageSum=val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        openChangeNumModal() {
            this.$modal.show('change-num-modal');
        },
        closeChangeNumModal() {
            this.$modal.hide('change-num-modal');
        },
        onChangeNumSubmit() {
            var id = this.changeNumForm.id;
            var actName=this.changeNumForm.actName;
            var num = this.changeNumForm.num;
            var name=this.changeNumForm.name;
            var type=this.changeNumForm.type;
            var ratio=this.changeNumForm.ratio;
            var info=this.changeNumForm.info;
            var duijiangTime=this.changeNumForm.duijiangTime;
            var duijiangLoc=this.changeNumForm.duijiangLoc;
            const self = this;
            console.log(id + ":" + num);
            self.$axios({
                    url: '/prize/change-num',
                    method: 'post',
                    params: {
                        id: id,
                        num: num,
                        actName: actName,
                        name:name,
                        type:type,
                        ratio:ratio,
                        info:info,
                        duijiangTime:duijiangTime,
                        duijiangLoc:duijiangLoc
                    }
                })
                .then((res) => {
                    if (res != null && res.data.result) {
                        self.getData();
                        self.$message('修改成功!');
                    } else
                        self.$message.error("修改失败");
                    self.$modal.hide('change-num-modal');
                })
        },
        getSearch(){
            const self=this;
            var wsCache = window.$wsCache;
            var username=wsCache.get("username");
            self.$axios({
                url:'prize/search',
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
        getData() {
            const self = this;
            var type=self.search_form.type;
            console.log(self.search_form.type);
            if(self.search_form.type==null){
                type='';
            }
            if(self.search_form.actName==''){
                self.$message.info("请选择关联的抽奖活动！");
            }else{
                self.$axios({
                    url: '/prize/list',
                    method: 'get',
                    params: {
                        name:self.search_form.name,
                        type: type,
                        actName: self.search_form.actName,
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

        },
        searchHandle() {
            this.getData();
        },
        handleDelete(id) {
            const self = this;
            MessageBox.confirm('确定删除？').then(function(action) {
                self.$axios({
                    url: '/prize/param/delete',
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
        handleEdit(row) {
            this.changeNumForm.id = row.id;
            this.changeNumForm.actName=row.actName;
            this.changeNumForm.num = row.num;
            this.changeNumForm.type=row.type;
            this.changeNumForm.name=row.name;
            this.changeNumForm.info=row.info;
            this.changeNumForm.ratio=row.ratio;
            this.changeNumForm.duijiangTime=row.duijiangTime;
            this.changeNumForm.duijiangLoc=row.duijiangLoc;
            this.openChangeNumModal();
        },
    }
}
</script>

<style scoped>
    .btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}
    .btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}
    .btn-primary.focus,.btn-primary:focus{box-shadow:0 0 0 3px rgba(0,123,255,.5)}
    .btn-primary.disabled,.btn-primary:disabled{background-color:#007bff;border-color:#007bff}
    .btn-primary.active,.btn-primary:active,.show>.btn-primary.dropdown-toggle{background-color:#0069d9;background-image:none;border-color:#0062cc}
    .example-simple label.btn {
        margin-bottom: 0;
        margin-right: 1rem;
    }
    .btn-success,.btn-success:hover,.btn-success:focus {
        color: #fff;
        background-color: #28a745;
        border-color: #28a745;
    }
    .file-uploads {
    overflow: hidden;
    position: relative;
    text-align: center;
    display: inline-block;
    }

    .btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
    }

    .btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: .5rem .75rem;
    font-size: 1rem;
    line-height: 1.25;
    border-radius: .25rem;
    transition: all .15s ease-in-out;
    }
    .file-uploads {
        overflow: hidden;
        position: relative;
        text-align: center;
        display: inline-block;
    }
    .file-uploads.file-uploads-html4 input[type="file"] {
        opacity: 0;
        font-size: 20em;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .file-uploads.file-uploads-html5 input[type="file"] {
        overflow: hidden;
        position: fixed;
        width: 1px;
        height: 1px;
        z-index: -1;
        opacity: 0;
    }
    .example-simple label.btn {
        margin-bottom: 0;
        margin-right: 1rem;
    }
    /*//抽奖*/
    .top-btn-left{
        float: left;
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
    .green{
        color: #04be02;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .modal-form {
        margin-top: 40px;
    }
    #prizedecoration{
        width: 450px!important;
        height: 40px!important;
    }
</style>
