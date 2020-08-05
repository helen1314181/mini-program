import { request } from '../../request/index.js'
import { login } from "../../utils/asyncWx.js"

Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // 1.获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 2.获取小程序登录成功后的code
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code }
      // 3.发送请求 获取用户的token
      // const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "post" })
      // console.log(token)  // 这里我获取不到token 因为我不是企业的APPID 即使是企业的APPID，后台没有把我这个APPID加入白名单  
      // 所以我手动赋了一个token值
      let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo';
      // 把token存入缓存中，同时跳转回上一个界面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        // 上一级界面
        delta: 1
      })
    } catch(error) {
      console.log(error)
    }
  }
})