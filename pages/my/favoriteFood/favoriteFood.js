// pages/my/favoriteFood/favoriteFood.js

var abstac = require('../../../commonmethod/abstract.js'),
  app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: '1',
    size: '20',

    favoriteFoodList: '', //收藏列表

    addFoodsList: [], //选中的食物

    category: '', //时间段分类id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      platform: app.globalData.platform,
      wxSessionKey: wx.getStorageSync('sessionKey'),
      category: options.category
    });


    // 处理显示消除，重新拉取数据
    let addFoodsList = wx.getStorageSync('foodsList')
    this.setData({
      addFoodsList: addFoodsList,
    })


  },



  /**
* @desc:我的饮食收藏列表的接口
* @date:2019.06.14
* @auther:li
*/
  favoriteFoodList: function () {
    var that = this;
    let platform = abstac.mobilePhoneModels(that.data.platform);//手机型号
    abstac.sms_Interface(app.publicVariable.favoriteFoodListInterfaceAddress,
      { platform: platform, wx_session_key: this.data.wxSessionKey, page: that.data.page, size: that.data.size },
      function (res) {//查询成功
        //打印日志
        console.log("****************饮食收藏列表***************");
        console.log(res);
        //判断是否有数据，有则取数据
        if (res.data.result.code == '2000') {

          var data = res.data.data.foods;

          for (let u = 0; u < data.length; u++) {
            var dataOld = data[u];
            dataOld.sureid = false
          }


          for (let j = 0; j < that.data.addFoodsList.length; j++) {
            var FoodsList = that.data.addFoodsList[j];

            for (let i = 0; i < data.length; i++) {
              var dataList = data[i];
              if (FoodsList.id == dataList.id) {
                dataList.sureid = true
                console.log('1212121212121212')
              }
            }

          };


          that.setData({
            favoriteFoodList: data,
          });

        } else {
          abstac.promptBox(res.data.result.message);
        }
      },
      function (error) {//查询失败
        console.log(error);
      });
  },








  /**
   * @desc:点击选中事件
   * @date:2019.06.10
   * @auther:li
   */
  addFood: function (e) {
    var that = this;

    console.log(e)
    // 处理点击状态
    let list = that.data.favoriteFoodList;
    console.log(e.currentTarget.dataset.item.id)
    let chooseId = e.currentTarget.dataset.item.id; //当前点击元素的自定义数据，这个很关键
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == chooseId) {
        list[i].sureid = !list[i].sureid
      }
    };


    // 点击添加入缓存数组中
    if (e.currentTarget.dataset.item.sureid == false) {
      let bok = true;
      if (that.data.addFoodsList.length == ''){
        app.addFoodsList(e.currentTarget.dataset.item)
        let addFoodsList = wx.getStorageSync('foodsList')
        that.setData({
          addFoodsList: addFoodsList,
        })
      }else{
        for (let j = 0; j < that.data.addFoodsList.length; j++) {
          var addFoods = that.data.addFoodsList[j]
          if (bok) {  //约束只能执行一次
            if (addFoods.id != e.currentTarget.dataset.item.id) {
              app.addFoodsList(e.currentTarget.dataset.item)
              bok = false
              let addFoodsList = wx.getStorageSync('foodsList')
              that.setData({
                addFoodsList: addFoodsList,
              })
            }
          }
        }
      }

    }

    // 点击删除缓存数组
    if (e.currentTarget.dataset.item.sureid == true) {
      app.deleteFoodsList(e.currentTarget.dataset.item.id)
      let addFoodsList = wx.getStorageSync('foodsList')
      that.setData({
        addFoodsList: addFoodsList,
      })
    }


    this.setData({
      favoriteFoodList: list,
      // addFoodsList: addFoodsList,
    })


  },

  // ////////////////////////////

  del: function (e) {
    var that = this;
    console.log(e)

    // 点击删除缓存数组

    app.deleteFoodsList(e.currentTarget.dataset.info.id)
    let addFoodsList = wx.getStorageSync('foodsList')
    that.setData({
      addFoodsList: addFoodsList,
    })


    // 处理点击状态
    let list = that.data.favoriteFoodList;
    let chooseId = e.currentTarget.dataset.info.id; //当前点击元素的自定义数据，这个很关键
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == chooseId) {
        list[i].sureid = false
      }
    };
    that.setData({
      favoriteFoodList: list,
    })

  },





// 以下為跳转业务
  goDetails: function () {  //跳转入跳转入饮食记录详情
    var that = this;
    let infos = that.data.addFoodsList;

    let idsList = []
    for (var k = 0; k < infos.length; k++) {
      var infosIds = infos[k];
      idsList.push(infosIds.id)
    }
    let ids = idsList.join(',')
    console.log(ids)

    wx.navigateTo({
      url: '/pages/my/add_diet_Details/add_diet_Details?ids=' + ids + '&category=' + this.data.category,
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
    var that = this;
    that.favoriteFoodList()
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