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
          <div class="options-list">
            <!-- 广告标题搜索 -->
            <div class="option-item" v-if="pageType === 'ad'">
              <div class="label-title">标题搜索</div>
              <el-input v-model="adTitle" placeholder="请输入内容"></el-input>
            </div>
            <!-- 广告类型搜索 -->
            <div class="option-item" v-if="pageType === 'ad'">
              <div class="label-title">类型</div>
              <el-select
                class="input-name"
                v-model="valueAdType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsAdType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <!-- 视频标题搜索 -->
            <div class="option-item" v-if="pageType === 'video'">
              <div class="label-title">视频标题搜索</div>
              <el-input
                v-model="videoTitleAutoComplete"
                placeholder="请输入视频标题"
              ></el-input>
            </div>
            <!-- 视频平台搜索 -->
            <div class="option-item" v-if="pageType === 'video'">
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
            <!-- 视频渠道搜索 -->
            <div class="option-item" v-if="pageType === 'video'">
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
            <!-- 视频发布日期搜索 -->
            <div class="option-item" v-if="pageType === 'video'">
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
        <el-table-column label="视频ID" v-if="pageType === 'video'">
          <template slot-scope="scope">{{ scope.row.videoId }}</template>
        </el-table-column>
        <!-- 广告ID -->
        <el-table-column label="广告ID" v-if="pageType === 'video'">
          <template slot-scope="scope">{{ scope.row.advertId }}</template>
        </el-table-column>
        <!-- 标题 -->
        <el-table-column label="标题">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <!-- 描述 -->
        <el-table-column label="描述" v-if="pageType === 'ad'">
          <template slot-scope="scope">{{ scope.row.discription }}</template>
        </el-table-column>
        <!-- 类型 -->
        <el-table-column label="类型" v-if="pageType === 'ad'">
          <template slot-scope="scope">{{ scope.row.typeWord }}</template>
        </el-table-column>
        <!-- 地址 -->
        <el-table-column label="地址">
          <template slot-scope="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <!-- 播放视频按钮 -->
        <el-table-column label="播放视频">
          <template slot-scope="scope">
            <div class="table-tips play-btn" @click="showVideoDialog(scope)">
              播放<i class="el-icon-video-play"></i>
            </div>
          </template>
        </el-table-column>
        <!-- 合成状态 -->
        <el-table-column label="合成状态" v-if="pageType === 'video'">
          <template slot-scope="scope">{{
            scope.row.mergeStatusWord
          }}</template>
        </el-table-column>
        <!-- 平台 -->
        <el-table-column label="平台" v-if="pageType === 'video'">
          <template slot-scope="scope">{{ scope.row.platformWord }}</template>
        </el-table-column>
        <!-- 渠道 -->
        <el-table-column label="渠道" v-if="pageType === 'video'">
          <template slot-scope="scope">{{ scope.row.channelWord }}</template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态">
          <template slot-scope="scope">{{ scope.row.statusWord }}</template>
        </el-table-column>
        <!-- 日期 -->
        <el-table-column label="创建日期" v-if="pageType === 'video'">
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
          width="40%"
          @close="setListData"
        >
          <div class="content">
            <!-- 广告id -->
            <!-- <div class="option-item" v-if="pageType === 'ad'">
              <div class="label-title">ID</div>
              <el-input v-model="idEdit" placeholder="请输入广告ID"></el-input>
            </div> -->
            <!-- 广告类型 -->
            <div class="option-item" v-if="pageType === 'ad'">
              <div class="label-title">类型</div>
              <el-select
                class="input-name"
                v-model="valueAdTypeEdit"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsAdType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <!-- 广告标题 -->
            <div class="option-item" v-if="pageType === 'ad'">
              <div class="label-title">广告标题</div>
              <el-input
                v-model="adTitleEdit"
                placeholder="请输入广告标题"
              ></el-input>
            </div>
            <!-- 广告描述 -->
            <div class="option-item" v-if="pageType === 'ad'">
              <div class="label-title">广告描述</div>
              <el-input
                v-model="adDescEdit"
                placeholder="请输入广告描述"
              ></el-input>
            </div>
            <!-- 广告url -->
            <!-- 插入文件上传组件 -->
            <div
              class="option-item"
              v-if="pageType === 'ad' && buttonType === 'add'"
            >
              <div class="label-title">广告视频</div>
              <video-upload
                id="uploadVideo"
                :browse-button="'uploadVideoButton'"
                :limit="1"
                accept-files=".mp4,.mp3"
                @on-change="getVideoFile"
                @up-loaded="getFileSuccess"
              ></video-upload>
            </div>
            <!-- <div class="option-item" v-if="pageType === 'ad'">
              <div class="label-title">广告url</div>
              <el-input
                v-model="adUrlEdit"
                placeholder="请输入广告url"
              ></el-input>
            </div> -->
            <!-- 广告id -->
            <!-- <div
              class="option-item"
              v-if="pageType === 'video' && buttonType === 'add'"
            >
              <div class="label-title">广告ID</div>
              <el-input
                v-model="adIDEdit"
                placeholder="请输入广告ID"
              ></el-input>
            </div> -->
            <!-- 视频id -->
            <!-- <div
              class="option-item"
              v-if="pageType === 'video' && buttonType === 'add'"
            >
              <div class="label-title">视频ID</div>
              <el-input
                v-model="videoIDEdit"
                placeholder="请输入视频ID"
              ></el-input>
            </div> -->
            <!-- 视频新增时广告标题 -->
            <div
              class="option-item"
              v-if="pageType === 'video' && buttonType === 'add'"
            >
              <div class="label-title">广告标题</div>
              <el-autocomplete
                class="inline-input"
                v-model="adAutoCompleteEdit"
                :fetch-suggestions="querySearchAd"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="adSelectEdit"
                :debounce="0"
              ></el-autocomplete>
            </div>
            <!-- 视频新增时视频标题 -->
            <div
              class="option-item"
              v-if="pageType === 'video' && buttonType === 'add'"
            >
              <div class="label-title">视频标题</div>
              <el-autocomplete
                class="inline-input"
                v-model="titleAutoCompleteEdit"
                :fetch-suggestions="querySearchVideo"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="titleSelectEdit"
                :debounce="0"
              ></el-autocomplete>
            </div>
            <!-- 视频url -->
            <!-- 插入文件上传组件 -->
            <!-- <div
              class="option-item"
              v-if="pageType === 'video' && buttonType === 'add'"
            >
              <div class="label-title">视频url</div>
              <video-upload
                id="uploadVideo"
                :browse-button="'uploadVideoButton'"
                :limit="1"
                accept-files=".mp4,.mp3"
                @on-change="getVideoFile"
                @up-loaded="getFileSuccess"
              ></video-upload>
              <el-input
                v-model="videoUrlEdit"
                placeholder="请输入视频url"
              ></el-input>
            </div> -->
            <!-- 视频平台选择 -->
            <div class="option-item" v-if="pageType === 'video'">
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
            <!-- 视频渠道选择 -->
            <div class="option-item" v-if="pageType === 'video'">
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
            <!-- 视频插入位置 -->
            <div class="option-item" v-if="pageType === 'video'">
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
            <!-- 视频状态 -->
            <div
              class="option-item"
              v-if="pageType === 'video' && buttonType === 'edit'"
            >
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
            <!-- 视频上线时间 -->
            <div class="option-item" v-if="pageType === 'video'">
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
      <!-- 视频弹窗 -->
      <div class="video-dialog">
        <el-dialog
          title="播放器"
          :visible.sync="videoDialog"
          width="50%"
          @close="pausedVideo"
        >
          <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="videoOptions"
          >
          </video-player>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import format from '@/assets/js/utils'
