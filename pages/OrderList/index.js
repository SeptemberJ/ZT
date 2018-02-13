import Promise from '../../utils/blue'
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page({
    data: {
        loadingHidden:false,
        Tabs: ['待接单', '待预约', '上门服务', '服务完成'],
        TabCur: 0,
        OrderList:[],
        index:0,
        OrderDetail:'',
        modifyDate:'',
        ifShowModal:false
        
    },
    onLoad: function (options) {
      
    },
    onShow:function(){
      this.setData({
        TabCur:app.globalData.TabCur
      })
      console.log('app.globalData.TabCur' + app.globalData.TabCur)
      switch (app.globalData.TabCur) {
        case 0:
          this.getData('/page/selectapply.do')
          break
        case 1:
          this.getData('/page/daiyuyue.do')
          break
        case 2:
          this.getData('/page/smfw.do')
          break
        case 3:
          this.getData('/page/fwwc.do')
          break
      }
    },
    
    //picker
    // bindPickerChange: function (e) {
    //   console.log('picker发送选择改变，携带值为', e.detail.value)
    //   this.setData({
    //     index: e.detail.value
    //   })
    // },
    //查看详情
    Detail: function(e){
      requestPromisified({
        url: h.main + '/page/detail.do',
        data: {
          id: e.currentTarget.dataset.id
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }, // 设置请求的 header
      }).then((res) => {
        console.log('detail backInfo---')
        console.log(res.data)
        let temp = res.data[0]
        if (res.data[0].fgodate){
          temp.fgodate = res.data[0].fgodate.split('.')[0]
        }else{
          temp.fgodate = '无要求'
        }
        
        //console.log(res.data[0].fgodate.split('.')[0])
        this.setData({
          OrderDetail: temp,
          modifyDate: temp.fgodate,
          ifShowModal:true
        })

      }).catch((res) => {
        console.log(res)
        this.setData({
          loadingHidden: true
        })
        wx.showToast({
          image: '/images/attention.png',
          title: '服务器繁忙！'
        });
      })
    },
    //关闭详情
    DetailClose: function(){
      this.setData({
        ifShowModal: false
      })
    },
    bindDateChange: function(e){
      this.setData({
        modifyDate: e.detail.value
      })
    },
    //修改上门日期
    ChangeModifyDate: function(){
      if (this.data.modifyDate == '无要求'){
        this.DetailClose()
      }else{
      requestPromisified({
        url: h.main + '/page/UpdateDate.do',
        data: {
          id: this.data.OrderDetail.id,
          fgodate: this.data.modifyDate
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }, // 设置请求的 header
      }).then((res) => {
        console.log('yuyue backInfo---')
        console.log(res.data)
        if (res.data.result == 1) {
          wx.showToast({
            title: '修改成功!',
            icon: 'success',
            duration: 1500
          })
          this.DetailClose()
          switch (app.globalData.TabCur) {
            case 0:
              this.getData('/page/selectapply.do')
              break
            case 1:
              this.getData('/page/daiyuyue.do')
              break
            case 2:
              this.getData('/page/smfw.do')
              break
            case 3:
              this.getData('/page/fwwc.do')
              break
          }
        }else{
          wx.showToast({
            image: '/images/attention.png',
            title: '修改失败！',
            duration: 1000
          })
        }

      }).catch((res) => {
        this.setData({
          loadingHidden: true
        })
        wx.showToast({
          image: '/images/attention.png',
          title: '服务器繁忙！'
        });
      })
    }
    },
    // tab点击
    ChangeTab: function(e) {
      let IDX = e.currentTarget.dataset.idx
      app.globalData.TabCur = IDX
      this.setData({
        TabCur:IDX
      })
      switch (IDX){
        case 0:
        this.getData('/page/selectapply.do')
        break 
        case 1:
          this.getData('/page/daiyuyue.do')
        break
        case 2:
          this.getData('/page/smfw.do')
        break
        case 3:
          this.getData('/page/fwwc.do')
        break 
      }
    },
    //接单
    TakeOrder: function(e){
      requestPromisified({
        url: h.main + '/page/yuyue.do',
        data: {
          id: e.currentTarget.dataset.id
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }, // 设置请求的 header
      }).then((res) => {
        console.log('yuyue backInfo---')
        console.log(res.data)
        if(res.data.result == 1){
          wx.showToast({
            title: '接单成功!',
            icon: 'success',
            duration: 1500
          })
          this.getData('/page/selectapply.do')
        }

      }).catch((res) => {
        this.setData({
          loadingHidden: true
        })
        wx.showToast({
          image: '/images/attention.png',
          title: '服务器繁忙！'
        });
      })
    },
    //打电话
    MakeCall: function(e){
      wx.makePhoneCall({
         phoneNumber: this.data.OrderList[e.currentTarget.dataset.idx].ftel,
        success: (res) => {
          console.log('makePhoneCall success--')
          requestPromisified({
            url: h.main + '/page/call.do',
            data: {
              id: e.currentTarget.dataset.id
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            }, // 设置请求的 header
          }).then((res) => {
            console.log('yuyue backInfo---')
            console.log(res.data)
            switch (res.data.result){
              case 1:
                this.getData('/page/daiyuyue.do')
              break
              case 0:
                wx.showToast({
                  image: '/images/attention.png',
                  title: '订单状态修改失败'
                });
              break
              default:
                wx.showToast({
                  image: '/images/attention.png',
                  title: '服务器繁忙！'
                });
            }
          }).catch((res) => {
            this.setData({
              loadingHidden: true
            })
            wx.showToast({
              image: '/images/attention.png',
              title: '服务器繁忙！'
            });
          })
        },
        fail: (res) => {
          console.log('makePhoneCall fail--')
          console.log(res)
        }
      })
    },
    //预约
    MakeOrder: function(e){
      requestPromisified({
        url: h.main + '/page/Updatetype1.do',
        data: {
          id: e.currentTarget.dataset.id,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }, // 设置请求的 header
      }).then((res) => {
        console.log('yuyue backInfo---')
        console.log(res.data)
        switch (res.data.result) {
          case 1:
            wx.showToast({
              title: '预约成功！',
              icon: 'success',
              duration: 1500
            })
            this.getData('/page/daiyuyue.do')
            break
          case 0:
            wx.showToast({
              image: '/images/attention.png',
              title: '订单状态修改失败'
            });
            break
          default:
            wx.showToast({
              image: '/images/attention.png',
              title: '服务器繁忙！'
            });
        }
      }).catch((res) => {
        this.setData({
          loadingHidden: true
        })
        wx.showToast({
          image: '/images/attention.png',
          title: '服务器繁忙！'
        });
      })
    },
    Sign: function(e){
      wx.showModal({
        title: '提示',
        content: '确定签到?',
        success: (res)=> {
          if (res.confirm) {
             this.ToSign(e.currentTarget.dataset.id)
          } else if (res.cancel) {
            return false
          }
        }
      })
    },
    //签到
    ToSign: function(ID){
      this.setData({
        loadingHidden: false
      })
      requestPromisified({
        url: h.main + '/page/seartime.do',
        data: {
          id: app.globalData.userId
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }, // 设置请求的 header
      }).then((res) => {
        console.log('seartime backInfo---')
        console.log(res.data)
        switch (res.data[0]) {
          case 0:
            wx.getLocation({
              type: 'wgs84',
              success: (res) => {
                requestPromisified({
                  url: h.main + '/page/shangmen.do',
                  data: {
                    id: ID,//e.currentTarget.dataset.id,
                    lat: res.latitude,
                    lng: res.longitude
                  },
                  method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                  }, // 设置请求的 header
                }).then((res) => {
                  console.log('yuyue backInfo---')
                  console.log(res.data)
                  switch (res.data.result) {
                    case 1:
                      wx.showToast({
                        title: '签到成功！',
                        icon: 'success',
                        duration: 1500
                      })
                      this.setData({
                        loadingHidden: true
                      })
                      this.getData('/page/smfw.do')
                      break
                    case 0:
                      wx.showToast({
                        image: '/images/attention.png',
                        title: '订单状态修改失败'
                      });
                      this.setData({
                        loadingHidden: true
                      })
                      break
                    default:
                      wx.showToast({
                        image: '/images/attention.png',
                        title: '服务器繁忙！'
                      });
                  }
                }).catch((res) => {
                  this.setData({
                    loadingHidden: true
                  })
                  wx.showToast({
                    image: '/images/attention.png',
                    title: '服务器繁忙！'
                  });
                })
              },
              fail: (res) => {
                wx.showToast({
                  image: '/images/attention.png',
                  title: '定位失败！'
                });
              }
            })
            break
          case 1:
            wx.showToast({
              image: '/images/attention.png',
              title: '尚有未签退单子！'
            });
            this.setData({
              loadingHidden: true
            })
            break
          default:
            wx.showToast({
              image: '/images/attention.png',
              title: '服务器繁忙！'
            });
            this.setData({
              loadingHidden: true
            })
        }
      }).catch((res) => {
        this.setData({
          loadingHidden: true
        })
        wx.showToast({
          image: '/images/attention.png',
          title: '服务器繁忙！'
        });
      })
    },

    // 重排
    ToReset: function(e){
      wx.showModal({
        title: '提示',
        content: '确定重排?',
        success: (res)=> {
          if (res.confirm) {
            let ID = e.currentTarget.dataset.id
            this.OutSign(ID, 'chongpai')
            this.getData('/page/smfw.do')
          } else if (res.cancel) {
            return false
          }
        }
      })
    },

    //服务反馈填写
    ToWrite: function(e){
      wx.navigateTo({
        url: '../Submit/index?id=' + e.currentTarget.dataset.id + '&QCode=' + this.data.OrderList[e.currentTarget.dataset.idx].ewm
      })
    },
    ModalOutSign: function(Txt,Idx,Id){
      //console.log(Txt + '---' + Idx + '---' + Id)
      wx.showModal({
        title: '提示',
        content: '确定'+Txt+'?',
        success: (res)=> {
          if (res.confirm) {
            switch (Idx) {
              case 0:
                this.OutSign(Id, 'kongpao')
                break
              case 1:
                this.OutSign(Id, 'dengtongzhi')
                break
              case 2:
                this.OutSign(Id, 'fangong')
                break
              case 3:
                this.OutSign(Id, 9)
                break
            }
          } else if (res.cancel) {
            return false
          }
        }
      })
    },
    //签退
    ToOutSign: function (e) {
      let ID = e.currentTarget.dataset.id
      wx.showActionSheet({
        itemList: ['空跑', '等通知', '返工','完工'],
        success: (res)=> {
          switch (res.tapIndex) {
            case 0:
              this.ModalOutSign('空跑', 0,ID)
              //this.OutSign(ID, 'kongpao')
              break
            case 1:
              this.ModalOutSign('等通知', 1, ID)
              //this.OutSign(ID, 'dengtongzhi')
              break
            case 2:
              this.ModalOutSign('返工', 2, ID)
              //this.OutSign(ID, 'fangong')
              break
            case 3:
              this.ModalOutSign('完工', 3, ID)
              //this.OutSign(ID, 9)
              break
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    },
    //签退类型
    OutSign: function(ID,IDX){
      requestPromisified({
        url: h.main + '/page/wancheng.do',
        data: {
          id: ID,
          status: IDX
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }, // 设置请求的 header
      }).then((res) => {
        console.log('yuyue backInfo---')
        console.log(res.data)
        switch (res.data.result) {
          case 1:
            wx.showToast({
              title: '签退成功！',
              icon: 'success',
              duration: 1500
            })
            this.getData('/page/smfw.do')
            break
          case 0:
            wx.showToast({
              image: '/images/attention.png',
              title: '签退失败!'
            });
            break
          default:
            wx.showToast({
              image: '/images/attention.png',
              title: '服务器繁忙！'
            });
        }
      }).catch((res) => {
        this.setData({
          loadingHidden: true
        })
        wx.showToast({
          image: '/images/attention.png',
          title: '服务器繁忙！'
        });
      })
    },
    //扫码
    ScanCode: function(e){
      wx.scanCode({
        success: (res) => {
          console.log(res.result)
          requestPromisified({
            url: h.main + '/page/selectewm.do',
            data: {
              id: e.currentTarget.dataset.id,
              QCode: res.result
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            }, // 设置请求的 header
          }).then((res) => {
            console.log('yuyue backInfo---')
            console.log(res.data)
            switch (res.data.result) {
              case 1:
                wx.showToast({
                  title: '扫码成功！',
                  icon: 'success',
                  duration: 1500
                })
                this.getData('/page/daiyuyue.do')
                break
              case 0:
                wx.showToast({
                  image: '/images/attention.png',
                  title: '订单状态修改失败'
                });
                break
              default:
                wx.showToast({
                  image: '/images/attention.png',
                  title: '服务器繁忙！'
                });
            }
          }).catch((res) => {
            this.setData({
              loadingHidden: true
            })
            wx.showToast({
              image: '/images/attention.png',
              title: '服务器繁忙！'
            });
          })
        }
      })
    },
    //获取对应订单
    getData: function(URL){
      this.setData({
        loadingHidden:false
      })
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
        this.setData({
            OrderList: res.data,
            loadingHidden:true
        })
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