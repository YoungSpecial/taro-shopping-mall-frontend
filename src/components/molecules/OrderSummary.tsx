import React from 'react'
import { View, Text } from '@tarojs/components'
import { CartItem } from '../../types'
import Icon from '../atoms/Icon'
import { theme } from '../../styles/theme'

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  shippingCost: number
  showDetails?: boolean
  compact?: boolean
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shippingCost,
  showDetails = true,
  compact = false
}) => {
  const total = subtotal + shippingCost

  if (compact) {
    return (
      <View style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        border: `1px solid ${theme.colors.gray200}`
      }}>
        <View style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.sm
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray700,
            fontWeight: theme.typography.fontWeight.medium
          }}>
            订单摘要
          </Text>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary
          }}>
            ¥{total.toFixed(2)}
          </Text>
        </View>
        
        <View style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs
        }}>
          <Icon name="cart" size="sm" color={theme.colors.gray500} />
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.gray600
          }}>
            {items.length}件商品
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden'
    }}>
      <View style={{
        padding: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.gray200}`
      }}>
        <View style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.md
        }}>
          <Icon name="menu" size="md" color={theme.colors.primary} />
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.gray900
          }}>
            订单摘要
          </Text>
        </View>

        {showDetails && items.length > 0 && (
          <View style={{ marginBottom: theme.spacing.md }}>
            {items.map(item => (
              <View 
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${theme.spacing.sm} 0`,
                  borderBottom: `1px solid ${theme.colors.gray100}`
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.gray800,
                    marginBottom: theme.spacing.xs
                  }}>
                    {item.name}
                  </Text>
                  <Text style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.gray600
                  }}>
                    ×{item.quantity}
                  </Text>
                </View>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.primary
                }}>
                  ¥{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{
          paddingTop: theme.spacing.md,
          borderTop: `1px solid ${theme.colors.gray200}`
        }}>
          <View style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.xs
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700
            }}>
              商品小计
            </Text>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray800
            }}>
              ¥{subtotal.toFixed(2)}
            </Text>
          </View>

          <View style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.xs
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700
            }}>
              运费
            </Text>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray800
            }}>
              ¥{shippingCost.toFixed(2)}
            </Text>
          </View>

          <View style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
            borderTop: `1px solid ${theme.colors.gray200}`
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.gray900
            }}>
              订单总额
            </Text>
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.primary
            }}>
              ¥{total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default OrderSummary