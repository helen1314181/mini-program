// 引入 用来发送请求 的方法 一定要把路径写全
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容滚动条距顶部的距离
    scrollTop: 0
  },
  // 所有分类数据
  cateList: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 0.小程序的web上的本地存储的区别
    // 1）代码方式不同
    // 2）存的时候类型转换
    // web：不管存入的是什么类型的数据，最终都会先调用toString，把数据变为字符串，在存进去
    // 小程序：不存在类型转换，存什么类型的数据进去，获取的就是什么类型 
    // 1.先判断一下本地存储中有没有旧的数据
    // 2.没有旧数据，直接发送新请求
    // 3.有旧数据，同时旧数据也没有过期，就使用本地存储中的旧数据即可

    // 获取本地存储的数据
    const Cates = wx.getStorageSync("cates")
    // 判断
    if (!Cates) {
      // 不存在 发送请求 获取数据
      this.getCates()
    } else {
      // 有旧的数据，判断是否过期
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates()
      } else {
        // 可以使用旧数据
        this.cateList = Cates.data;
        // 构造左侧的大菜单数据
        let leftMenuList = this.cateList.map(v => v.cat_name)
        // 构造右侧的商品数据
        let rightContent = this.cateList[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  // 获取分类数据
  getCates() {
    request({ url: "/categories" })
      .then(result => {
        this.cateList = result;

        // 把接口的数据存入到本地存储中
        wx.setStorageSync("cates", { time: Date.now(), data: this.cateList })

        // 构造左侧的大菜单数据
        let leftMenuList = this.cateList.map(v => v.cat_name)
        // 构造右侧的商品数据
        let rightContent = this.cateList[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      })
  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    console.log(e);
    // 1.获取被点击的标题身上的所有
    // 2.给data中的currentIndex赋值
    // 3.重新获取右侧内容
    const { index } = e.currentTarget.dataset;
    let rightContent = this.cateList[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      // 设置滚动条距顶部的距离
      scrollTop: 0
    })
  }
})