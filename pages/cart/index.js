// 1.获取用户的收货地址
  // 1.绑定点击事件
  // 2.调用小程序内置 API 获取用户的收货地址 wx.chooseAddress  
    // 获取用户对小程序所授予 获取地址 权限状态 scope
      // 假设用户 点击获取收货地址的提示框 确定 scope值为true  可以直接调用 获取收货地址
      // 取消 false  诱导用户自己打开授权设置页面
      // 从来没有获取过 地址 scope为undefined  可以直接调用 获取收货地址
  // 3.把地址存入到缓存中

// 2.页面加载完毕
  // 1.获取本地存储中的地址数据
  // 2.把数据设置给data中的变量

// 3.onShow
  // 1.回到商品详情页面，第一次添加商品的时候 手动添加了属性 num=1 checked=true
  // 2.获取缓存中的购物车数组
  // 3.把购物车数据 填充到data中

// 4.全选的实现
  // 1.获取缓存中的购物车数组
  // 2.根据购物车中的商品数据 所有的商品都被选中 全选就被选中

// 5.总价格和总数量
  // 1.需要商品被选中
  // 2.获取购物车数组
  // 3.遍历
  // 4.判断商品是否被选中
  // 5.总价格 = 商品的单价 * 数量
  // 6.计算后的价格和数量 设置回data中

// 6.商品的选中
  // 1.绑定change事件
  // 2.获取到被修改的商品对象
  // 3.商品对象的选中状态 取反
  // 4.重新填充回data中和缓存中
  // 5.重新计算全选 总价格 总数量

// 7.全选和反选
  // 1.全选复选框绑定事件
  // 2.获取data中的全选变量 allChecked
  // 3.取反 allChecked
  // 4.遍历购物车数组 让里面商品选择状态 跟随 allChecked 改变
  // 5.购物车数组重新设置回data和缓存 allChecked设置回data

// 8.商品数量的编辑功能
  // 1.+ - 绑定同一个点击事件 区分的关键 自定义属性
  // 2.传递被点击的商品id
  // 3.获取data中的购物车数组 来获取需要被修改的商品对象
  // 4.直接修改商品对象的数量 num 当num 为1，还要-时，应该弹窗问是否需要删除 确定 删除 取消 什么都不做
  // 5.把cart数组重新设置回缓存中的data中

// 9.点击结算
  // 1.判断有没有商品
  // 2.判断有没有地址
  // 3.通过验证之后 跳转支付界面


import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 1.获取缓存中的收货地址信息
    const address = wx.getStorageSync("address")
    // 获取缓存中的商品信息
    const cart = wx.getStorageSync("cart") || [];
    // 计算全选 every 数组方法
    // 空数组 调用every 返回值为true 
    // const allChecked = cart.length ? cart.every(v=>v.checked) : false;
    // let allChecked = true;
    // let totalPrice = 0;
    // let totalNum = 0;
    // cart.forEach(v=>{
    //   if(v.checked) {
    //     totalPrice += v.num*v.goods_price;
    //     totalNum+=v.num
    //   }else {
    //     allChecked = false;
    //   }
    // })
    // // 判断数组是否为空
    // allChecked = cart.length != 0 ? allChecked : false
    // // 2.给data赋值
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })

    this.setData({
      address
    })
    // 调用封装的函数 重置data和缓存
    this.setCart(cart)
  },

  // 点击 收货地址
  async handleChooseAddress() {   
    // 获取权限状态
    // wx.getSetting({
    //   success: (result) => {
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       // 获取用户的收货地址
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1)
    //         }
    //       })
    //     } else {
    //       // 用户以前拒绝过授予权限 诱导用户重新授予权限
    //       wx.openSetting({
    //         success: (result2) => {
    //           // 获取用户的收货地址
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3)
    //             }
    //           })
    //         }
    //       })
    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // })

    // // 1.获取权限状态
    // const res1 = await getSetting()
    // const scopeAddress = res1.authSetting["scope.address"];
    // // 2.判断权限状态
    // if (scopeAddress === true || scopeAddress === undefined) {
    //   // 3.调用获取收货地址的API
    //   const res2 = await chooseAddress(); 
    //   console.log(res2)     
    // } else {
    //   // 3.诱导用户重新授予权限
    //   await openSetting();
    //   const res2 = await chooseAddress();
    //   console.log(res2)
    // }

    try {
      // 1.获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting["scope.address"];
      // 2.判断权限状态
      if (scopeAddress === false) {
        // 3.诱导用户重新授予权限
        await openSetting();
      }
      // 4.调用获取收货地址的API
      const res2 = await chooseAddress();
      res2.all = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo;

      // 5.存入到缓存中
      wx.setStorageSync("address", res2)
    } catch(error) {
      console.log(error)
    }
  },

  // 点击商品的复选框
  handleToggleChange(e) {
    // 获取被修改的商品id
    const {id} = e.currentTarget.dataset
    // 获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === id);
    // 选中状态和取反
    cart[index].checked = !cart[index].checked;
    // 调用封装的函数 重置data和缓存
    this.setCart(cart)    
  },

  // 全选的复选框
  allChanged() {
    this.data.allChecked = !this.data.allChecked;
    let { cart } = this.data;
    cart.forEach(v => {
      v.checked = this.data.allChecked
    })
    this.setCart(cart)
  },

  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {    
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false
    // 2.给data赋值
    this.setData({
      allChecked,
      totalPrice,
      totalNum,
      cart
    })
    wx.setStorageSync("cart", cart)
  },

  // 编辑商品的数量
  async editNum(e) {
    const {id, operation} = e.currentTarget.dataset;
    const {cart} = this.data;
    let index = cart.findIndex(v => v.goods_id === id);

    if (cart[index].num===1 && operation===-1) {
      // wx.showModal({
      //   title: '提示',
      //   content: '您是否要删除该商品？',
      //   success: (res) => {
      //     if(res.confirm) {
      //       cart.splice(index, 1);
      //       this.setCart(cart)
      //     }else if(res.cancel) {
      //       console.log("用户点击了取消")
      //     }
      //   }
      // })
      const res = await showModal({ content: "您是否要删除该商品？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart)
      }
    } else {
      // 更改数量
      cart[index].num = cart[index].num + operation;
      // 调用封装的函数 重置data和缓存
      this.setCart(cart)
    }     
  },

  // 点击结算
  async handlePay() {
    // 获取商品信息
    const {address, totalNum} = this.data;
    if (!address.userName) {
      await showToast({ title: '请添加收货地址哦' });
      return;
    }
    if (totalNum===0) {
      await showToast({ title: '请选购商品哦' });
      return;
    }
    // 跳转支付界面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})