import _session from '@/state/sessionStorage'
import { adListData, videoListData, suggestListData, submitAdData, addVideoData, editVideoData, deleteAdData, deleteVideoData } from '@/axios/api'
import videoUpload from '@/components/Upload.vue'
export default {
  components: {
    videoUpload,
    videoPlayer
  },
  data () {
    return {
      showOptions: true, // 显示与隐藏筛选条件
      showOptionWord: '隐藏', // 显示与隐藏筛选条件文字
      adTitle: '', // 广告标题搜索值
      optionsAdType: [{
        value: 1,
        label: '视频'
      }, {
        value: 2,
        label: '音频'
      }, {
        value: 3,
        label: '图文'
      }],
      valueAdType: 1, // 广告类型默认选种类型
      videoTitleAutoComplete: '', // 视频标题搜索值
      suggestListVideo: [], // 视频输入内容建议列表
      suggestListAd: [], // 广告输入内容建议列表
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
      buttonType: 'add', // 点击新增/编辑按钮时
      idEdit: 0, // 广告编辑/新增时ID值
      valueAdTypeEdit: 1, // 广告编辑/新增时类型选中值
      adTitleEdit: '', // 广告编辑/新增时标题值
      adDescEdit: '', // 广告编辑/新增时描述值
      adUrlEdit: '', // 广告编辑/新增时url值
      videoIDEdit: 0, // 视频新增时视频id
      adIDEdit: 0, // 视频新增时广告id
      // videoIDAdd: 0, // 视频新增时视频ID
      videoUrlEdit: '', // 视频新增时视频url
      titleAutoCompleteEdit: '', // 视频新增时视频标题
      adAutoCompleteEdit: '', // 视频新增时广告表题
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
      videoFile: '',
      videoFileSuccess: '',
      videoDialog: false, // 视频播放器弹窗
      videoOptions: {},
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
    console.log(this.pageType)
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
      switch (this.pageType) {
        case 'ad':
          {
            let data = {
              title: this.adTitle,
              type: this.valueAdType,
              page: this.pageNum,
              pageNum: this.pageSize
            }
            console.log(data)
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
                    switch (this.dataList[i].status) {
                      case 1:
                        this.dataList[i].statusWord = '上线'
                        break
                      case 2:
                        this.dataList[i].statusWord = '下线'
                        break
                      case 9:
                        this.dataList[i].statusWord = '删除'
                        break
                    }
                    switch (this.dataList[i].type) {
                      case 1:
                        this.dataList[i].typeWord = '视频'
                        break
                      case 2:
                        this.dataList[i].typeWord = '音频'
                        break
                      case 9:
                        this.dataList[i].typeWord = '图文'
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
          }
          break
        case 'video':
          {
            let data = {
              title: this.videoTitleAutoComplete,
              platform: this.valuePlatform,
              startTime: this.valueDate[0] || '',
              endTime: this.valueDate[1] || '',
              page: this.pageNum,
              pageNum: this.pageSize
            }
            console.log(data)
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
                        this.dataList[i].statusWord = '下线'
                        break
                      case 9:
                        this.dataList[i].statusWord = '删除'
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
          }
          break
      }
    },
    // 根据视频标题输入内容提供建议
    querySearchVideo (queryString, cb) {
      let suggestList = [];
      // 需要修改接口返回的内容
      let data = {
        search: queryString,
        page: 1
      }
      let that = this
      suggestListData(data).then(res => {
        that.suggestListVideo = res.result
        console.log(this.suggestListVideo)
        if (that.suggestListVideo.length === 0) {
          suggestList.push({
            value: '没有找到！'
          })
          console.log(suggestList)
        } else {
          for (let i = 0; i < res.result.length; i++) {
            //转换成id和value属性的对象数组
            suggestList.push({
              id: res.result[i].id,
              value: res.result[i].text,
              url: res.result[i].url
            })
          }
          console.log(this.suggestListVideo)
        }
        // var results = queryString ? suggestList.filter(this.createFilter(queryString)) : suggestList;
        // 调用 callback 返回建议列表的数据
        cb(suggestList);
      })
    },
    // 根据广告标题输入内容提供建议
    querySearchAd (queryString, cb) {
      let suggestList = [];
      // 需要修改接口返回的内容
      let data = {
        search: queryString,
        page: 1
      }
      let that = this
      suggestListData(data).then(res => {
        that.suggestListAd = res.result
        console.log(this.suggestListAd)
        if (that.suggestListAd.length === 0) {
          suggestList.push({
            value: '没有找到！'
          })
          console.log(suggestList)
        } else {
          for (let i = 0; i < res.result.length; i++) {
            //转换成id和value属性的对象数组
            suggestList.push({
              id: res.result[i].id,
              value: res.result[i].text,
              url: res.result[i].url
            })
          }
          console.log(this.suggestListAd)
        }
        // var results = queryString ? suggestList.filter(this.createFilter(queryString)) : suggestList;
        // 调用 callback 返回建议列表的数据
        cb(suggestList);
      })
    },
    // 筛选返回的结果
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 搜索按钮
    search () {
      this.getDataList()
    },
    // 新增按钮
    addNewDialog () {
      this.editDialog = true
      this.buttonType = 'add'
    },
    // 编辑按钮
    editItem (val) {
      this.editDialog = true
      this.buttonType = 'edit'
      console.log(val)
      let item = val.row
      if (this.pageType === 'ad') {
        this.idEdit = item.id
        this.valueAdTypeEdit = item.type
        this.adTitleEdit = item.title
        this.adDescEdit = item.discription
        this.adUrlEdit = item.url
      } else {
        this.videoIDEdit = item.id
        this.valuePlatformEdit = item.platform
        this.valueChannelEdit = item.channel
        this.valueInsertEdit = item.location
        this.valueStatusEdit = item.status
        this.valueDateEdit = []
        this.valueDateEdit[0] = item.ctime * 1000
        this.valueDateEdit[1] = item.etime * 1000
      }
    },
    // 删除按钮
    deleteItem (val) {
      console.log(val)
      let item = val.row
      let data = {
        ids: item.id
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除提交接口逻辑
        if (this.pageType === 'ad') {
          deleteAdData(data).then(res => {
            if (res.code === 0) {
              this.$message.success('删除成功!')
            }
          })
        } else {
          deleteVideoData(data).then(res => {
            if (res.code === 0) {
              this.$message.success('删除成功!')
            }
          })
        }
      }).catch(() => {

      });
    },
    // 清空编辑栏状态
    setListData () {
      if (this.pageType === 'ad') {
        this.idEdit = 0
        this.valueAdTypeEdit = 1
        this.adTitleEdit = ''
        this.adDescEdit = ''
        this.adUrlEdit = ''
        this.videoFile = ''
        this.videoFileSuccess = ''
      } else {
        this.adIDEdit = 0
        this.videoIDEdit = 0
        this.adAutoCompleteEdit = ''
        this.titleAutoCompleteEdit = ''
        this.valuePlatformEdit = 0
        this.valueChannelEdit = 0
        this.valueInsertEdit = 1
        this.valueStatusEdit = 1
        this.valueDateEdit = []
      }
    },
    // 编辑/新增弹窗取消按钮
    cancel () {
      this.editDialog = false
      this.setListData()
    },
    // 编辑/新增弹窗确定按钮
    confirm () {
      this.editDialog = false
      // 传递参数到后端
      switch (this.pageType) {
        case 'ad':
          {
            let data = {
              id: this.idEdit,
              type: this.valueAdTypeEdit,
              title: this.adTitleEdit,
              discription: this.adDescEdit
            }
            if (this.buttonType === 'add') {
              data.file_id = this.videoFileSuccess[0].file_id
              data.file_type = this.videoFileSuccess[0].file_type
            } else {
              data.url = this.adUrlEdit
            }
            console.log(data)
            submitAdData(data).then(res => {
              if (res.code === 0) {
                this.$message.success(res.msg)
                // 更新页面
                this.getDataList()
                this.setListData()
              }
            })
          }
          break
        case 'video':
          {
            if (this.buttonType === 'add') {
              let data = {
                advertId: this.adIDEdit,
                videoId: this.videoIDEdit,
                title: this.titleAutoCompleteEdit,
                url: this.videoUrlEdit,
                platform: this.valuePlatformEdit,
                channel: this.valueChannelEdit,
                location: this.valueInsertEdit,
                startTime: this.valueDateEdit[0] / 1000,
                endTime: this.valueDateEdit[1] / 1000
              }
              console.log(data)
              addVideoData(data).then(res => {
                if (res.code === 0) {
                  this.$message.success(res.msg)
                  // 更新页面
                  this.getDataList()
                  this.setListData()
                }
              })
            } else {
              let data = {
                id: this.videoIDEdit,
                platform: this.valuePlatformEdit,
                channel: this.valueChannelEdit,
                location: this.valueInsertEdit,
                startTime: this.valueDateEdit[0] / 1000,
                endTime: this.valueDateEdit[1] / 1000,
                status: this.valueStatusEdit
              }
              console.log(data)
              editVideoData(data).then(res => {
                if (res.code === 0) {
                  this.$message.success(res.msg)
                  // 更新页面
                  this.getDataList()
                  this.setListData()
                }
              })
            }
          }
      }
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
      this.titleAutoCompleteEdit = val.value
      this.videoUrlEdit = val.url
      this.videoIDEdit = val.id
    },
    adSelectEdit (val) {
      console.log(val)
      this.adIDEdit = val.id
      this.adAutoCompleteEdit = val.value
    },
    getVideoFile (data) {
      console.log(data)
      this.videoFile = data
    },
    getFileSuccess (data) {
      console.log(data)
      this.videoFileSuccess = data
    },
    // 视频播放器弹窗显示
    showVideoDialog (scope) {
      console.log(scope)
      this.videoDialog = true
      this.videoOptions = {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "video/mp4", // 类型
          src: scope.row.url // url地址
        }],
        poster: '', // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      }
    },
    pausedVideo () {
      this.$refs.videoPlayer.player.pause() // 暂停
    },
  }
}
</script>

<style lang="less" scoped>
.sub-page {
  position: relative;
  .show-options-btn {
    font-size: 14px;
    position: absolute;
    top: -35px;
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
    margin: 20px 0;
    .options-list {
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
        .el-input {
          width: inherit;
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
        .el-autocomplete {
          width: 100% !important;
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

.sub-page /deep/ .video-js .vjs-big-play-button {
  top: 50%;
  left: 50%;
  margin-left: -1.5em;
  margin-top: -0.75em;
}
</style>