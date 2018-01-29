// sc.js
import h from "../../utils/url.js"
var tempFilePaths1 = []
let x = false;
let v = ""
let dh = ""
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: true
  },

  onLoad: function (options) {
    console.log(options)
    dh = options.id
  },



  onShow: function () {

  },
  sc: function () {
    var that = this;
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        //原来
        tempFilePaths1 = res.tempFilePaths
        //改为多张---
        // tempFilePaths1.push(res.tempFilePaths)
        // console.log(tempFilePaths1)
        that.setData({
          tempFilePaths1: tempFilePaths1,
        })

      }
    })
  },
  put: function (e) {
    console.log(e)
    v = e.detail.value;
  },
  tj: function () {
    if (tempFilePaths1.length == 0) {
      wx.showToast({
        title: '请选择图片!',
        image: '../../img/attention.png'
      })
      return;
    }
    //解决方案必填
    if (!v) {
      wx.showToast({
        title: '请填写解决方案！',
        image:'../../img/attention.png'
      })
      return;
    }



    this.setData({
      loadingHidden: false
    })
    shangchuan(tempFilePaths1,this)

    
  }

})
let i = 0;
function shangchuan(tempFilePaths1,t) {
  console.log(dh)
  console.log(v)
 
 
  if (tempFilePaths1.length > i) {
    console.log(' console.log(tempFilePaths1.length)---------')
    console.log(tempFilePaths1.length)
    wx.uploadFile({
      url: h.main + "/ytjk/page/upload.do",//仅为示例，非真实的接口地址
      filePath: tempFilePaths1[i],
      name: 'file',
      formData: {
        'oppen_id': app.globalData.id,
        id: dh,
        note: v


      },
      header: {
        'content-type': 'multipart/form-data',
      },
      success: function (res) {

        console.log(res)


        i++;
        console.log(i)
        if (tempFilePaths1.length > i) {
          shangchuan(tempFilePaths1)
        } else {
          // that.setData({

          //   loadingHidden: true
          // })
          i = 0
          wx.showToast({
            title: '提交成功',
          })
          app.globalData.flag = 2;
          setTimeout(function () {
            wx.switchTab({
              url: '../djd/djd',
            })
          }, 1500)
        }


      },
      fail: function () {

      },
      complete: function (res) {


      }

    })
  }
}



//多张图片上传
function uploadimg(data) {
  var that = this,
    i = data.i ? data.i : 0,
    success = data.success ? data.success : 0,
    fail = data.fail ? data.fail : 0;
  wx.uploadFile({
    url: data.url,
    filePath: data.path[i],
    name: 'fileData',
    formData: null,
    success: (resp) => {
      success++;
      console.log(resp)
      console.log(i);
      //这里可能有BUG，失败也会执行这里
    },
    fail: (res) => {
      fail++;
      console.log('fail:' + i + "fail:" + fail);
    },
    complete: () => {
      console.log(i);
      i++;
      if (i == data.path.length) {   //当图片传完时，停止调用          
        console.log('执行完毕');
        console.log('成功：' + success + " 失败：" + fail);
      } else {//若图片还没有传完，则继续调用函数
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data);
      }

    }
  });
}