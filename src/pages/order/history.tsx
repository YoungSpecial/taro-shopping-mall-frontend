import { View, Text, ScrollView, Button } from '@tarojs/components'
import { useLoad, navigateTo, showToast } from '@tarojs/taro'
import { useState } from 'react'
import Icon from '../../components/atoms/Icon'
import { theme } from '../../styles/theme'
import './history.css'
import {ApiService} from "../../services/api";
import {Category, OrderResponse} from "../../types/index";

// Mock order history data
const mockOrders = [
  {
    id: 'ORD-20250315-001',
    date: '2025-03-15 14:30:00',
    status: 'processing',
    items: [
      { id: '1', name: '无线蓝牙耳机', price: 299, quantity: 1 },
      { id: '2', name: '手机保护壳', price: 49, quantity: 2 }
    ],
    total: 405,
    itemCount: 3
  },
  {
    id: 'ORD-20250314-002',
    date: '2025-03-14 10:15:00',
    status: 'shipped',
    items: [
      { id: '3', name: '智能手表', price: 899, quantity: 1 }
    ],
    total: 899,
    itemCount: 1
  },
  {
    id: 'ORD-20250312-003',
    date: '2025-03-12 16:45:00',
    status: 'delivered',
    items: [
      { id: '4', name: '笔记本电脑', price: 5999, quantity: 1 },
      { id: '5', name: '鼠标', price: 89, quantity: 1 }
    ],
    total: 6088,
    itemCount: 2
  },
  {
    id: 'ORD-20250310-004',
    date: '2025-03-10 09:20:00',
    status: 'cancelled',
    items: [
      { id: '6', name: '平板电脑', price: 2499, quantity: 1 }
    ],
    total: 2499,
    itemCount: 1
  }
]

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filter, setFilter] = useState<'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all')

  const getOrders = async () => {
    const response = await ApiService.getOrders(1, 10);
    console.log('orders response',response);
    setOrders(response.content);
  }
  useLoad(() => {
    console.log('Order history page loaded.')
    getOrders();
  })

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter)

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'PAID': '已付款',
      'shipped': '已发货',
      'delivered': '已送达',
      'cancelled': '已取消'
    }
    return statusMap[status] || '未知状态'
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'processing': theme.colors.warning,
      'shipped': theme.colors.secondary,
      'PAID': theme.colors.success,
      'cancelled': theme.colors.danger
    }
    return colorMap[status] || theme.colors.gray500
  }

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, string> = {
      'PAID': 'clock',
      'shipped': 'truck',
      'delivered': 'check',
      'cancelled': 'close'
    }
    return iconMap[status] as any || 'info'
  }

  const handleViewOrderDetails = (orderId: number) => {
    navigateTo({
      url: `/pages/order/success?orderId=${orderId}&detail=true`
    })
  }

  const handleReorder = (orderId: string) => {
    showToast({
      title: `重新订购 ${orderId}`,
      icon: 'success',
      duration: 1500
    })
    // TODO: Implement reorder functionality
  }

  const handleContactSupport = (orderId: string) => {
    showToast({
      title: `联系客服关于订单 ${orderId}`,
      icon: 'none',
      duration: 1500
    })
    // TODO: Implement contact support functionality
  }

  const handleBackToHome = () => {
    navigateTo({
      url: '/pages/index/index'
    })
  }

  const filterButtons = [
    { id: 'all', label: '全部', count: orders.length },
    { id: 'processing', label: '处理中', count: orders.filter(o => o.status === 'processing').length },
    { id: 'shipped', label: '已发货', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: '已送达', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: '已取消', count: orders.filter(o => o.status === 'cancelled').length }
  ]

  return (
    <View className="order-history-page">
      <View className="history-header">
        <View className="header-left">
          <Icon name="menu" size="lg" color={theme.colors.primary} />
          <Text className="header-title">我的订单</Text>
        </View>
        <Button
          className="back-btn"
          onClick={handleBackToHome}
          size="mini"
        >
          返回首页
        </Button>
      </View>

      <View className="filter-section">
        <ScrollView className="filter-scroll" scrollX>
          {filterButtons.map(button => (
            <Button
              key={button.id}
              className={`filter-btn ${filter === button.id ? 'active' : ''}`}
              onClick={() => setFilter(button.id as any)}
            >
              {button.label}
              {button.count > 0 && (
                <Text className="filter-count">({button.count})</Text>
              )}
            </Button>
          ))}
        </ScrollView>
      </View>

      {filteredOrders.length === 0 ? (
        <View className="empty-state">
                  <Icon name="package" size="xl" color={theme.colors.gray400} />
          <Text className="empty-title">暂无订单</Text>
          <Text className="empty-subtitle">您还没有{filter === 'all' ? '' : filter === 'PAID' ? '处理中' : filter === 'shipped' ? '已发货' : filter === 'delivered' ? '已送达' : '已取消'}的订单</Text>
          <Button
            className="shop-now-btn"
            onClick={handleBackToHome}
          >
            去逛逛
          </Button>
        </View>
      ) : (
        <ScrollView className="orders-list" scrollY>
          {filteredOrders.map(order => (
            <View key={order.id} className="order-card">
              <View className="order-header">
                <View className="order-info">
                  <Text className="order-id">{order.orderNumber}</Text>
                  <Text className="order-date">{order.createdAt}</Text>
                </View>
                <View
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  <Icon name={getStatusIcon(order.status)} size="sm" color="white" />
                  <Text className="status-text">{getStatusText(order.status)}</Text>
                </View>
              </View>

              <View className="order-items">
                {order.items.slice(0, 2).map(item => (
                  <View key={item.productId} className="order-item">
                    <Text className="item-name">{item.productName}</Text>
                    <Text className="item-quantity">×{item.quantity}</Text>
                    <Text className="item-price">¥{(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}
                {order.items.length > 2 && (
                  <View className="more-items">
                    <Text className="more-text">等{order.items.length}件商品</Text>
                  </View>
                )}
              </View>

              <View className="order-footer">
                <View className="order-total">
                  <Text className="total-label">订单总额:</Text>
                  <Text className="total-price">¥{order.totalAmount.toFixed(2)}</Text>
                </View>

                <View className="order-actions">
                  <Button
                    className="action-btn detail-btn"
                    onClick={() => handleViewOrderDetails(order.id)}
                    size="mini"
                  >
                    查看详情
                  </Button>

                  {order.status === 'delivered' && (
                    <Button
                      className="action-btn reorder-btn"
                      onClick={() => handleReorder(order.id)}
                      size="mini"
                    >
                      再次购买
                    </Button>
                  )}

                  {(order.status === 'processing' || order.status === 'shipped') && (
                    <Button
                      className="action-btn support-btn"
                      onClick={() => handleContactSupport(order.id)}
                      size="mini"
                    >
                      联系客服
                    </Button>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View className="help-section">
        <Text className="help-title">需要帮助？</Text>
        <Text className="help-text">
          客服热线: 400-123-4567 (9:00-18:00)
        </Text>
        <Text className="help-text">
          订单问题、退货退款、物流查询等
        </Text>
      </View>
    </View>
  )
}
