<template name="SingleImg">
    <div>
        <el-upload class="avatar-uploader" v-bind:class="{'size_1_1': size_1_1, 'size_4_3': size_4_3 }" :action="actionUrl" :show-file-list="true" :on-success="handleSuccess" :before-upload="beforeUpload" name="file" :on-remove="handleRemove" :file-list="fileList">
            <img v-if="imageUrl" :src="imageUrl" class="size_default_img" v-bind:class="{'size_1_1_img': size_1_1, 'size_4_3_img': size_4_3 }">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>
<script>
import {
    MessageBox
} from 'element-ui';
export default {
    props: ['img', 'actionUrl','size11','size43'],
    data() {
        return {
            imageUrl: this.img || '',
            isRepeat: false,
            fileList: [],
            size_1_1: this.size11 || false,
            size_4_3: this.size43 || false
        }
    },
    watch: {
        imageUrl: function(val) {
            this.$emit("imgChange", val);
        },
        img: function(val) {
            this.imageUrl = val;
            if (val != '') {
                var obj = {
                    name: decodeURI(decodeURI(val.split('---')[1])),
                    url: val
                }
                this.fileList.push(obj);
            }
        }
    },
    methods: {
        handleSuccess(res, file) {
            if (res.code == 200) {
                this.$emit("handleChange");
                this.imageUrl = res.data;
            } else
                this.$message.error("上传文件失败");
        },
        handleRemove(file, fileList) {
            const self = this;

            if (this.isRepeat) {
                //多张上传回调
                this.isRepeat = false;
                return;
            }

            MessageBox.confirm('确定删除？').then(function(action) {
                console.log("sss");
                self.$axios({
                        url: '/delete/img',
                        method: 'post',
                        data: {
                            path: self.imageUrl
                        }
                    })
                    .then((res) => {
                        if (res != null) {
                            self.$emit("handleChange");
                            self.imageUrl = '';
                            self.fileList = [];
                        }
                    })
            }).catch(function() {
                console.log("取消照片删除");
                fileList.push(file);
            });

        },
        beforeUpload(file) {
            if (this.imageUrl != '') {
                this.$message.error("不支持多张上传，请先删除");
                this.isRepeat = true;
                return false;
            } else {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt5M = file.size / 1024 / 1024 < 5;

                if (!isJPG && !isPNG) {
                    this.$message.error('上传头像图片要求JPG或PNG格式!');
                }
                if (!isLt5M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                }
                return (isJPG || isPNG) && isLt5M;
            }
        }
    }
}

</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 138px;
    height: 138px;
}

.size_1_1 .el-upload  {
    width: 138px !important;
    height: 138px !important;
}

.size_4_3 .el-upload {
    width: 184px !important;
    height: 138px !important;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
/*    width: 138px;
    height: 138px;*/
    line-height: 138px;
    text-align: center;
}

.size_1_1_img {
    width: 138px !important;
    height: 138px !important;
    display: block;
}

.size_4_3_img {
    width: 184px !important;
    height: 138px !important;
    display: block;
}

.size_default_img {
    width: 138px;
    height: 138px;
    display: block;
}


.el-upload-list {
    width: 138px!important;
}

</style>
