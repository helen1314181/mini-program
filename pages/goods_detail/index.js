// 1.发生请求获取数据
// 2.点击轮播图 预览大图
  // 1.给轮播图绑定点击事件
  // 2.调用小程序的API previewImage
// 3.点击加入购物车
  // 1.绑定点击事件
  // 2.获取缓存中的购物车数据 数组格式
  // 3.判断当前的商品是否存在购物车里
  // 4.已经存在的话 修改商品数据 数量++ 存入缓存
  // 5.不存在 直接给购物车数组中添加新元素 填充到缓存
  // 6.弹窗
// 4.商品收藏
  // 1.页面onShow的时候，加载缓存中的商品收藏的数据
  // 2.判断当前商品是不是被收藏
      // 是 改变页面的图标 不是 正常显示
  // 3.点击商品收藏按钮
    // 1.判断该商品是否存在于缓存数组中
    // 2.已经存在 删除该商品
    // 3.没有存在 把商品添加到收藏数组中 存入到缓存中即可

// 引入 用来发送请求 的方法 一定要把路径写全
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },
  // 全局保存一下数据
  GoodsInfo: [],

  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情
  async getGoodsDetail(goods_id) {
    let result = await request({ url: '/goods/detail', data: {goods_id} })
    this.GoodsInfo = result;
    // 1.获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2.判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        pics: result.pics,
        goods_price: result.goods_price,
        goods_name: result.goods_name,
        // iphone手机不支持webp图片格式，最好让后台修改 也可以在前端暂时修改
        goods_introduce: result.goods_introduce.replace(/\.webp/g, '.jpg')
      },
      isCollect
    })
  },

  // 预览大图
  handlePreviewImage(e) {
    // 构造要预览的图片数组
    const urls = this.data.goodsObj.pics.map(v => v.pics_mid)
    // const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
    // 接受传递过来的url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      urls,
      current
    })
  },

  // 加入购物车事件
  handleCartAdd() {
    // 1.获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 2.判断当前的商品是否存在购物车里
    let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id)
    // 3.不存在 第一次添加
    if(index === -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo)
    }else {
      // 4.已经存在购物车数据 执行num++
      cart[index].num++;
    }
    // 5.把购物车重新添加到缓存中
    wx.setStorageSync("cart", cart);
    // 6.弹窗提示
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true
    })
  },

  // 点击 商品收藏图标
  handleCollect() {
    let isCollect = false;
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2.判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 3.当index！=-1时表示已经收藏过
    if(index!=-1) {
      // 在数组中删除该商品
      collect.splice(index,1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success'
      })
    } else {
      // 没有收藏过，进行收藏
      collect.push(this.GoodsInfo)
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success'
      })
    }
    // 存入缓存
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
    })
  }
})