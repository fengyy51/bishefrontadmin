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
                <el-button type="primary" @click="openMuban">奖项模板下载</el-button>
                <span style="font-size: 13px;color:red">此处为上传奖项、奖品数据配置，请上传前将单元格格式设置好</span>
            </div>
        </div>

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
import FileUpload from 'vue-upload-component'
import {
    MessageBox
} from 'element-ui';



export default {
    data() {
        return {
            attence: '',
            info:'',
            attenceFile: {},
            files:[],
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
    components: {
        FileUpload
    },
    methods: {
        openMuban(){
            window.open('/static/muban.xlsx','_self');
        },
        inputFilter(newFile, oldFile, prevent) {
            if (newFile && !oldFile) {
                // Before adding a file
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
        },
        /**
         * Has changed
         * @param  Object|undefined   newFile   只读
         * @param  Object|undefined   oldFile   只读
         * @return undefined
         */
//        inputFile: function (newFile, oldFile) {
//            if (newFile && oldFile && !newFile.active && oldFile.active) {
//                // 获得相应数据
//                console.log('response', newFile.response)
//                if (newFile.xhr) {
//                    //  获得响应状态码
//                    console.log('status', newFile.xhr.status)
//                }
//            }
//        },
//        /**
//         * Pretreatment
//         * @param  Object|undefined   newFile   读写
//         * @param  Object|undefined   oldFile   只读
//         * @param  Function           prevent   阻止回调
//         * @return undefined
//         */
//        inputFilter: function (newFile, oldFile, prevent) {
//            if (newFile && !oldFile) {
//                // 过滤不是excel后缀的文件
//                if (!/\.(xlsx)$/i.test(newFile.name)) {
//                    return prevent()
//                }
//            }
//
//        },
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

<style>
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
</style>
