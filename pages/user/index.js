// pages/user/index.js
Page({
  data: {
    userinfo: {},
    // 被收藏的商品的数量
    collectNums: 0
  },
  onShow(){
    const userinfo = wx.getStorageSync("userinfo");
    // 从缓存中获取收藏的商品数量
    const collectNums = wx.getStorageSync("collect").length;
    this.setData({ userinfo, collectNums})
  }
})