// 页面被打开的时候 onShow
  // 1.onShow不同于onLoad 无法在形参上接收options参数
  // 2.获取URL上的参数type 判断缓存中是否有token 没有 直接跳转授权页面
  // 3.根据type 去发送请求获取订单数据 根据传过来的参数判断哪个应该被选中
  // 4.渲染页面
// 2.点击不同的标题 重新发送请求获取和渲染数据
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      }, {
        id: 1,
        value: "待付款",
        isActive: false
      }, {
        id: 2,
        value: "待发货",
        isActive: false
      }, {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
  },

  onShow(options) {
    // 0.判断token是否存在
    const token = wx.getStorageSync("token");
    if (!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return;
    }
    // 1.获取当前小程序的页面栈（是一个数组 长度最大是10，即在小程序中，在内存中最多只保留10个页面）
    let pages = getCurrentPages();
    // 2.数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length-1];
    console.log(currentPage.options);
    // 3.获取URL地址上的type参数
    const {type} = currentPage.options;
    // 激活选中页面标题 当type=1 index=0
    this.changeTitleByIndex(type-1);
    // 4.获取订单列表
    this.getOrders(type)
  },

  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: {type}})
    this.setData({
      orders: res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },

  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    // 2.修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },

  // 标题点击事件，从子组件中传递过来
  handleTabsItemChange(e) {
    // 1.获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 2.重新发送请求 type=1 index=0
    this.getOrders(index+1)
  }  
})