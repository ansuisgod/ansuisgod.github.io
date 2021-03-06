// pages/choosePicture/choosePicture.js
/**
 * 选择注册用户的角色
 */
var abstac = require('../../../commonmethod/abstract.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',//从上个页面传的参数：用户的昵称
    regCode: '',//从上个页面传的参数：注册密码
    regPhone: '',//从上个页面传的参数：注册电话号码
    verificationCode: '',//从上个页面传的参数：注册验证码
    role_id: '1',//角色id
    array: [{ src: '../../../static/type1.png', type: '1型糖友', value: '1' }, 
            { src: '../../../static/type2.png', type: '2型糖友', value: '2' },
            { src: '../../../static/type3.png', type: '糖友亲友', value: '14' }, 
            { src: '../../../static/type4.png', type: '医生', value: '4' },
            { src: '../../../static/type5.png', type: '其他', value: '4' }],
    id: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickName: options.nickName,
      regCode: options.regCode,
      regPhone: options.regPhone,
      regverificationCodePhone: options.verificationCode,
      platform: app.globalData.platform,
      inviterid: options.inviterid
    });
    //打印日志
    console.log(options.inviterid);
  },
  /**
   * 点击图片用户的时候触发的函数
   */
  clickPicFunc: function (e) {
    //打印日志
    console.log(e);
    let ids = e.currentTarget.dataset.id,  //获取自定义的ID值
      roleid = e.currentTarget.dataset.val;//获取角色id
    this.setData({
      id: ids,
      role_id: roleid
    })
  },
  /**
   * @desc:点击完成按钮触发的函数
   * @param：无
   */
  finishReg: function () {
    let randomm = abstac.randomWord(false, 20),//生成随机数伪造一个设备id
      unickName = this.data.nickName,//用户的昵称
      platforms = abstac.mobilePhoneModels(this.data.platform);
    /**
     * 判断nickName是否为空,如果为空则表示用户在输入昵称的页面没有输入昵称，否则说明有昵称
     */
    if (unickName == '') {
      unickName = '';
    } else {
      unickName = this.data.nickName;
    }
    //打印日志
    console.log("randomm=" + randomm + "*platform===" + platforms + "*注册电话号码=" + this.data.regPhone + "*密码=" + this.data.regCode + "*验证码==" + this.data.regverificationCodePhone + "*昵称=" + unickName + '*角色id' + this.data.role_id + '&inviterid=' + this.data.inviterid);
    let that = this;
    /**
     * @desc:调用注册的接口
     * @param:phone：注册电话号码、password:注册密码、code:注册验证码、platform:【1.苹果。2.安卓】、device_id、nick_name:用户昵称、role_id:角色id
     * */
    abstac.sms_Interface(app.publicVariable.registerInterfaceAddress,
      {
        phone: this.data.regPhone, password: this.data.regCode, code: this.data.regverificationCodePhone, platform: platforms,
        device_id: randomm, nick_name: unickName, role_id: this.data.role_id, inviter: this.data.inviterid
      },
      function (res) {
        console.log("****************用户注册接口成功时返回函数***************");
        console.log(res);
        if (res.data.result.code == '2000') {
          wx.navigateTo({
            url: '../../../pages/login/login'
          });
        } else {
          abstac.promptBox(res.data.result.message);
        }
      },
      function (error) {
        console.log(error);
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})