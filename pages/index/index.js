// 引入 用来发送请求 的方法 一定要把路径写全
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 分类导航数组
    cateList: [],
    // 楼层商品数据
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },

  // 获取 轮播图 数据
  async getSwiperList() {
    // 1.发送异步请求获取轮播图数据 可以通过promise来解决这个回调地狱问题
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // })

    // request({ url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata" })
    //   .then(result => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   })

    let result = await request({ url: "/home/swiperdata" })
    result.forEach(v => v.navigator_url = v.navigator_url.replace("main", "index"))
    this.setData({
      swiperList: result
    })
  },

  // 获取 分类导航 数据
  getCateList() {
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          cateList: result
        })
      })
  },

  // 获取 楼层商品 数据
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  }
})