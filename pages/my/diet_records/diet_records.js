// pages/my/diet_records/diet_records.js
import { $wuxButton } from '../../../components/wux'
var abstac = require('../../../commonmethod/abstract.js'),
  app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getDieList: '',  //饮食列表

    delBounced: false,//删除弹框

    delId: '',  //删除项id

    types: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
    index: 3,
    opened: !1, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wxSessionKey: wx.getStorageSync('sessionKey')
    });
    this.initButton()
  },





  /**
* @desc:获取我的饮食记录列表的接口
* @date:2019.06.14
* @auther:li
*/
  getDieList: function () {
    var that = this;

    wx.showLoading({
      title: '加载中',
    })
    // let platform = abstac.mobilePhoneModels(that.data.platform);//手机型号
    abstac.sms_Interface(app.publicVariable.getDietInterfaceAddress,
      { wx_session_key: this.data.wxSessionKey, type: '1' },
      function (res) {//查询成功
        //打印日志
        console.log("****************饮食记录列表***************");
        console.log(res);
        wx.hideLoading()
        //判断是否有数据，有则取数据
        if (res.data.result.code == '2000') {

          var data = res.data.data;
          let mm, dd;
          for (var i = 0; i < data.length; i++) {
            var dataList = data[i];

            if (dataList.inspect_at != '') {
              dataList.mm = dataList.inspect_at.slice(5, 7)   //月
              dataList.dd = dataList.inspect_at.slice(8, 10)   //日
              dataList.time = dataList.inspect_at.slice(0, 10)  //年月日
              dataList.nums = 0  //总卡路里
            }


            if (dataList.category == 0) {
              dataList.categoryText = "早餐"
            }
            if (dataList.category == 1) {
              dataList.categoryText = "上午加餐"
            }
            if (dataList.category == 2) {
              dataList.categoryText = "中餐"
            }
            if (dataList.category == 3) {
              dataList.categoryText = "下午加餐"
            }
            if (dataList.category == 4) {
              dataList.categoryText = "晚餐"
            }
            if (dataList.category == 5) {
              dataList.categoryText = "夜宵"
            }


          }




          var map = {},
              dest = [];
          for (var i = 0; i < data.length; i++) {
            var dataList = data[i];
            // console.log(map)
            // console.log(dataList.time)
            console.log(map[dataList.time])
            // console.log(!map[dataList.time])
            // console.log(!map[ai.category])
            if (!map[dataList.time]) {
              dest.push({
                categoryText: dataList.categoryText,
                mm: dataList.mm,
                dd: dataList.dd,
                time: dataList.time,
                data: [dataList]
              });
              map[dataList.time] = dataList;
              // console.log(ai)
            } else {
              for (var j = 0; j < dest.length; j++) {
                var dj = dest[j];
                if (dj.time == dataList.time) {
                  dj.data.push(dataList);
                  break;
                }
              }
            }
          }

          console.log(dest);



          // var integration = [];
          for (var z = 0; z < dest.length; z++) {
            var destList = dest[z];
            var category0 = [], category1 = [], category2 = [], category3 = [], category4 = [], category5 = [];
            for (var c = 0; c < destList.data.length; c++) {
              var dataListDea = destList.data[c];

              if (dataListDea.category == '0'){
                category0.push({
                  data: dataListDea
                })
              }
              if (dataListDea.category == '1') {
                category2.push({
                  data: dataListDea
                })
              }
              if (dataListDea.category == '2') {
                category2.push({
                  data: dataListDea
                })
              }
              if (dataListDea.category == '3') {
                category3.push({
                  data: dataListDea
                })
              }
              if (dataListDea.category == '4') {
                category4.push({
                  data: dataListDea
                })
              }
              if (dataListDea.category == '5') {
                category5.push({
                  data: dataListDea
                })
              }

              console.log(category0)
              console.log(category1)
              console.log(category2)
              console.log(category3)
              console.log(category4)
              console.log(category5)
            }

            destList.Arrs = [category0, category1, category2, category3, category4, category5]


          }

          // integration = [category0, category1, category2, category3, category4, category5]

          // console.log(integration);

          var integration = [];
          for (var v = 0; v < dest.length; v++) {
            var destList = dest[v];

            
            for (var x = 0; x < destList.Arrs.length; x++) {
              var Lists = destList.Arrs[x];
              if (Lists.length != ''){
                integration.push(Lists)
              }
          }

            


          }
          console.log(integration);



          for (var n = 0; n < integration.length; n++) {
            var Lists = integration[n];
            // console.log(Lists)
            // console.log(integration[1])
            console.log('-=-=-=-=-===')

            for (var q = 0; q < integration[n].length; q++) {
              var ListsNum = integration[n][q];
              console.log(ListsNum.data.energy)
              // Lists[0].nums = ++ListsNum.data.energy
              // Lists[0].nums += Number(ListsNum.data.energy);
              Lists[0].data.nums += parseInt(ListsNum.data.energy);
            }

          }




          that.setData({
            destList: dest,
            integration: integration,
          });



          that.setData({
            getDieList: data,
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
* @desc:删除食物记录列表的的接口
* @date:2019.06.19
* @auther:li
*/
  deleteDiet: function () {
    var that = this;
    abstac.sms_Interface(app.publicVariable.deleteDietInterfaceAddress,
      { wx_session_key: this.data.wxSessionKey, id: that.data.delId },
      function (res) {//查询成功
        //打印日志
        console.log("****************删除食物记录列表的的接口***************");
        console.log(res);

        //判断是否有数据，有则取数据
        if (res.data.result.code == '2000') {
          wx.hideLoading()
          that.getDieList()
          that.setData({
            delBounced: false
          });
          abstac.promptBox('操作成功');
        } else {
          wx.hideLoading()
          abstac.promptBox(res.data.result.message);
        }
      },
      function (error) {//查询失败
        wx.hideLoading()
        console.log(error);
      });
  },




  ////删除事件
  //删除弹框显示
  delBounced: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.info)
    // let delId = e.currentTarget.dataset.info.id



    let infos = e.currentTarget.dataset.info
    let foodArr = []
    for (var i = 0; i < infos.length; i++) {
      var foodList = infos[i];
      foodArr.push(foodList.data.id)
    }
    let ids = foodArr.join(',')
    console.log(ids)

    console.log("长按");
    wx.vibrateShort({
      success: function (res) {
      }
    })
    that.setData({
      delBounced: true,
      delId: ids,
    })
  },

  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },

  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  //删除弹框关闭
  delBounced_close: function () {

    this.setData({
      delBounced: false
    })
  },

  //弹框点击确认按钮
  delBounced_operate: function () {

    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    console.log('-=---=-=-=-==-=')
    that.deleteDiet()

  },
  ////删除事件end






  // 以下為跳转业务
  goAdd: function (e) {

    console.log(e)

    if (this.endTime - this.startTime < 350) {   //按压时间小于350毫秒跳转

      // let ids = '16397,16463,16400';
      let infos = e.currentTarget.dataset.info

      let foodArr = []
      for (var i = 0; i < infos.length; i++) {
        var foodList = infos[i];
        foodArr.push(foodList.data.food_id)
      }
      
      let ids = foodArr.join(',')


      // wx.navigateTo({   //跳转入修改状态
      //   url: '/pages/my/add_diet_Details/add_diet_Details?ids=' + ids + '&foodInfos=' + JSON.stringify(infos),
      // })

    }

  },


  goAdds: function () {  //跳转入饮食记录填写大分类
    wx.navigateTo({
      url: '/pages/my/add_diet/add_diet',
    })
  },

  goAdvice: function () {  //跳转入参考建议
    wx.navigateTo({
      url: '/pages/my/health_advice/health_advice?status=3',
    })
  },










  //去除重复数组对象
  deteleObject: function (obj) {
    // console.log(obj)
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
      var keys = Object.keys(obj[i]);
      keys.sort(function (a, b) {
        return (Number(a) - Number(b));
      });
      var str = '';
      for (var j = 0; j < keys.length; j++) {
        str += JSON.stringify(keys[j]);
        str += JSON.stringify(obj[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
        uniques.push(obj[i]);
        stringify[str] = true;
      }
    }

    app.uniques = uniques
    return uniques
    return uniques.length;
  },






  reviewStatus: function () {   //判断是否需要进入参考意见
    var that = this;
    let reviewStatus = wx.getStorageSync('reviewStatus')
    if (reviewStatus == '1') {
      wx.navigateTo({
        url: '/pages/my/health_advice/health_advice?status=2',
      })
    } else {
      wx.showModal({
        title: '请先完成评测！'
      })
    }
  },

  hideCoverss: function () {
    let menu = this.data.$wux.button.bt.opened;
    let mytypes = $wux.button.bt.opened
    this.setData({
      mytypes: !menu,
    })
  },

  // 
  // 
  initButton(position = 'bottomRight') {
    var that = this;
    this.setData({
      opened: !1,
    })

    this.button = $wuxButton.init('br', {
      position: position,
      buttons: [
        {
          label: '添加记录',
          icon: "data:image/png;base64,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",
        },
        {
          label: '参考意见',
          icon: "data:image/png;base64,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",
        }

      ],
      buttonClicked(index, item) {
        index === 0 && that.goAdds()

        index === 1 && that.reviewStatus()


        return true
      },
      callback(vm, opened) {
        vm.setData({
          opened,
        })
      },
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
    that.getDieList()
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