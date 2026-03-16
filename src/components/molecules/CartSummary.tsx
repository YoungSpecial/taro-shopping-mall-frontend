import React from 'react'
import { View, Text } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { useCart } from '../../hooks'
import Icon from '../atoms/Icon'
import { theme } from '../../styles/theme'

interface CartSummaryProps {
  showCount?: boolean
  showTotal?: boolean
  compact?: boolean
  onClick?: () => void
}

const CartSummary: React.FC<CartSummaryProps> = ({
  showCount = true,
  showTotal = false,
  compact = false,
  onClick
}) => {
  const { getItemCount, getTotalPrice } = useCart()
  const itemCount = getItemCount()
  const totalPrice = getTotalPrice()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigateTo({
        url: '/pages/cart/index'
      })
    }
  }

  if (compact) {
    return (
      <View 
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        <Icon name="cart" size="md" />
        {itemCount > 0 && (
          <View style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            minWidth: '16px',
            height: '16px',
            backgroundColor: theme.colors.danger,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px'
          }}>
            <Text style={{
              fontSize: '10px',
              color: theme.colors.white,
              fontWeight: 'bold'
            }}>
              {itemCount > 99 ? '99+' : itemCount}
            </Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <View 
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: theme.colors.gray50,
        borderRadius: theme.borderRadius.md,
        cursor: 'pointer',
        border: `1px solid ${theme.colors.gray200}`
      }}
    >
      <View style={{ position: 'relative' }}>
        <Icon name="cart" size="md" />
        {itemCount > 0 && (
          <View style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            minWidth: '18px',
            height: '18px',
            backgroundColor: theme.colors.danger,
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px'
          }}>
            <Text style={{
              fontSize: '11px',
              color: theme.colors.white,
              fontWeight: 'bold'
            }}>
              {itemCount > 99 ? '99+' : itemCount}
            </Text>
          </View>
        )}
      </View>

      {showCount && itemCount > 0 && (
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray700,
          fontWeight: theme.typography.fontWeight.medium
        }}>
          {itemCount}件
        </Text>
      )}

      {showTotal && itemCount > 0 && (
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.primary,
          fontWeight: theme.typography.fontWeight.bold
        }}>
          ¥{totalPrice.toFixed(2)}
        </Text>
      )}
    </View>
  )
}

export default CartSummary