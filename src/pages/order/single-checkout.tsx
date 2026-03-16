import { View, Text, ScrollView, Button } from '@tarojs/components'
import {useLoad, navigateTo, showToast, useRouter} from '@tarojs/taro'
import { useState } from 'react'
import OrderSummary from '../../components/molecules/OrderSummary'
import ShippingAddressForm from '../../components/molecules/ShippingAddressForm'
import ShippingMethodSelector from '../../components/molecules/ShippingMethodSelector'
import PaymentMethodSelector from '../../components/molecules/PaymentMethodSelector'
import './checkout.css'
import {ApiService} from "../../services/api";
import {Product} from "../../types/index";

export default function SingleCheckout() {
  const router = useRouter()
  const { productId, quantity } = router.params
  console.log('Product ID:', productId, 'Quantity:', quantity)
  const [product, setProduct] = useState<Product | undefined>(undefined)

  useLoad(() => {
    getProduct();
  })

  const getProduct = async () => {
    if(!productId) return;
    const data = await ApiService.getProductById(productId);
    setProduct(data || undefined);
  }

  const [shippingAddress, setShippingAddress] = useState({
    id: 'temp',
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    postalCode: '',
    isDefault: false
  })

  const [selectedShippingMethod, setSelectedShippingMethod] = useState('free')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('simulated')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})

  console.log('Product:', product, 'Product ID:', productId)
  if(!productId || !product){
    return <View>商品不存在</View>
  }

  /**
   * id: string;
   *   productId: string;
   *   variantId?: string;
   *   name: string;
   *   price: number;
   *   quantity: number;
   *   image: string;
   *   stock: number;
   *   attributes?: Record<string, string>;
   */
  const cart = {items:[{
    id: product.id,
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity: quantity,
    image: product.images[0],
    stock: product.stock
    }]};
  console.log('Cart:', cart)
  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }))

    // Real-time validation for specific fields
    if (field === 'phone' && value.trim()) {
      if (!/^1[3-9]\d{9}$/.test(value)) {
        setAddressErrors(prev => ({
          ...prev,
          phone: '请输入有效的手机号码'
        }))
      } else {
        setAddressErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.phone
          return newErrors
        })
      }
    }

    if (field === 'postalCode' && value.trim()) {
      if (!/^\d{6}$/.test(value)) {
        setAddressErrors(prev => ({
          ...prev,
          postalCode: '请输入6位邮政编码'
        }))
      } else {
        setAddressErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.postalCode
          return newErrors
        })
      }
    }

    // Clear required field error when user starts typing
    if (value.trim() && addressErrors[field] === '此字段为必填项') {
      setAddressErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleShippingMethodSelect = (methodId: string) => {
    setSelectedShippingMethod(methodId)
  }

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
  }

  const validateAddress = () => {
    const errors: Record<string, string> = {}
    const requiredFields = ['name', 'phone', 'province', 'city', 'district', 'address', 'postalCode'] as const

    for (const field of requiredFields) {
      const value = shippingAddress[field]
      if (typeof value === 'string' && !value.trim()) {
        errors[field] = '此字段为必填项'
      }
    }

    if (shippingAddress.phone && !/^1[3-9]\d{9}$/.test(shippingAddress.phone)) {
      errors.phone = '请输入有效的手机号码'
    }

    if (shippingAddress.postalCode && !/^\d{6}$/.test(shippingAddress.postalCode)) {
      errors.postalCode = '请输入6位邮政编码'
    }

    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0) {
      showToast({
        title: '购物车为空',
        icon: 'none',
        duration: 2000
      })
      return
    }

    const isValid = validateAddress()
    if (!isValid) {
      showToast({
        title: '请完善收货地址信息',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // Validate stock availability (simulated)
    const outOfStockItems = cart.items.filter(() => {
      // Simulate random stock check - in real app this would call API
      return Math.random() < 0.1 // 10% chance of being out of stock
    })

    if (outOfStockItems.length > 0) {
      showToast({
        title: `有${outOfStockItems.length}件商品缺货，请调整后重试`,
        icon: 'none',
        duration: 3000
      })
      return
    }

    console.log("shippingAddress", shippingAddress)
    setIsSubmitting(true)

    try {
      let processingTime = 1000 // Default 1 second for simulated payment

      if (selectedPaymentMethod === 'simulated') {
        processingTime = 1500
      } else {
        processingTime = 3000
      }

      // Show processing status
      showToast({
        title: '正在处理支付...',
        icon: 'loading',
        duration: processingTime
      })

      const orderData = {
        address: shippingAddress,
        items: cart.items,
        paymentMethod: selectedPaymentMethod
      }

      const response = await ApiService.createOrder(orderData);
      if(response.status == "PAID"){
        navigateTo({
          url: `/pages/order/success?orderId=${response.id}`
        })
      }
    } catch (error) {
      console.error('Order placement failed:', error)
      showToast({
        title: selectedPaymentMethod === 'simulated'
          ? '模拟支付失败，请重试'
          : '支付处理失败，请检查支付方式',
        icon: 'none',
        duration: 3000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToCart = () => {
    navigateTo({
      url: `/pages/product/detail?productId=${product.id}`,
    });
  }

  const shippingCost = selectedShippingMethod === 'express' ? 15 : selectedShippingMethod === 'standard' ? 8 : 0
  const subtotal = getTotalPrice()
  const total = subtotal + shippingCost

  const shippingMethods = [
    // { id: 'standard', name: '免运费', cost: 0, days: '3-5个工作日' },
    // { id: 'express', name: '快递配送', cost: 15, days: '1-2个工作日' },
    { id: 'free', name: '免邮配送', cost: 0, days: '2-3个工作日' }
  ]

  const paymentMethods = [
    {
      id: 'simulated',
      name: '模拟支付',
      description: '用于演示的模拟支付方式，不会产生实际交易',
      icon: 'check',
      available: true,
      processingTime: '即时'
    },
    {
      id: 'wechat',
      name: '微信支付',
      description: '使用微信支付完成订单，支持微信钱包和银行卡',
      icon: 'wechat',
      available: false,
      fee: 0,
      processingTime: '1-3分钟'
    },
    {
      id: 'alipay',
      name: '支付宝',
      description: '使用支付宝完成订单，支持余额、花呗、银行卡',
      icon: 'alipay',
      available: false,
      fee: 0,
      processingTime: '1-3分钟'
    },
    {
      id: 'creditcard',
      name: '信用卡支付',
      description: '使用Visa/MasterCard/银联信用卡支付',
      icon: 'creditcard',
      available: false,
      fee: 1.5,
      processingTime: '即时'
    }
  ]

  return (
    <View className="checkout-page">
      <View className="checkout-header">
        <Text className="checkout-title">确认订单</Text>
        <Button
          className="back-to-cart-btn"
          onClick={handleBackToCart}
        >
          返回商品详情
        </Button>
      </View>

      <ScrollView className="checkout-content" scrollY>
        <OrderSummary
          items={cart.items}
          subtotal={subtotal}
          shippingCost={shippingCost}
          showDetails={true}
        />

        <ShippingAddressForm
          address={shippingAddress}
          onChange={handleAddressChange}
          errors={addressErrors}
          showTitle={true}
        />

        <ShippingMethodSelector
          methods={shippingMethods}
          selectedMethod={selectedShippingMethod}
          onSelect={handleShippingMethodSelect}
          showTitle={true}
        />

        <PaymentMethodSelector
          methods={paymentMethods}
          selectedMethod={selectedPaymentMethod}
          onSelect={handlePaymentMethodSelect}
          showTitle={true}
        />
      </ScrollView>

      <View className="checkout-footer">
        <View className="order-total">
          <Text className="total-label">应付金额:</Text>
          <Text className="total-price">¥{total.toFixed(2)}</Text>
        </View>

        <Button
          className="place-order-btn"
          onClick={handlePlaceOrder}
          disabled={isSubmitting || cart.items.length === 0}
          loading={isSubmitting}
        >
          {isSubmitting ? '提交中...' : '提交订单'}
        </Button>
      </View>
    </View>
  )
}
