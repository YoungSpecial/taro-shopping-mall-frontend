import React from 'react'
import { View, Text } from '@tarojs/components'
import Icon from '../atoms/Icon'
import { theme } from '../../styles/theme'

export interface ShippingMethod {
  id: string
  name: string
  cost: number
  days: string
  condition?: string
}

interface ShippingMethodSelectorProps {
  methods: ShippingMethod[]
  selectedMethod: string
  onSelect: (methodId: string) => void
  showTitle?: boolean
  compact?: boolean
}

const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({
  methods,
  selectedMethod,
  onSelect,
  showTitle = true,
  compact = false
}) => {
  if (compact) {
    return (
      <View style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        border: `1px solid ${theme.colors.gray200}`
      }}>
        {showTitle && (
          <View style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.md
          }}>
            <Icon name="arrow-right" size="md" color={theme.colors.primary} />
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.gray900
            }}>
              配送方式
            </Text>
          </View>
        )}

        <View style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm
        }}>
          {methods.map(method => (
            <View 
              key={method.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                border: `1px solid ${selectedMethod === method.id ? theme.colors.primary : theme.colors.gray200}`,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: selectedMethod === method.id ? theme.colors.gray50 : theme.colors.white,
                cursor: 'pointer'
              }}
              onClick={() => onSelect(method.id)}
            >
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.gray900
                }}>
                  {method.name}
                </Text>
                <Text style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.gray600
                }}>
                  {method.days}
                </Text>
                {method.condition && (
                  <Text style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.warning,
                    fontStyle: 'italic'
                  }}>
                    {method.condition}
                  </Text>
                )}
              </View>
              <Text style={{
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.bold,
                color: selectedMethod === method.id ? theme.colors.primary : theme.colors.gray900
              }}>
                {method.cost === 0 ? '免费' : `¥${method.cost}`}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View style={{
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg
    }}>
      {showTitle && (
        <View style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.lg
        }}>
          <Icon name="arrow-right" size="md" color={theme.colors.primary} />
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.gray900
          }}>
            配送方式
          </Text>
        </View>
      )}

      <View style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md
      }}>
        {methods.map(method => (
          <View 
            key={method.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              border: `2px solid ${selectedMethod === method.id ? theme.colors.primary : theme.colors.gray200}`,
              borderRadius: theme.borderRadius.md,
                backgroundColor: selectedMethod === method.id ? theme.colors.gray50 : theme.colors.white,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => onSelect(method.id)}
          >
            <View style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md
            }}>
              <View style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${selectedMethod === method.id ? theme.colors.primary : theme.colors.gray300}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedMethod === method.id && (
                  <View style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary
                  }} />
                )}
              </View>
              
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <Text style={{
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.gray900
                }}>
                  {method.name}
                </Text>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray600
                }}>
                  {method.days}
                </Text>
                {method.condition && (
                  <Text style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.warning,
                    fontStyle: 'italic'
                  }}>
                    {method.condition}
                  </Text>
                )}
              </View>
            </View>
            
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: selectedMethod === method.id ? theme.colors.primary : theme.colors.gray900
            }}>
              {method.cost === 0 ? '免费' : `¥${method.cost}`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default ShippingMethodSelector