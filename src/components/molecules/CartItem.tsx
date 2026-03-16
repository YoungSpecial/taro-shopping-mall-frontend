import React, { useState } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import { CartItem as CartItemType } from '../../types'
import Icon from '../atoms/Icon'
import { theme } from '../../styles/theme'

interface CartItemProps {
  item: CartItemType
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity)

  const handleIncrease = () => {
    const newQuantity = localQuantity + 1
    if (newQuantity <= item.stock) {
      setLocalQuantity(newQuantity)
      onQuantityChange(item.id, newQuantity)
    }
  }

  const handleDecrease = () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1
      setLocalQuantity(newQuantity)
      onQuantityChange(item.id, newQuantity)
    }
  }

  const handleRemove = () => {
    onRemove(item.id)
  }

  const itemTotal = item.price * item.quantity

  return (
    <View style={{
      display: 'flex',
      padding: '16px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e0e0e0',
      alignItems: 'flex-start'
    }}>
      <View style={{
        width: '80px',
        height: '80px',
        marginRight: '12px',
        borderRadius: '4px',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <Image 
          src={item.image} 
          mode="aspectFill" 
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <View style={{ flex: 1, marginRight: '12px' }}>
        <Text style={{
          fontSize: '14px',
          color: '#333',
          marginBottom: '4px',
          lineHeight: '1.4'
        }}>{item.name}</Text>
        
        {item.attributes && Object.keys(item.attributes).length > 0 && (
          <View style={{ marginBottom: '4px' }}>
            {Object.entries(item.attributes).map(([key, value]) => (
              <Text key={key} style={{
                fontSize: '12px',
                color: '#666',
                marginRight: '8px'
              }}>
                {key}: {value}
              </Text>
            ))}
          </View>
        )}

        <Text style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#ff6b6b',
          marginBottom: '4px'
        }}>¥{item.price.toFixed(2)}</Text>

        {item.stock < 10 && (
          <Text style={{
            fontSize: '12px',
            color: '#ff6b6b'
          }}>
            仅剩{item.stock}件
          </Text>
        )}
      </View>

      <View style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px'
      }}>
        <View style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Button 
            onClick={handleDecrease}
            disabled={localQuantity <= 1}
            style={{
              width: '28px',
              height: '28px',
              minWidth: '28px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: localQuantity <= 1 ? '#f5f5f5' : '#f0f0f0',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            <Icon name="minus" size="sm" />
          </Button>
          
          <View style={{
            width: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              fontSize: '14px',
              color: '#333',
              fontWeight: 'bold'
            }}>{localQuantity}</Text>
          </View>
          
          <Button 
            onClick={handleIncrease}
            disabled={localQuantity >= item.stock}
            style={{
              width: '28px',
              height: '28px',
              minWidth: '28px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: localQuantity >= item.stock ? '#f5f5f5' : '#f0f0f0',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            <Icon name="plus" size="sm" />
          </Button>
        </View>

        <View style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Text style={{
            fontSize: '12px',
            color: '#666'
          }}>小计:</Text>
          <Text style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }}>¥{itemTotal.toFixed(2)}</Text>
        </View>

        <Button 
          onClick={handleRemove}
          style={{
            width: '28px',
            height: '28px',
            minWidth: '28px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none'
          }}
        >
          <Icon name="trash" size="sm" color={theme.colors.gray500} />
        </Button>
      </View>
    </View>
  )
}

export default CartItem