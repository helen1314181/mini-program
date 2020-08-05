// 用户上滑界面 滚动条触底 开始加载下一页数据
//  1.找到滚动条触底事件
//  2.判断还有没有下一页数据
//      获取到总页数 = Math.ceil(总条数 / 页容量) 判断当前页数是否大于等于总页数
//  3.假如没有下一页数据 弹出提示
//  4.有下一页 就加载数据
//      当前页码++ 重新发送请求 对数组进行拼接

// 下拉刷新页面
//  1.触发下拉刷新事件 
//  2.重置 数据 数组
//  3.重置页码 设置为1
//  4.重新发送请求
//  5.数据请求回来 需要手动关闭等待效果

// 引入 用来发送请求 的方法 一定要把路径写全
import { request } from "../../request/index.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        value: "综合",
        isActive: true
      }, {
        id: 1,
        value: "销量",
        isActive: false
      }, {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },

  // 接口需要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList()
  },

  // 获取商品分类列表数据
  async getGoodsList() {
    let result = await request({ url: '/goods/search',data:this.QueryParams})
    // 获取总条数
    const total = result.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...result.goods]
    })

    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },

  // 标题点击事件，从子组件中传递过来
  handleTabsItemChange(e) {
    // 1.获取被点击的标题索引
    const {index} = e.detail;
    // 2.修改原数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },

  // 页面上滑，滚动条触底事件
  onReachBottom() {
    // 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      wx.showToast({
        title: '没有下一页数据',
      })
    } else {
      // 还有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList()
    }
  },

  // 下拉刷新事件
  onPullDownRefresh() {
    // 1.重置数组
    this.setData({
      goodsList: []
    })
    // 2.重置页码
    this.QueryParams.pagenum = 1;
    // 3.发送请求
    this.getGoodsList()
  }
})