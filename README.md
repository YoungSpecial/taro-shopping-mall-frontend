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
# 小程序开发
npm run dev:weapp
```
