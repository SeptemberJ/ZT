const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page({
  data: {
    userInfo: {},
    loadingHidden: true,
    tempFilePaths:[],
    QCode:'',
    QCodeOld:'',
    Note:''
  },

  onLoad: function (Options) {
    this.setData({
      id: Options.id,
      QCodeOld: Options.QCode
    })
  },

  //选择图片
  ChooseImage: function(){
    let temp = this.data.tempFilePaths
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success: (res)=> {
        this.setData({
          tempFilePaths: res.tempFilePaths
          // tempFilePaths: temp.concat(res.tempFilePaths)
        })
        console.log(this.data.tempFilePaths)
      }
    })
  },
  //删除图片
  DeleteImg: function(e){
    let IDX = e.currentTarget.dataset.idx
    let AfterSource = this.data.tempFilePaths
    AfterSource.splice(IDX,1)
    this.setData({
      tempFilePaths: AfterSource
    })
  },
  //扫码
  GetQCode: function(){
    wx.scanCode({
      success: (res) => {
        this.setData({
          QCode: res.result
        })
        console.log(res)
      }
    })
  },
  //手动输入二维码
  ChangeQCode: function(e){
    this.setData({
      QCode: e.detail.value
    })
  },
  //服务反馈
  ChangeNote: function(e){
    this.setData({
      Note: e.detail.value
    })
  },
  //提交
  SumitInfo: function(){
    if (this.data.QCodeOld && (this.data.QCode != this.data.QCodeOld)){
      wx.showToast({
        image: '/images/attention.png',
        title: '二维码不一致！'
      });
      return false
    }
    var that = this
    while (this.data.tempFilePaths.length>0){
      wx.uploadFile({
        url: h.main + '/page/upload1.do',//仅为示例，非真实的接口地址
        filePath: this.data.tempFilePaths.splice(0, 1)[0],
        name: 'file',
        formData: {
          id: this.data.id,
          QCode: that.data.QCode,
          Note: that.data.Note
        },
        header: {
          'content-type': 'multipart/form-data',
        },
        success: (res) => {
          console.log('图片上传backInfo-----')
          console.log(res)


        },
        fail: (res) => {
          return false
          console.log('图片上传失败backInfo-----')
          console.log(res)
        },
        complete: (res) => {
        }
      })
    }
    wx.navigateTo({
      url: '../OrderList/index'
    })

    
  }

})