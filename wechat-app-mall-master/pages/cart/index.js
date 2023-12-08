const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frameindex:null,
    typelist:[],
    lenslist:[],
    frametype:null,
    lensid:null,
    show:false,
    slideButtons:[
      {
        text: '删除',
        type:'warn',
        extClass: 'test'
    },
    ],
    total:false, //是否全选
    totalPrice:0, //总价
    list:[],
    isEdit:false
  },
  totalPrice(){//计算总价
    let that = this
    let price = 0
    for(let i=0;i<that.data.list.length;i++){
      if (that.data.list[i].select){
        price = price + that.data.list[i].price * that.data.list[i].count
      }
    }
    this.setData({
      totalPrice: price
    })

  },
  totalFun(){ //全选
    this.data.total = !this.data.total
    this.data.list.map((v,k)=>{
      
      if (this.data.total) {
        v.select = true
      } else {
        v.select = false
      }
      console.log(v);
    })
    this.setData({
      list: this.data.list,
      total: this.data.total
    })

    this.totalPrice()
  },
  //编辑
  editor(e){
    console.log(e,123);
    var id = e.currentTarget.dataset.id
    var frametype = e.currentTarget.dataset.frame
    var lensid = e.currentTarget.dataset.lensid
    app.http('/getdetail', { id:id}).then(res=>{
      console.log(res,'眼镜');
      this.setData({
        show:true,
        typelist:res.data.typelist,
      
      })
      
    })
    app.http('/lens').then(res=>{
      if (res.code == 1) {
        console.log(res,'镜片详情');
        this.setData({
          lenslist : res.data,
          frametype:frametype,
          lensid:lensid
        })
        this.check();
      }
    })
    
  },
  //关闭编辑
  onClose(){
    this.setData({
      show:false
    })
  },
  //计算编辑窗口的选项
  check(){
    // var 
    // var frameindex = this.data.typelist.indexOf(this.data.frametype)
    // console.log(frameindex,'213213');
    // if(frameindex){

    // }
  },
  labelFun(e){//单选
    let that = this
    let num = 0
    for (let i = 0; i < that.data.list.length;i++){
      if (that.data.list[i].id == e.currentTarget.dataset.id){
        if (!that.data.list[i].select){
          that.data.list[i].select =  true
        }else{
          that.data.list[i].select = !that.data.list[i].select
        }
        that.setData({
          list: that.data.list
        })
      }

      if (that.data.list[i].select){
        num++
        if (num == that.data.list.length){
          that.setData({
            total: true
          })
        }else{
          that.setData({
            total: false
          })
        }
      }
    }
    this.totalPrice()
  },
  //删除
  delete(e){
    var id = e.currentTarget.dataset.id
    var _this = this
    wx.showModal({
      title: '是否删除',
      success: function (res) {
        if (res.confirm) { 
          _this.delItemFun(id);
          console.log('用户点击确定')
        } else { 
          console.log('用户点击取消')
        }
      }
    })
  },
  plusFun(item){ //增加商品数量
    this.data.list.map((v,k)=>{
      if (v.id == item.target.dataset.item.id){
          this.data.list[k].count++
      }
    })

    this.setData({
      list: this.data.list
    })

    this.totalPrice()
  },
  reduceFun(item) { //减少商品数量
    this.data.list.map((v, k) => {
      if (v.id == item.target.dataset.item.id) {
        if (this.data.list[k].count > 1){
          this.data.list[k].count--
        }
      }
    })
    this.setData({
      list: this.data.list
    })

    this.totalPrice()
  },
  delItemFun(id){ //删除单商品
    this.data.list.map((v, k) => {
      if (v.id == id) {
        this.data.list.splice(k,1)
      }
    })
    app.http('/deletecart',{id:id}).then(res=>{
      if (res.code == 1) {
        // console.log(res);
      }
    })
    this.setData({
      list: this.data.list
    })
    this.totalPrice()
  },
 
  closeFun:function(){
    let list = []
    let listTotal = []
    this.data.list.map((v, k) => {
      if (v.select) {
        list.push(v)
      }else{
        listTotal.push(v)
      }
    })
    app.http('v1/order/set', { goods: list},"POST").then(res=>{
      if(res.code == 200){
        app.http('v1/order/editCart', { list: listTotal }, "POST")
        .then(res => {
          console.log(res)
        })
        wx.navigateTo({
          url: "/pages/orderDetails/index?id=" + res.data._id
        });
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (app.globalData.userid !== null) {
      app.http('/getcart',{userid:app.globalData.userid}).then(res=>{
        console.log(res,'购物车');
        if (res.code==1) {
          this.setData({
            list: res.data
          })
        }
       })
    }
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