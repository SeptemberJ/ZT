import Promise from '../../utils/blue'
import h from '../../utils/url.js'
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
      this.setData({
        TabCur: e.currentTarget.dataset.idx
      })
        
		
    },
	
	
});