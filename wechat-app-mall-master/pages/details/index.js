// pages/details/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    swipers: [],
    images:[],
    framelist:[],
    lenslist:[],
    frameindex:0,
    lensindex:null,
    name:'',
    status:0,
    framesprice:0,
    price:0,
    title:'',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    tabIs:true,
    specIs:false,
    data:null
  },
  tabFun(e){
    console.log(e)
    if (e.currentTarget.dataset.state == 1){
      this.setData({
        tabIs:true,
      })
    }else{
      this.setData({
        tabIs: false,
      })
    }
  },
  //获取镜片
  getLens:function(){
    app.http('/lens').then(res=>{
      if (res.code == 1) {
        console.log(res,'镜片详情');
        this.setData({
          lenslist : res.data
        })
      }
    })
  },
  //规格详情
  detail:function(){
      this.specFun()
  },
  //查看放大图片
  imgClick:function(e){
    console.log(e);
    var imgUrl = this.data.framelist[this.data.frameindex].typeimage;
    console.log(imgUrl);
    wx.previewImage({
      urls: [imgUrl],
      success:(res=>{
      })
    })
  },
  //选择按钮
  chooseframe: function(e){
    // console.log(e.target);
    this.setData({
      frameindex : e.target.dataset.index
    })
    // console.log(this.data.frameindex);
  },
  chooselens: function(e){
    // console.log(e.target);
    var index = e.target.dataset.index
    if (index == this.data.lensindex) {
      this.setData({
        lensindex : null,
        price: this.data.framesprice 
      })
    }else{
      this.setData({
        lensindex :index,
        price: this.data.framesprice + this.data.lenslist[index].lensprice
      })
    }
  },
  //购物车
  goShopCar: function () {
    wx.reLaunch({
      url: "/pages/cart/index"
    });
  },
  //打开规格页面
  specFun(){
    this.setData({
      specIs: !this.data.specIs,
    })
  },
  //下单
  done(){
    var _this = this
    wx.showModal({
      title: '是否确定下单', //提示的标题
      // content: '我是内容', //提示的内容
      success: function(res) {
        if(res.confirm) {
          _this.setData({
            status: 1
          })
          _this.cartOrdone()
        } else if (res.cancel) {
          console.log('用户点击了取消')
        }
      }
    })
    
  },
  //加入购物车
  addCart(){
    this.setData({
      status: 0
    })
    this.cartOrdone();
    this.specFun();
    wx.showToast({
      title: '成功加入购物车！',
      icon: 'success',
      duration: 1000 //持续的时间
    })
  },
  //购物车或下单
  cartOrdone(){
    // console.log("lensindex",this.data.lensindex);
    var _this = this.data
    console.log();
    app.http('/cartorup',{
      frameid:_this.frameid,
      userid:app.globalData.userid,
      lensid:_this.lenslist[_this.lensindex].lensid,
      price:_this.price,
      type:_this.framelist[_this.frameindex].type,
      status:_this.status
    }).then(res=>{
      console.log('1213');
      console.log(res,'res');
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.http('/getdetail', { id: options.id})
    .then(res=>{
      console.log(res,"眼镜详情");
      this.setData({
        swipers: res.data.swiperimages,
        images: res.data.detailimages,
        title: res.data.describe,
        framelist: res.data.typelist,
        frameid: res.data.forigenid,
        name:res.data.name,
        framesprice:res.data.framesprice,
        price:res.data.framesprice
      })
    }),
    this.getLens();
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
  
  }
})