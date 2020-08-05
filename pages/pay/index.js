// 1.页面加载的时候
  // 1.从缓存中获取购物车数据 渲染到页面中 获取checked=true

// 2.微信支付
  // 1.哪些人 哪些账号 可以实现微信支付
    // 1.企业账号
    // 2.企业账号的小程序后台中 必须给开发者 添加上白名单
      // 1.一个APPID可以同时绑定多个开发者
      // 2.这些开发者就可以公用这个APPID和他的开发权限

// 3.支付按钮
  // 1.先判断缓存中有没有token
  // 2.没有 跳转授权页面 获取token
  // 3.有token
  // 4.创建订单 获取订单编号
  // 5.已经完成了微信支付
  // 6.手动删除缓存中 已经被选中的商品
  // 7.删除后的购物车数据 填充回缓存
  // 8.跳转页面

import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js"
import { request } from '../../request/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 1.获取缓存中的收货地址信息
    const address = wx.getStorageSync("address")
    // 获取缓存中的商品信息
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v=>v.checked)

    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num    
    })
    // 2.给data赋值
    this.setData({
      totalPrice,
      totalNum,
      cart,
      address
    })
  },

  // 点击支付的功能 
  async handleOrderPay() {
    try {
      // 1.判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 2.判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return
      }
      // 3.创建订单
      // 3.1 准备请求头参数  后续封装到了request文件中
      // const header = { Authorization: token };
      // 3.2 准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }
      // 4.发送请求，创建订单，获取订单编号
      // const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams, header })
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams })
      console.log(order_number)
      // 5.发起 预支付接口
      // const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number }, header })
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } })
      console.log(pay)
      // 6.发起微信支付 这里我支付不成功 MiniProgramError { "errMsg": "requestPayment:fail no permission" }
      await requestPayment(pay)
      // 7.查询后台 订单状态
      // const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number }, header })
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } })
      await showToast({ title: "支付成功" })

      // 8.手动删除缓存中 已经支付了的数据
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart)

      // 9.支付成功，跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      })
    } catch(error) {
      await showToast({ title: "支付失败" })
      console.log(error)
    }
  }
})