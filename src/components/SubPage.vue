<template>
  <div class="sub-page">
    <div class="show-options-btn" @click="displayOptions">
      {{ showOptionWord }}筛选条件
      <img
        class="array-img"
        src="../assets/images/down.png"
        v-show="!showOptions"
      />
      <img
        class="array-img"
        src="../assets/images/up.png"
        v-show="showOptions"
      />
    </div>
    <el-collapse-transition>
      <div class="option-select-part" v-show="showOptions">
        <!-- 筛选条件 -->
        <div class="options-part">
          <div style="width: 100%">
            <div class="options-list">
              <div class="option-item">
                <div class="label-title">标题搜索</div>
                <el-autocomplete
                  class="inline-input"
                  v-model="titleAutoComplete"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  :trigger-on-focus="false"
                  @select="titleSelect"
                  :debounce="0"
                ></el-autocomplete>
              </div>
              <div class="option-item">
                <div class="label-title">视频ID搜索</div>
                <el-autocomplete
                  class="inline-input"
                  v-model="vidAutoComplete"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  :trigger-on-focus="false"
                  @select="vidSelect"
                  :debounce="0"
                ></el-autocomplete>
              </div>
              <div class="option-item">
                <div class="label-title">平台搜索</div>
                <el-select
                  class="input-name"
                  v-model="valuePlatform"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in optionsPlatform"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="option-item">
                <div class="label-title">渠道搜索</div>
                <el-select
                  class="input-name"
                  v-model="valueChannel"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in optionsChannel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="option-item">
                <div class="label-title">日期</div>
                <el-date-picker
                  value-format="timestamp"
                  v-model="valueDate"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="input-date"
                >
                </el-date-picker>
              </div>
            </div>
          </div>
          <el-button @click="search">搜索</el-button>
        </div>
      </div>
    </el-collapse-transition>

    <div class="cloumn-cell">
      <!-- 新增操作按钮 -->
      <div>
        <el-button plain size="small" @click="addNewDialog()"> 新增 </el-button>
      </div>

      <!-- 审核列表 -->
      <el-table
        ref="multipleTable"
        :max-height="tableHeight"
        :data="dataList"
        tooltip-effect="dark"
        style="width: 100%; margin-top: 20px"
      >
        <!-- ID -->
        <el-table-column label="ID">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <!-- 视频ID -->
        <el-table-column label="视频ID">
          <template slot-scope="scope">{{ scope.row.videoId }}</template>
        </el-table-column>
        <!-- 广告ID -->
        <el-table-column label="广告ID">
          <template slot-scope="scope">{{ scope.row.advertId }}</template>
        </el-table-column>
        <!-- 视频标题 -->
        <el-table-column label="视频标题">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <!-- 视频地址 -->
        <el-table-column label="视频地址">
          <template slot-scope="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <!-- 合成状态 -->
        <el-table-column label="合成状态">
          <template slot-scope="scope">{{
            scope.row.mergeStatusWord
          }}</template>
        </el-table-column>
        <!-- 平台 -->
        <el-table-column label="平台">
          <template slot-scope="scope">{{ scope.row.platformWord }}</template>
        </el-table-column>
        <!-- 渠道 -->
        <el-table-column label="渠道">
          <template slot-scope="scope">{{ scope.row.channelWord }}</template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态">
          <template slot-scope="scope">{{ scope.row.statusWord }}</template>
        </el-table-column>
        <!-- 日期 -->
        <el-table-column label="创建日期">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="审核操作" width="200">
          <template slot-scope="scope">
            <div class="edit-btn">
              <div class="item-btn">
                <el-button size="mini" @click="editItem(scope)">
                  编辑
                </el-button>
                <el-button size="mini" type="danger" @click="deleteItem(scope)">
                  删除
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="totalNumbers"
        >
        </el-pagination>
      </div>
      <!-- 编辑/新增 操作弹窗 -->
      <div class="edit-dialog">
        <el-dialog
          title="新增/编辑"
          :visible.sync="editDialog"
          width="20%"
          @close="setListData"
        >
          <div class="content">
            <div class="option-item">
              <div class="label-title">视频标题</div>
              <el-autocomplete
                class="inline-input"
                v-model="titleAutoCompleteEdit"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="titleSelectEdit"
                :debounce="0"
              ></el-autocomplete>
            </div>
            <div class="option-item">
              <div class="label-title">广告标题</div>
              <el-autocomplete
                class="inline-input"
                v-model="adAutoCompleteEdit"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="adSelectEdit"
                :debounce="0"
              ></el-autocomplete>
            </div>
            <div class="option-item">
              <div class="label-title">平台</div>
              <el-select
                class="input-name"
                v-model="valuePlatformEdit"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsPlatform"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="option-item">
              <div class="label-title">渠道</div>
              <el-select
                class="input-name"
                v-model="valueChannelEdit"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsChannel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="option-item">
              <div class="label-title">插入位置</div>
              <el-select
                class="input-name"
                v-model="valueInsertEdit"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsInsert"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="option-item">
              <div class="label-title">状态</div>
              <el-select
                class="input-name"
                v-model="valueStatusEdit"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="option-item">
              <div class="label-title">上线日期</div>
              <el-date-picker
                value-format="timestamp"
                v-model="valueDateEdit"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="input-date"
              >
              </el-date-picker>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">保 存</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import format from '@/assets/js/utils'
