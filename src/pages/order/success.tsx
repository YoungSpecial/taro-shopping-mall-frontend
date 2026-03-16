import { View, Text, Button, Image } from '@tarojs/components'
import {useLoad, navigateTo, showToast, useRouter} from '@tarojs/taro'
import { useState } from 'react'
import Icon from '../../components/atoms/Icon'
import { theme } from '../../styles/theme'
import './success.css'
import {ApiService} from "../../services/api";
import {OrderResponse} from "../../types";

export default function OrderSuccess() {
  const router = useRouter()
  const { orderId,detail } = router.params
  const [order, setOrder] = useState<OrderResponse | undefined>(undefined)

  const getOrder = async () => {
    if(!orderId) return;
    const data = await ApiService.getOrder(orderId);
    console.log('orders:',data)
    setOrder(data || undefined);
  }

  useLoad(() => {
    getOrder();
  })

  if(!order || !order.shippingAddress || !order.items){
    return <View>未找到订单</View>
  }

  const navigateToHome = () => {
    navigateTo({
      url: '/pages/index/index'
    })
  }

  const navigateToOrderHistory = () => {
    navigateTo({
      url: '/pages/order/history'
    })
  }

  const copyOrderNumber = () => {
    // In a real app, this would copy to clipboard
    showToast({
      title: '订单号已复制',
      icon: 'success',
      duration: 1500
    })
  }

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
      'delivered': theme.colors.success,
      'cancelled': theme.colors.danger
    }
    return colorMap[status] || theme.colors.gray500
  }

  return (
    <View className="order-success-page">
      {!detail ? <View className="success-header" >
        <View className="success-icon">
          <Icon name="check" size="xl" color={theme.colors.success} />
        </View>
        <Text className="success-title">订单提交成功！</Text>
        <Text className="success-subtitle">感谢您的购买，订单已确认</Text>
      </View> : <View></View>}

      <View className="order-info-card">
        <View className="order-info-header">
          <Text className="order-info-title">订单信息</Text>
          <View
            className="order-status-badge"
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            <Text className="order-status-text">{getStatusText(order.status)}</Text>
          </View>
        </View>

        <View className="order-detail-row">
          <Text className="order-detail-label">订单编号:</Text>
          <View className="order-detail-value">
            <Text className="order-number">{order.id}</Text>
            <Button
              className="copy-btn"
              onClick={copyOrderNumber}
              size="mini"
            >
              复制
            </Button>
          </View>
        </View>

        <View className="order-detail-row">
          <Text className="order-detail-label">下单时间:</Text>
          <Text className="order-detail-value">{order.createdAt}</Text>
        </View>

        <View className="order-detail-row">
          <Text className="order-detail-label">支付方式:</Text>
          <Text className="order-detail-value">
            {order.paymentMethod === 'simulated' ? '模拟支付' :
             order.paymentMethod === 'wechat' ? '微信支付' : '支付宝'}
          </Text>
        </View>

        <View className="order-detail-row">
          <Text className="order-detail-label">配送方式:</Text>
          <Text className="order-detail-value">
            {order.shippingMethod === 'standard' ? '标准配送' :
             order.shippingMethod === 'express' ? '快递配送' : '免邮配送'}
          </Text>
        </View>

        <View className="order-detail-row">
          <Text className="order-detail-label">收货地址:</Text>
           <View className="order-detail-value address-details">
            <Text>{order.shippingAddress.name}</Text>
            <Text>{order.shippingAddress.phone}</Text>
            <Text>{order.shippingAddress.province}{order.shippingAddress.city}{order.shippingAddress.district}{order.shippingAddress.address}</Text>
            <Text>邮编: {order.shippingAddress.postalCode}</Text>
          </View>
        </View>
      </View>

      <View className="order-items-card">
        <Text className="section-title">订单商品</Text>
        {order.items.map(item => (
          <View key={item.productId} className="order-item">
            <Image src={item.productImage} className="item-image" />
            <View className="item-details">
               <Text className="item-name">{item.productName}</Text>
              <Text className="item-price">¥{item.price.toFixed(2)}</Text>
            </View>
            <View className="item-quantity">
              <Text className="quantity-text">×{item.quantity}</Text>
            </View>
          </View>
        ))}

        <View className="order-summary">
          <View className="summary-row">
            <Text className="summary-label">商品小计:</Text>
            <Text className="summary-value">¥{order.totalAmount.toFixed(2)}</Text>
          </View>
          <View className="summary-row">
            <Text className="summary-label">运费:</Text>
            <Text className="summary-value">¥{order.shippingFee.toFixed(2)}</Text>
          </View>
          <View className="summary-row total-row">
            <Text className="summary-label">订单总额:</Text>
            <Text className="summary-value total-price">¥{order.totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View className="action-buttons">
        <Button
          className="primary-btn"
          onClick={navigateToOrderHistory}
        >
          查看订单历史
        </Button>
        <Button
          className="secondary-btn"
          onClick={navigateToHome}
        >
          返回首页
        </Button>
      </View>

      <View className="help-section">
        <Text className="help-title">需要帮助？</Text>
        <Text className="help-text">
          如有任何问题，请联系客服: 400-123-4567
        </Text>
        <Text className="help-text">
          您也可以在我的订单中查看订单状态和物流信息
        </Text>
      </View>
    </View>
  )
}
