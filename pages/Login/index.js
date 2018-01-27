const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page({
  data: {
    userInfo: {},
    userName: '',
    psd: '',
    role: 0,
    changeUserName: false,
    changePsd: false,
    loadingHidden: true,
  },

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //         //更新数据
    //         // console.log(userInfo);
    //         that.setData({
    //             userInfo: userInfo

    //         })
    //     })
    this.setData({
      userInfo: app.globalData.userInfo,
    });
    // console.log('---------');
    // console.log(app.globalData.userInfo);
  },
  //选择角色
  RoleChange: function (e) {
    this.setData({
      role: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  //   focus时改变border-color
  changeBorderColorUser: function (e) {
    const ifChange = !this.data.changeUserName
    this.setData({
      changeUserName: ifChange
    });
  },
  changeBorderPsd: function () {
    const ifChange = !this.data.changePsd
    this.setData({
      changePsd: ifChange
    });
  },
  //   恢复border-color
  noamrlBorderColorUser: function () {
    const ifChange = !this.data.changeUserName
    this.setData({
      changeUserName: ifChange
    });
  },
  noamrlBorderColorPsd: function () {
    const ifChange = !this.data.changePsd
    this.setData({
      changePsd: ifChange
    });
  },
  //   获取输入的姓名
  ChangeUserName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  ChangePsd: function (e) {
    this.setData({
      psd: e.detail.value
    })
  },
  ChangePsdAgain: function (e) {
    this.setData({
      psdAgain: e.detail.value
    })
  },

  toSign: function () {
    wx.navigateTo({
      url: '../Sign/index'
    })
  },

  loginIn: function () {
    this.setData({
      loadingHidden: false
    })
    var USER = this.data.userName
    var PSD = this.data.psd
    var PSDAgain = this.data.psdAgain
    if (USER === "" || USER === null) {
      this.setData({
        loadingHidden: true
      })
      wx.showModal({
        title: '提示',
        content: '用户名不能为空!',
        confirmColor: '#7FC9B8',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
      return false;
    }
    if (PSD === "" || PSD === null) {
      this.setData({
        loadingHidden: true
      })
      wx.showModal({
        title: '提示',
        content: '密码不能为空!',
        confirmColor: '#7FC9B8',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')    
          }
        }
      });
      return false;
    }
    // requestPromisified({
    //     url:  h.main+"/main/userlistBytype.html",
    //     data: {
    //     username:USER,
    //     password:MD5.hexMD5(PSD),
    //     oppen_id: app.globalData.oppenid
    //     },

    //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //     header: {
    //     'content-type': 'application/x-www-form-urlencoded' ,
    //         'Accept': 'application/json',
    //         'Set-Cookie':'sessionToken='+app.globalData.session
    //     }, // 设置请求的 header
    // }).then((res)=> {
    //     console.log('sign backinfor----');
    //     console.log(res.data);
    //     this.setData({
    //         loadingHidden:true
    //     })
    //     console.log(this.data.loadingHidden);
    //     app.globalData.accountName=USER;
    //     app.globalData.sessionid=res.data[1];


    // }).catch((res)=> {
    //     this.setData({
    //         loadingHidden:true
    //     })
    //     wx.showToast({
    // title: '服务器繁忙，请稍后重试！'
    //     });
    //     console.error("get login failed")
    // })


  },


})