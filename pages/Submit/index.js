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
  },

  onLoad: function () {
  },
  UploadImg: function(){
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success: (res)=> {
        this.setData({
          tempFilePaths: res.tempFilePaths
        })
        console.log(this.data.tempFilePaths)
      }
    })
  }
  

})