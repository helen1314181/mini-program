// 1.点击 + 触发tap点击事件
  // 1.调用小程序内置的选择图片的API
  // 2.获取到图片的路径
  // 3.把图片路径保存到data变量中
  // 4.页面内循环显示自定义组件
// 2.点击自定义图片组件
  // 1.获取被点击的元素的索引
  // 2.获取data中的图片数组
  // 3.根据索引 数组中删除对应的元素
  // 4.把数组重新设置回data中
// 3.点击 提交
  // 1.获取文本域的内容
    // 1.data中定义变量
    // 2.文本域绑定输入事件
  // 2.对这些内容 进行合法性验证
  // 3.验证通过 用户选择的图片 上传到图片服务器 返回图片外网的链接
    // 1.遍历图片数组
    // 2.挨个上传
    // 3.自己在维护一个图片数组 存放 图片上传后的外网的链接
  // 4.文本域 和外网的图片的路径 提交到服务器
  // 5.清空当前页面
  // 6.返回上一页

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      }, {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片数组
    images: [],
    // 文本域中的内容
    textValue: ""
  },
  // 外网图片路径数组
  UploadImages: [],
  // 标题点击事件，从子组件中传递过来
  handleTabsItemChange(e) {
    // 1.获取被点击的标题索引
    const { index } = e.detail;
    // 2.修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },

  // 选择图片
  handleChoose() {
    // 调用小程序内置的选择图片的API
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          // 对图片数组 进行拼接
          images: [...this.data.images, ...res.tempFilePaths]
        })
      },
    })
  },

  // 点击自定义图片组件
  handleRemoveImg(e) {
    // 获取被点击的组件的索引
    const {index} = e.currentTarget.dataset;
    // 获取data中的图片数组
    let {images} = this.data;
    // 删除元素
    images.splice(index,1);
    this.setData({
      images
    })
  },

  // 文本域输入的事件
  handleTextInput(e) {
    this.setData({
      textValue: e.detail.value
    })
  },

  // 提交按钮的点击事件
  handleFormSubmit() {
    // 1.获取文本域的内容
    const {textValue, images} = this.data;
    // 2.合法性的校验
    if(!textValue.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return
    }
    // 3.上传图片到专门的图片服务器 上传文件的API 不支持 多个文件同时上传 所以 需要遍历数组 挨个上传
    // 显示正在等待的图片
    wx.showLoading({
      title: '正在上传中',
      mask: true
    });

    // 判断有没有需要上传的图片数组
    if(images.length != 0) {
      images.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪里 这里地址不能用了
          url: 'https://clubajax.autohome.com.cn/Upload/UpImageOfBase64New',
          // 被上传的文件的路径
          filePath: 'v',
          // 上传的文件的名称 后台来获取文件 file
          name: "file",
          header: {},
          // 顺带的文本信息
          formData: {
          },
          success: (res) => {
            let url = JSON.parse(res.data).url;
            this.UploadImages.push(url)

            // 所有图片上传完毕了才触发事件
            if (i === images.length - 1) {

              wx.hideLoading();

              console.log("把文本的内容和外网的图片数组 提交到后台中");

              // 提交都成功了 重置页面
              this.setData({
                textValue: "",
                images: []
              })
              // 返回上一个界面
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
    } else {
      wx.hideLoading();
      console.log("只是提交了文本")
      // 返回上一个界面
      wx.navigateBack({
        delta: 1
      })
    }    
  }
})