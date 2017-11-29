<template>
    <div id="multi_img_div">
        <el-upload :action="actionUrl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeUpload" name="file" :file-list="imgs">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
import {
    MessageBox
} from 'element-ui';
export default {
    props: ['actionUrl', 'imgArray'],
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            imgs: this.imgArray || []
        };
    },
    watch: {
        imgs: function(val) {
            this.$emit("imgsChange", val);
        },
        imgArray: function(val) {
            this.imgs = val;
        }
    },
    methods: {
        handleRemove(file, fileList) {
            const uid = file.uid;
            const self = this;
            MessageBox.confirm('确定删除？').then(function(action) {
                self.$axios({
                        url: '/delete/img',
                        method: 'post',
                        data: {
                            path: file.url
                        }
                    })
                    .then((res) => {
                        if (res != null) {
                            self.$emit("handleChange");
                            let _imgs = self.imgs;
                            for (let i = 0; i < _imgs.length; i++) {
                                let item = _imgs[i];
                                if (item.uid == uid) {
                                    _imgs.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    })
            }).catch(function() {
                console.log("取消照片删除");
                fileList.push(file);
                self.imgs = fileList;
                self.$emit("handleChange");
            });
        },
        handleSuccess(res, file) {
            if (!res.code == 200)
                this.$message.error("上传文件失败");
            else {
                this.$emit("handleChange");
                var obj = {
                    url: res.data
                };
                this.imgs.push(obj);
            }
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        beforeUpload(file) {
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
</script>
<style scope>
#multi_img_div .el-upload-list__item {
    width: 170px!important;
    height: 170px !important;
}

.el-upload--picture-card {
    width: 170px!important;
    height: 170px !important;
}

#multi_img_div {
    max-width: 890px;
}

#multi_img_div .el-icon-plus {
    line-height: 6;
}
</style>
