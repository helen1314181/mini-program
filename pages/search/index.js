// 1.输入框绑定值改变事件 input事件
  // 获取到输入框的值
  // 合法性判断
  // 校验通过 把输入框的值 发送给后台
  // 返回的数据打印到页面上
// 2.防抖的实现
  // 防抖 一般是 输入框中 防止重复输入 重复发送请求
  // 节流 一般是用在页面上拉和下拉

// 引入 用来发送请求 的方法 一定要把路径写全
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 控制取消按钮是否显示
    isFocus: false,
    inputValue: ''
  },
  // 全局定时器
  TimeId: -1,
  handleInput(e) {
    // 1.获取输入框的值
    const {value} = e.detail;
    // 2.检测合法性
    if(!value.trim()) {
      // 值不合法
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    // 3.准备发送请求获取数据
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.qsearch(value)
    },1000)    
  },

  // 发送请求 获取搜索建议
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data:{query}});
    this.setData({
      goods: res
    })
  },

  // 点击取消按钮时
  handleCancel() {
    this.setData({
      inputValue: '',
      goods: [],
      isFocus: false
    })
  }
})