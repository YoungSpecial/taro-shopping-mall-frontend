# Taro 电商小程序项目

基于 Taro 4.x + React 18 + TypeScript 构建的跨平台电商小程序项目，支持微信小程序、H5、支付宝小程序等多端部署。

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

## 📁 项目结构

```
src/
├── app.tsx                    # 应用入口
├── app.config.ts              # 应用配置
├── types/                     # TypeScript 类型定义
├── services/                  # API 服务层
│   ├── api.ts                 # 主 API 服务
│   └── mockData.ts            # Mock 数据
├── utils/                     # 工具函数
│   └── httpClient.ts          # HTTP 客户端
├── contexts/                  # React Context
│   ├── AppProvider.tsx        # 应用全局 Provider
│   ├── ProductContext.tsx     # 商品状态管理
│   └── CartContext.tsx        # 购物车状态管理
├── components/                # 组件库（原子设计）
│   ├── atoms/                 # 原子组件（Button、Input、Icon等）
│   ├── molecules/             # 分子组件（ProductCard、CartItem等）
│   ├── organisms/             # 有机体组件（ProductList、BottomNavigation等）
│   ├── templates/             # 模板组件
│   ├── loading/               # 加载状态组件
│   ├── transitions/           # 过渡动画组件
│   └── touch/                 # 触摸交互组件
├── pages/                     # 页面组件
│   ├── index/                 # 首页
│   ├── product/               # 商品相关
│   │   └── detail.tsx         # 商品详情页
│   ├── cart/                  # 购物车
│   │   └── index.tsx          # 购物车页
│   └── order/                 # 订单相关
│       ├── checkout.tsx       # 结算页
│       ├── success.tsx        # 订单成功页
│       ├── history.tsx        # 订单历史页
│       └── single-checkout.tsx # 单商品结算页
└── styles/                    # 样式文件
    └── theme.ts               # 主题配置
```

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
# 微信小程序开发
npm run dev:weapp

# H5 开发
npm run dev:h5

# 支付宝小程序开发
npm run dev:alipay
```

### 构建发布
```bash
# 微信小程序构建
npm run build:weapp

# H5 构建
npm run build:h5

# 支付宝小程序构建
npm run build:alipay
```

### 测试
```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage

# 监听模式
npm run test:watch
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

```typescript
export const theme = {
  colors: {
    primary: '#FF6B6B',      // 主色调
    secondary: '#4ECDC4',    // 次要色调
    success: '#45B7D1',      // 成功状态
    warning: '#F7DC6F',      // 警告状态
    danger: '#BB8FCE',       // 危险状态
    // ... 更多颜色
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  // ... 更多配置
}
```

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

### 应用全局状态 (`AppProvider`)
- 用户认证状态
- 主题配置
- 全局 loading 状态
- 错误处理

## 🚨 错误处理

### 全局错误边界
- 组件级错误捕获
- 友好的错误提示
- 错误日志记录

### API 错误处理
- 网络错误处理
- 业务错误提示
- Mock 数据回退

## 📝 代码规范

### Git 提交规范
使用 Conventional Commits：
```bash
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具变动
```

### 代码检查
```bash
# ESLint 检查
npx eslint src/

# Stylelint 检查
npx stylelint "src/**/*.css"

# TypeScript 类型检查
npx tsc --noEmit
```

## 🧪 测试策略

### 单元测试
- 工具函数测试
- 组件逻辑测试
- Hook 测试

### 集成测试
- 页面流程测试
- API 交互测试
- 状态管理测试

### E2E 测试
- 用户操作流程测试
- 跨平台兼容性测试

## 📱 多端适配

### 平台特定代码
```typescript
// 使用 process.env.TARO_ENV 判断当前平台
if (process.env.TARO_ENV === 'weapp') {
  // 微信小程序特定代码
} else if (process.env.TARO_ENV === 'h5') {
  // H5 特定代码
}
```

### 组件适配
- 使用 `PlatformImage` 组件处理图片差异
- 使用 `PlatformNavigation` 处理导航差异
- 样式适配不同平台

## 🐛 常见问题

### 1. 微信小程序开发工具报错
- 确保已安装最新版微信开发者工具
- 检查项目配置中的 AppID
- 清理编译缓存：`npm run dev:weapp -- --clean`

### 2. TypeScript 类型错误
- 运行 `npx tsc --noEmit` 检查类型
- 更新类型定义文件
- 检查 API 响应类型匹配

### 3. 样式不生效
- 检查 CSS Modules 导入
- 确认样式文件路径正确
- 检查平台特定的样式覆盖

### 4. API 请求失败
- 检查 `.env` 配置文件
- 确认网络连接正常
- 查看浏览器控制台错误信息

## 📄 许可证

MIT License

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 支持与反馈

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 查看项目文档
- 参与社区讨论

---

**Happy Coding!** 🎉