# Taro 电商小程序项目

基于 Taro 4.x + React 18 + TypeScript 构建的跨平台电商小程序项目

## 🚀 功能特性

### 核心功能
- **商品展示**：商品列表、详情页、分类筛选、搜索功能
- **购物车**：添加商品、数量调整、删除商品、结算
- **订单管理**：下单、支付、订单历史、订单详情
- **用户中心**：收货地址管理、支付方式选择

### 技术特性
- **跨平台支持**：一套代码多端运行（微信小程序、H5、支付宝等）
- **TypeScript**：完整的类型安全支持
- **组件化架构**：原子设计模式（Atoms/Molecules/Organisms/Templates）
- **状态管理**：React Context + 自定义 Hooks
- **API 层**：支持 Mock/真实 API 切换
- **性能优化**：图片懒加载、组件懒加载、代码分割

## 🛠️ 技术栈

- **框架**：Taro 4.1.11 + React 18
- **语言**：TypeScript 5.x
- **构建工具**：Vite 4.x
- **样式方案**：CSS Modules + 自定义主题
- **代码规范**：ESLint + Stylelint + Husky
- **测试框架**：Jest + Testing Library

## 🚦 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm 或 yarn

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发运行
```bash
# H5 开发
npm run dev:h5
```



## 📱 页面功能说明

### 首页 (`/pages/index/index`)
- 商品列表展示
- 分类筛选
- 价格/评分排序
- 搜索功能
- 下拉刷新、上拉加载

### 商品详情页 (`/pages/product/detail`)
- 商品图片轮播
- 商品信息展示
- 规格选择
- 数量选择
- 加入购物车/立即购买
- 商品评价展示

### 购物车页 (`/pages/cart/index`)
- 购物车商品列表
- 数量调整
- 商品删除
- 全选/反选
- 结算功能
- 空状态提示

### 结算页 (`/pages/order/checkout`)
- 收货地址选择/管理
- 配送方式选择
- 支付方式选择
- 订单金额计算
- 提交订单

### 订单成功页 (`/pages/order/success`)
- 订单确认信息
- 订单详情展示
- 返回首页/查看订单历史
- 订单号复制

### 订单历史页 (`/pages/order/history`)
- 订单列表展示
- 订单状态筛选
- 订单详情查看
- 分页加载

## 🔧 API 配置

项目支持 Mock API 和真实 API 切换：

### Mock API 模式（默认）
- 使用本地 Mock 数据
- 无需后端服务
- 适合开发和测试

### 真实 API 模式
1. 在项目根目录创建 `.env` 文件：
```env
API_BASE_URL=https://your-api-server.com
USE_MOCK_API=false
```

2. 配置 API 服务：
- 修改 `src/services/api.ts` 中的 API 端点
- 确保类型定义与后端接口一致

## 🎨 主题配置

主题配置位于 `src/styles/theme.ts`：

## 📦 组件设计模式

项目采用原子设计模式：

### Atoms（原子组件）
- 最小的 UI 组件单元
- 如：Button、Input、Icon、Card
- 位置：`src/components/atoms/`

### Molecules（分子组件）
- 由多个原子组件组合而成
- 如：ProductCard、CartItem、SearchBar
- 位置：`src/components/molecules/`

### Organisms（有机体组件）
- 由分子和原子组件组成的复杂组件
- 如：ProductList、BottomNavigation
- 位置：`src/components/organisms/`

### Templates（模板组件）
- 页面布局模板
- 如：ErrorBoundary、PlatformNavigation
- 位置：`src/components/templates/`

## 🔄 状态管理

### 购物车状态 (`CartContext`)
- 购物车商品列表
- 商品数量操作
- 结算逻辑
- 本地存储持久化

### 商品状态 (`ProductContext`)
- 商品列表数据
- 筛选和排序状态
- 分页加载
- 搜索功能
