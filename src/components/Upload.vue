<template>
  <div class="plupload">
    <el-tooltip
      class="item"
      effect="dark"
      :content="`支持扩展名：${acceptFiles}`"
      placement="bottom-end"
    >
      <div
        class="upload-pic"
        v-if="fileRawList.length === 0"
        :id="browseButton"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
    </el-tooltip>
    <div class="upload-tips" v-if="fileRawList.length === 0">
      <p>视频支持{{ acceptFiles }}格式，单个文件请不要超过2GB。</p>
    </div>
    <div v-if="fileRawList.length > 0" class="table-part">
      <div
        :key="item.name"
        v-for="item in fileRawList"
        :label="item.name"
        :name="item.name"
      >
        <div class="video-title" id="videoUpload">
          <span>{{ item.name }}</span>
          <span v-if="item.status === -1">正在计算文件大小</span>
          <span v-if="item.status === 1 && item.percent === 0"
            >文件大小计算完成</span
          >
          <span v-if="item.status === 4" style="color: red"
            >上传失败，请重新选择</span
          >
          <span v-if="item.status === 5" style="color: chartreuse">已上传</span>
        </div>
        <div class="progress-bar">
          <div class="bar">
            <el-progress
              v-if="item.percent || item.percent === 0"
              :text-inside="true"
              :stroke-width="20"
              :percentage="item.percent"
              :v-if="
                item.status === 2 || (item.status === 1 && item.percent > 0)
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// plupload参数文档：http://www.phpin.net/tools/plupload/
import plupload from 'plupload/js/plupload.full.min.js'
// import FileMd5 from '../models/file-md5.js'

export default {
  name: 'Plupload',
  props: {
    // 文件上传类型限制
    acceptFiles: {
      type: String,
    },
    // 上传按键ID
    browseButton: {
      type: String
    },
    bizType: {
      type: String,
      default: ''
    },
    fileList: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number
    },
    uploadAudioTitle: {

    },
    file_name: {
      type: String
    }
  },
  data () {
    return {
      up: {},
      basicForm: {},
      fileRawList: [],
    }
  },
  watch: {
    up (val) {
      console.log('up')
      this.fileRawList = this.fileList.concat(val.files)
    },
    acceptFiles (val) {
      console.log(val)
      this.up.refresh()
    },
    // fileList(val) {
    //   console.log('fileList', val, this.up)
    //   this.fileRawList = val.concat(this.up.files)
    //   this.up.refresh()
    // }
  },
  mounted () {
    this.pluploadInit()
  },
  methods: {
    pluploadInit () {
      var that = this
      var uploader = new plupload.Uploader({
        browse_button: this.browseButton,
        url: 'https://transup.renbenzhihui.com/admin/uploader/saveFile',
        // url: 'https://trans.renbenzhihui.com/admin/uploader/saveFile',
        chunk_size: '5MB',
        headers: that.headers,
        multipart: true, // 为true时将以multipart/form-data
        max_retries: 1, // 当发生plupload.HTTP_ERROR错误时的重试次数，为0时表示不重试
        multi_selection: true, // 是否可以在文件浏览对话框中选择多个文件
        filters: {
          max_file_size: '2GB', //文件大小
          prevent_duplicates: true, //不允许选取重复文件
          mime_types: [{ //定义允许的格式
            title: "视频文件",
            extensions: "mp4,mp3"
          }]
          // mp4,rmvb,avi,flv,mkv,wmv,3gp
        },
        drop_element: this.browseButton, // 开启拖拽上传
        init: {
          BeforeUpload (up, file) {
            // 上传时的附加参数，以键/值对的形式传入
            up.setOption('multipart_params', {
              'size': file.size,
              'md5': file.md5,
              'bizType': that.bizType,
              'title': file.name,
              'suffix': that.get_suffix(file.name),
              'name': that.calculate_object_name(file.name),
              'level': 3,
              'isNew': 1,
              'notice_url': 'localhost:8080'
            })
          },
          FileFiltered (up, files) {
            console.log('FileFiltered', up, files)
          },
          FilesAdded (up, files) {
            that.fileRawList.push(...files)
            console.log(that.fileRawList)
            that.$emit('up-loaded', files)
            uploader.start()
          },
          FilesRemoved (up, files) {
            console.log('FilesRemoved', up)
            console.log('FilesRemoved', files)
            that.uploading = false
          },
          FileUploaded (up, file, info) {
            if (info.status === 200) {
              console.log('FileUploaded', info.response)
              let fileData = JSON.parse(info.response).data
              that.$set(file, 'file_type', fileData.file_type)
              that.$set(file, 'file_id', fileData.file_id)
              file.UploadComplete = true
              that.up.refresh()
              // document.getElementsByClassName('moxie-shim-html5')[0].style.width = '130px'
              // document.getElementsByClassName('moxie-shim-html5')[0].style.height = '40px'
              that.$emit('on-change', that.fileRawList)
            }
          },
          UploadComplete (up, files) {
            console.log('UploadComplete', up, files)
            that.$emit('up-loaded', files)
            that.uploading = false
          },
          Error (up, args) {
            console.log('Error', up, args)
            switch (args.code) {
              case -100:
                that.$message.error('发生通用错误')
                break
              case -200:
                that.$message.error('发生网络错误')
                break
              case -300:
                that.$message.error('磁盘读写错误')
                break
              case -400:
                that.$message.error('安全问题上传错误')
                break
              case -500:
                that.$message.error('初始化错误')
                break
              case -600:
                that.$message.error('文件超过限制大小')
                break
              case -601:
                that.$message.error('文件类型不符合要求')
                break
              case -602:
                that.$message.error(args.file.name + '文件已存在列表中')
                break
            }
            that.uploading = false
          }
        }
      })
      uploader.init()
      this.up = uploader
    },
    deleteFile (row) {
      console.log('this.fileRawList.indexOf(row)', this.fileRawList.indexOf(row))
      this.fileRawList.splice(this.fileRawList.indexOf(row), 1)
      var file = this.up.getFile(row.id)
      file && this.up.removeFile(file)
      // console.log('this.up', this.up)
      this.$emit('up-loaded', this.up.files)
      // console.log(document.getElementsByClassName('moxie-shim-html5'))
      // if (this.fileRawList.length === 0) {
      //   document.getElementsByClassName('moxie-shim-html5')[0].style.width = '720px'
      //   document.getElementsByClassName('moxie-shim-html5')[0].style.height = '360px'
      // } else {
      //   document.getElementsByClassName('moxie-shim-html5')[0].style.width = '130px'
      //   document.getElementsByClassName('moxie-shim-html5')[0].style.height = '40px'
      // }
    },
    uploadStart () {
      this.uploading = true
      this.up.start()
    },
    calculate_object_name (filename) {
      let suffix = this.get_suffix(filename)
      return this.random_string() + suffix;
    },
    get_suffix (filename) {
      let pos = filename.lastIndexOf('.')
      let suffix = ''
      if (pos != -1) {
        suffix = filename.substring(pos)
      }
      return suffix;
    },
    random_string (len) {
      len = len || 32;
      let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      let maxPos = chars.length;
      let pwd = '';
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
  },
  destroyed () {
    console.log('destroyed')
    this.$emit('up-loaded', [])
    this.$emit('on-change', [])
  }
}
</script>