import _session from '@/state/sessionStorage'
import { adListData, videoListData, suggestListData, submitData, deleteData } from '@/axios/api'
export default {
  data () {
    return {
      showOptions: true, // 显示与隐藏筛选条件
      showOptionWord: '隐藏', // 显示与隐藏筛选条件文字
      titleAutoComplete: '', // 标题搜索值
      vidAutoComplete: '', // 视频id搜索值
      suggestList: [], // 输入内容建议列表
      optionsChannel: [{ // 渠道
        value: 0,
        label: '全部'
      }, {
        value: 1,
        label: '华为'
      }, {
        value: 2,
        label: '小米'
      }, {
        value: 3,
        label: 'OPPO'
      }, {
        value: 4,
        label: 'vivo'
      }],
      valueChannel: 0, // 渠道搜索选中值
      optionsPlatform: [{ // 渠道
        value: 0,
        label: '全部'
      }, {
        value: 1,
        label: 'PC'
      }, {
        value: 2,
        label: 'Android'
      }, {
        value: 3,
        label: 'iOS'
      }, {
        value: 4,
        label: 'H5'
      }],
      valuePlatform: 0, // 平台搜索选中值
      valueDate: '', // 选中的日期
      dataList: [], // 页面展示数据列表
      editDialog: false, // 编辑/新增弹窗
      singleEditData: [], // 单条数据
      currentPage: 1, // 当前页面
      pageNum: 1, // 页码
      pageSize: 10, // 每页显示的数量
      totalNumbers: 0, // 总数据数量
      pageState: true, // true 不触发handleSizeChange false 触发handleSizeChange
      tableHeight: 0, // 列表高度
      tableSentitiveHeight: 0, // 列表高度
      titleAutoCompleteEdit: '', // 编辑时视频标题
      adAutoCompleteEdit: '', // 编辑时广告表题
      valuePlatformEdit: 0, // 编辑时平台选中值
      valueChannelEdit: 0, // 编辑时渠道选中值
      valueDateEdit: '', // 编辑时上线时间值
      optionsInsert: [{ // 插入位置
        value: 1,
        label: '片头'
      }, {
        value: 2,
        label: '中间'
      }, {
        value: 3,
        label: '片尾'
      }],
      valueInsertEdit: 1, // 编辑时插入位置选中值
      optionsStatus: [{ // 状态
        value: 1,
        label: '上线'
      }, {
        value: 2,
        label: '下线'
      }],
      valueStatusEdit: 1, // 编辑时状态选中值
    }
  },
  props: {
    pageType: {
      type: String,
      default: () => { return '' }
    },
  },
  watch: {
    pageType (newVal) {
      this.pageType = newVal
    },
    suggestList (newVal) {
      this.suggestList = newVal
      console.log(this.suggestList)
    },
    valueDate (newVal) {
      if (!newVal) {
        this.valueDate = ''
      }
    },
    valueDateEdit (newVal) {
      if (!newVal) {
        this.valueDateEdit = ''
      }
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 显示隐藏筛选条件
    displayOptions () {
      this.showOptions = !this.showOptions
      this.showOptionWord = this.showOptions ? '隐藏' : '显示'
    },
    // 获取列表数据
    getDataList () {
      console.log(this.pageType)
      let data = {
        title: this.titleAutoComplete,
        id: this.vidAutoComplete,
        platform: this.valuePlatform,
        channel: this.valueChannel,
        startTime: this.valueDate[0],
        endTime: this.valueDate[1],
        page: this.pageNum,
        pageNum: this.pageSize
      }
      console.log(data)
      switch (this.pageType) {
        case 'ad':
          adListData(data).then(res => {
            if (res.code === 0) {
              this.pageState = true
              this.dataList = res.data.data
              this.totalNumbers = res.data.total
              if (this.dataList.length > 0) {
                for (let i in this.dataList) {
                  if (this.dataList[i].ctime !== '') {
                    this.dataList[i].createTime = format.formatTime(new Date(this.dataList[i].ctime * 1000), 4)
                  }
                  switch (this.dataList[i].mergeStatus) {
                    case 1:
                      this.dataList[i].mergeStatusWord = '等待'
                      break
                    case 2:
                      this.dataList[i].mergeStatusWord = '入队'
                      break
                    case 3:
                      this.dataList[i].mergeStatusWord = '成功'
                      break
                    case 4:
                      this.dataList[i].mergeStatusWord = '失败'
                      break
                  }
                  switch (this.dataList[i].platform) {
                    case 0:
                      this.dataList[i].platformWord = '全部'
                      break
                    case 1:
                      this.dataList[i].platformWord = 'PC'
                      break
                    case 2:
                      this.dataList[i].platformWord = 'Android'
                      break
                    case 3:
                      this.dataList[i].platformWord = 'iOS'
                      break
                    case 4:
                      this.dataList[i].platformWord = 'H5'
                      break
                  }
                  switch (this.dataList[i].channel) {
                    case 0:
                      this.dataList[i].channelWord = '全部'
                      break
                    case 1:
                      this.dataList[i].channelWord = '华为'
                      break
                    case 2:
                      this.dataList[i].channelWord = '小米'
                      break
                    case 3:
                      this.dataList[i].channelWord = 'OPPO'
                      break
                    case 4:
                      this.dataList[i].channelWord = 'vivo'
                      break
                  }
                  switch (this.dataList[i].status) {
                    case 1:
                      this.dataList[i].statusWord = '上线'
                      break
                    case 2:
                      this.dataList[i].channelWord = '下线'
                      break
                    case 9:
                      this.dataList[i].channelWord = '删除'
                      break
                  }
                }
              }
              console.log(this.dataList)
              this.$nextTick(() => {
                this.tableHeight = window.innerHeight - 94
                //后面的数字：根据需求空出的高度，自行调整
              })
            }
          })
          break
        case 'video':
          videoListData(data).then(res => {
            if (res.code === 0) {
              this.pageState = true
              this.dataList = res.data.data
              this.totalNumbers = res.data.total
              if (this.dataList.length > 0) {
                for (let i in this.dataList) {
                  if (this.dataList[i].ctime !== '') {
                    this.dataList[i].createTime = format.formatTime(new Date(this.dataList[i].ctime * 1000), 4)
                  }
                  switch (this.dataList[i].mergeStatus) {
                    case 1:
                      this.dataList[i].mergeStatusWord = '等待'
                      break
                    case 2:
                      this.dataList[i].mergeStatusWord = '入队'
                      break
                    case 3:
                      this.dataList[i].mergeStatusWord = '成功'
                      break
                    case 4:
                      this.dataList[i].mergeStatusWord = '失败'
                      break
                  }
                  switch (this.dataList[i].platform) {
                    case 0:
                      this.dataList[i].platformWord = '全部'
                      break
                    case 1:
                      this.dataList[i].platformWord = 'PC'
                      break
                    case 2:
                      this.dataList[i].platformWord = 'Android'
                      break
                    case 3:
                      this.dataList[i].platformWord = 'iOS'
                      break
                    case 4:
                      this.dataList[i].platformWord = 'H5'
                      break
                  }
                  switch (this.dataList[i].channel) {
                    case 0:
                      this.dataList[i].channelWord = '全部'
                      break
                    case 1:
                      this.dataList[i].channelWord = '华为'
                      break
                    case 2:
                      this.dataList[i].channelWord = '小米'
                      break
                    case 3:
                      this.dataList[i].channelWord = 'OPPO'
                      break
                    case 4:
                      this.dataList[i].channelWord = 'vivo'
                      break
                  }
                  switch (this.dataList[i].status) {
                    case 1:
                      this.dataList[i].statusWord = '上线'
                      break
                    case 2:
                      this.dataList[i].channelWord = '下线'
                      break
                    case 9:
                      this.dataList[i].channelWord = '删除'
                      break
                  }
                }
              }
              console.log(this.dataList)
              this.$nextTick(() => {
                this.tableHeight = window.innerHeight - 94
                //后面的数字：根据需求空出的高度，自行调整
              })
            }
          })
          break
      }
    },
    // 根据输入内容提供建议
    querySearch (queryString, cb) {
      var suggestList = [];
      // 需要修改接口返回的内容
      suggestListData().then(res => {
        if (res.code === 0) {
          this.suggestList = res.data
          if (this.suggestList.length === 0) {
            suggestList.push({
              value: '没有找到！'
            })
          } else {
            for (let i = 0; i < res.data.length; i++) {
              //转换成id和value属性的对象数组
              suggestList.push({
                id: res.data[i].blogId,
                value: res.data[i].title
              })
            }
          }
          var results = queryString ? suggestList.filter(this.createFilter(queryString)) : suggestList;
          // 调用 callback 返回建议列表的数据
          cb(results);
        }
      })

    },
    // 筛选返回的结果
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 选中建议中的标题
    titleSelect (val) {
      console.log(val)
    },
    // 选中建议中的id
    vidSelect (val) {
      console.log(val)
    },
    // 搜索按钮
    search () {
      console.log(this.valueDate)
      this.getDataList()
    },
    // 新增按钮
    addNewDialog () {
      this.editDialog = true
    },
    // 编辑按钮
    editItem (val) {
      this.editDialog = true
      console.log(val)
      let item = val.row
      this.titleAutoCompleteEdit = item.title
      this.valuePlatformEdit = item.platform
      this.valueChannelEdit = item.channel
      this.valueInsertEdit = item.location
      this.valueStatusEdit = item.status
    },
    // 删除按钮
    deleteItem (val) {
      console.log(val)
      let item = val.row
      let data = {
        id: item.id
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除提交接口逻辑
        deleteData(data).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功!')
          }
        })
      }).catch(() => {

      });
    },
    // 清空编辑栏状态
    setListData () {

    },
    // 编辑/新增弹窗取消按钮
    cancel () {
      this.editDialog = false
    },
    // 编辑/新增弹窗确定按钮
    confirm () {
      this.editDialog = false
      // 传递参数到后端
      let data = {
        title: this.titleAutoCompleteEdit,
        adTitle: this.adAutoCompleteEdit,
        platform: this.valuePlatformEdit,
        channel: this.valueChannelEdit,
        startTime: this.valueDateEdit[0],
        endTime: this.valueDateEdit[1],
      }
      submitData(data).then(res => {
        if (res.code === 0) {
          this.$message.success('提交成功！')
          this.editDialog = false
        }
      })
    },
    // 翻页按钮 =》 每页显示条数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
      this.pageNum = 1
      this.pageSize = val
      this.pageState = false
      if (!this.pageState) {
        this.getDataList()
      }
    },
    // 翻页按钮 =》 当前页码
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val
      if (this.pageState) {
        this.getDataList()
      }
    },
    titleSelectEdit (val) {
      console.log(val)
    },
    adSelectEdit (val) {
      console.log(val)
    }
  }
}
</script>

