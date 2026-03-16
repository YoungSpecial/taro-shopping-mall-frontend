export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/product/detail',
    'pages/cart/index',
    'pages/order/checkout',
    'pages/order/success',
    'pages/order/history',
    'pages/order/single-checkout',
    // 'pages/testing/index' // 测试页面 - 暂时禁用
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro商城',
    navigationBarTextStyle: 'black'
  }
})
