import Promise from '../../utils/blue'
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page({
    data: {
        loadingHidden:false,
        Tabs: ['待接单', '待预约', '上门服务', '服务完成'],
        TabCur:0,
        OrderList:[
          { 'orderNo': 'OR123','status':1, 'addr':'上海市普陀区中山北路3000号长城大厦','contact':'张三','tel':18234567890},
          { 'orderNo': 'OR123', 'status': 1, 'addr': '上海市普陀区中山北路3000号', 'contact': '李四', 'tel': 18234567890 }
        ]
        
    },
    onLoad: function (options) {
    },
    onShow:function(){
       

    },
    // tab点击
    ChangeTab: function(e) {
      let IDX = e.currentTarget.dataset.idx
      this.setData({
        TabCur: IDX
      })
      switch (IDX){
        case 0:
        this.getData('/page/selectapply.do')
        break 
        case 1:
          this.getData('/page/adminapply.do')
        break
        case 0:
          this.getData('/page/smfw.do')
        break
        case 1:
          this.getData('/page/fwwc.do')
        break 
      }
    },
    //获取对应订单
    getData: function(URL){
      requestPromisified({
        url: h.main + URL,
        data: {
          id: app.globalData.userId
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Set-Cookie': 'sessionToken=' + app.globalData.session
        }, // 设置请求的 header
      }).then((res) => {
        console.log(URL+' backinfor----');
        console.log(res.data);
        // this.setData({
        //     loadingHidden:true
        // })


      }).catch((res) => {
        this.setData({
          loadingHidden: true
        })
        wx.showToast({
          title: '服务器繁忙，请稍后重试！'
        });
        console.error("get login failed")
      })

    }
	
	
});