<style lang="less" scoped>
.sub-page {
  position: relative;
  .show-options-btn {
    font-size: 14px;
    position: absolute;
    top: -20px;
    color: #409eff;
    .array-img {
      width: 12px;
      height: auto;
      vertical-align: middle;
    }
  }
  .options-part {
    width: 100%;
    display: flex;
    .options-list {
      margin-bottom: 20px;
      display: flex;
      .option-item {
        flex: 1;
        margin-right: 10px;
        .label-title {
          display: inline-block;
          line-height: 40px;
          min-width: 60px;
          margin-right: 10px;
          font-size: 12px;
        }
        .input-name {
          width: 60% !important;
        }
        .input-date {
          width: 70% !important;
        }
      }
    }
    .options-list:nth-child(2) {
      margin-bottom: 0;
    }
  }
  .cloumn-cell {
    .edit-btn {
      // text-align: center;
      .item-btn {
        margin: 5px 0;
      }
    }
    .view-full-text {
      font-size: 12px;
      color: #409eff;
    }
  }
  .edit-dialog {
    .el-dialog__header {
      text-align: center;
    }
    .content {
      margin: 0 10px;
      margin-bottom: 20px;
      .option-item {
        display: flex;
        margin: 10px 0;
        .label-title {
          display: inline-block;
          line-height: 40px;
          min-width: 60px;
          margin-right: 10px;
          font-size: 12px;
        }
        .input-name {
          width: 60% !important;
        }
        .input-date {
          width: 70% !important;
        }
      }
    }
  }
  .pagination {
    text-align: center;
  }
}

.sub-page /deep/ .el-image-viewer__close {
  color: #fff;
}

.sub-page /deep/ .el-dialog__header {
  text-align: center;
}

.sub-page /deep/ .el-table td {
  padding: 0;
}
</style>