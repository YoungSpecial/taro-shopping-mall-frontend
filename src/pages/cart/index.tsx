import { View, Text, ScrollView, Button } from '@tarojs/components'
import { useLoad, navigateTo, showToast } from '@tarojs/taro'
import { useCart } from '../../hooks'
import CartItem from '../../components/molecules/CartItem'
import Icon from '../../components/atoms/Icon'
import { theme } from '../../styles/theme'
import './index.css'

export default function Cart() {
  const { state, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart()
  const { cart, loading } = state

  useLoad(() => {
    console.log('Cart page loaded.')
  })

  const handleQuantityChange = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity)
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
  }

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      showToast({
        title: '购物车为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    navigateTo({
      url: '/pages/order/checkout'
    })
  }

  const handleContinueShopping = () => {
    navigateTo({
      url: '/pages/index/index'
    })
  }

  const totalPrice = getTotalPrice()
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <View className="cart-page">
      <View className="cart-header">
        <Text className="cart-title">购物车</Text>
        {cart.items.length > 0 && (
          <Text className="cart-count">({itemCount}件商品)</Text>
        )}
      </View>

      {loading ? (
        <View className="loading-container">
          <Text>加载中...</Text>
        </View>
      ) : cart.items.length === 0 ? (
        <View className="empty-cart">
          <Icon name="cart" size="xl" color={theme.colors.gray300} />
          <Text className="empty-title">购物车空空如也</Text>
          <Text className="empty-description">快去挑选心仪的商品吧</Text>
          <Button
            className="continue-shopping-btn"
            onClick={handleContinueShopping}
          >
            去逛逛
          </Button>
        </View>
      ) : (
        <>
          <ScrollView className="cart-items" scrollY>
            {cart.items.map(item => (
              <CartItem
                key={item.productId}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </ScrollView>

          <View className="cart-footer">
            <View className="cart-summary">
              <View className="total-section">
                <Text className="total-label">合计:</Text>
                <Text className="total-price">¥{totalPrice.toFixed(2)}</Text>
              </View>
              <Text className="shipping-note">(不含运费)</Text>
            </View>

            <View className="cart-actions">
              <Button
                className="clear-cart-btn"
                onClick={clearCart}
              >
                清空购物车
              </Button>
              <Button
                className="checkout-btn"
                onClick={handleCheckout}
              >
                去结算 ({itemCount})
              </Button>
            </View>
          </View>
        </>
      )}
    </View>
  )
}
