//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  
  http: function (url, data='', method="GET") { //封装http请求
    const apiUrl = 'http://localhost:8080' //请求域名
    return new Promise((resolve, reject) => {
      var token =  wx.getStorageSync("token")
      wx.request({
        url: apiUrl + url,
        data: data,
        method: method,
        header: {token:token},
        success: function (res) {
          if (res.data.msg == "NOT_LOGIN") {
            wx.switchTab({
              url: '/pages/user/index'
            })
            console.log("未登录！");
          }
          resolve(res.data)
        },
        fail: function (res) {
          reject(res);
        },
        complete: function () {

        }
      })
    })
  },
  globalData: {
    userid:null,
  }
})