<style lang="less" scoped>
#uploadVideo {
  width: 90%;
}
.table-part {
  margin-top: 20px;
  .main-table {
    margin-bottom: 20px;
  }
  .create-title {
    margin: 20px 0 20px 20px;
    display: flex;
    .sub-title {
      font-size: 14px;
      line-height: 40px;
      text-align: right;
      span {
        color: red;
        padding-right: 5px;
      }
    }
  }
  .title-tips {
    color: red;
    p {
      display: inline-block;
      font-size: 12px;
      margin-left: 8px;
    }
  }
  .video-title {
    font-size: 14px;
    margin-top: 20px;
    margin-left: 10px;
    span {
      padding-right: 20px;
    }
  }
  .progress-bar {
    margin-top: 10px;
    display: flex;
    .bar {
      width: 600px;
      margin-top: 10px;
      margin-right: 20px;
    }
  }
}
.plupload {
  .upload-pic {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: 360px;
    height: 180px;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .el-icon-upload {
      font-size: 67px;
      color: #c0c4cc;
      margin: 50px 0 16px;
      line-height: 50px;
    }
    .el-upload__text {
      color: #606266;
      font-size: 14px;
      text-align: center;
      em {
        color: #dc5645;
        font-style: normal;
      }
    }
  }
  .upload-btn {
    cursor: pointer;
  }
  .upload-tips {
    p {
      margin-top: 20px;
      color: #666;
      font-size: 12px;
      a {
        color: #d84c3a;
      }
      span {
        width: 20px;
        display: inline-block;
      }
    }
  }
  .column {
    display: flex;
    margin: 10px 0;
    .column-title {
      font-size: 14px;
      line-height: 40px;
      margin-right: 10px;
    }
  }
  .submit {
    text-align: center;
  }
}
</style>
