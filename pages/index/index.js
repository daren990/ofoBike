Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 18,
    latitude: 0,
    longitude: 0
  },
  onLoad: function (options) {
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [
            {
              id: 1,
              iconPath: '/images/location.png',
              position: {
                left: 20,
                top: res.windowHeight - 80,
                width: 50,
                height: 50,
              },
              clickable: true
            },
            {
              id: 2,
              iconPath: '/images/use.png',
              position: {
                left: res.windowWidth / 2 - 45,
                top: res.windowHeight - 100,
                width: 90,
                height: 90
              },
              clickable: true
            },
            {
              id: 3,
              iconPath: '/images/warn.png',
              position: {
                left: res.windowWidth - 70,
                top: res.windowHeight - 80,
                width: 50,
                height: 50
              },
              clickable: true
            },
            {
              id: 4,
              iconPath: '/images/marker.png',
              position: {
                left: res.windowWidth / 2 - 11,
                top: res.windowHeight / 2 - 45,
                width: 30,
                height: 45
              },
              clickable: false
            },
            {
              id: 5,
              iconPath: '/images/avatar.png',
              position: {
                left: res.windowWidth - 68,
                top: res.windowHeight - 155,
                width: 45,
                height: 45
              },
              clickable: true
            }
          ]
        })
      }
    })
    wx.request({
      url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
      data : {},
      method : 'GET',
      success : (res) => {
        this.setData({
          marker : res.data.data
        })
      }
    })
  },
  bindcontroltap: function (e) {
    switch (e.controlId) {
      case 1: this.movetoPosition();
        break;
      case 2: if (this.timer === '' || this.timer === undefined) {
        wx.scanCode({
          success: (res) => {
            wx.showLoading({
              title: '正在获取密码',
              mask: true
            })
            wx.request({
              url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/password',
              data: {},
              method: 'GET',
              success: (res) => {
                wx.hideLoading();
                wx.redirectTo({
                  url: '../scanresult/index?password=' + res.data.data.password + '&number=' + res.data.data.number,
                  success: (res) => {
                    wx.showToast({
                      title: '获取密码成功',
                      duration: 1000
                    })
                  }
                })
              }
            })
          }
        })
      } else {
        wx.navigateBack({
          delta: 1
        })
      };
        break;
      case 3: wx.navigateTo({
        url: '../warn/index',
      });
        break;
      case 5: wx.navigateTo({
        url: '../my/index',
      });
        break;
        default: break;
    }
  },
  bindmarkertap:function(e){
    let _markers = this.data.markers;
    let markerId = e.markerId;
    let currMaker = _markers[markerId];
    this.setData({
      polyline: [{
        points: [{ // 连线起点
          longitude: this.data.longitude,
          latitude: this.data.latitude
        }, { // 连线终点(当前点击的标记)
          longitude: currMaker.longitude,
          latitude: currMaker.latitude
        }],
        color: "#FF0000DD", // 连线颜色
        width: 1, // 连线宽度
        dottedLine: true // 虚线
      }],
      scale: 18
    })
  },
  bindregionchange: function(e){
    // 拖动地图，获取附件单车位置
    if (e.type == "begin") {
      wx.request({
        url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
        data: {},
        method: 'GET',
        success: (res) => {
          this.setData({
            _markers: res.data.data
          })
        }
      })
      // 停止拖动，显示单车位置
    } else if (e.type == "end") {
      this.setData({
        markers: this.data._markers
      })
    }
  },
  onShow: function () {
    this.mapCtx = wx.createMapContext("ofoMap");
    this.movetoPosition()
  },
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  }
})