// pages/user/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/Q3auHgzwzM7lmDDdsW3vibl6MagVhicR13ziarw7Qvn5cIvFL2y38om2MvwGyBs0BQicVemWG55G7f9QrC7MXRTEDw/132",
      nickName:"未登录"
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
    })

    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getUserProfile(e) {
    console.log('getUserProfile')
    // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          // hasUserInfo: true
        })
        this.login()
      }
    })
  },
  //登录
  login:function(){
    // wx.login()获取code
    var userInfos = this.data.userInfo;
    console.log(userInfos,"llll");
    wx.login({
        success:(res)=>{
            // console.log("code: " + res.code);
            wx.request({
              url:`https://api.weixin.qq.com/sns/jscode2session?appid=wx2b11c7586903efc8&secret=e0246255564acfbee2366f24d205dadc&js_code=${res.code}&grant_type="+ "authorization_code`,
              method:'GET',
              success:(res)=>{
                console.log("login",res);
                wx.request({
                  url:'http://localhost:8080/onlogin',
                  method:'POST',
                  // header:{token:wx.setStorageSync(token)},
                  data:{
                    openid : res.data.openid,
                    nickname : userInfos.nickName,
                    avatarUrl : userInfos.avatarUrl
                        },
                  success:(res)=>{
                    console.log(res,'onlogin');
                    app.globalData.userid = res.data.data.id;
                    // console.log(app.globalData.usrid);
                    if (res.data.code == 3) {
                      wx.setStorageSync('token', res.data.data)
                    }
                  }
              })
              }
            })
            
        }
    })
},
})