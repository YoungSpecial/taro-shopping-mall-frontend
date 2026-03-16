import React from 'react'
import { View, Text } from '@tarojs/components'
import Icon from '../atoms/Icon'
import { theme } from '../../styles/theme'

export interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: string
  available: boolean
  fee?: number
  processingTime?: string
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[]
  selectedMethod: string
  onSelect: (methodId: string) => void
  showTitle?: boolean
  compact?: boolean
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selectedMethod,
  onSelect,
  showTitle = true,
  compact = false
}) => {
  const getMethodIcon = (methodId: string) => {
    const iconMap: Record<string, string> = {
      'simulated': 'check',
      'wechat': 'wechat',
      'alipay': 'alipay',
      'creditcard': 'creditcard',
      'banktransfer': 'bank'
    }
    return iconMap[methodId] || 'check'
  }

  const getMethodColor = (methodId: string) => {
    const colorMap: Record<string, string> = {
      'simulated': theme.colors.secondary,
      'wechat': '#07C160',
      'alipay': '#1677FF',
      'creditcard': theme.colors.primary,
      'banktransfer': theme.colors.gray700
    }
    return colorMap[methodId] || theme.colors.primary
  }

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
            <Icon name="check" size="md" color={theme.colors.primary} />
            <Text style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.gray900
            }}>
              支付方式
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
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.sm,
                backgroundColor: selectedMethod === method.id ? `${getMethodColor(method.id)}10` : 'transparent',
                border: `1px solid ${selectedMethod === method.id ? getMethodColor(method.id) : theme.colors.gray200}`,
                cursor: 'pointer'
              }}
              onClick={() => method.available && onSelect(method.id)}
            >
              <View style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm
              }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: theme.borderRadius.sm,
                  backgroundColor: getMethodColor(method.id),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon name={getMethodIcon(method.id) as any} size="sm" color="white" />
                </View>
                <View>
                  <Text style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: method.available ? theme.colors.gray900 : theme.colors.gray400
                  }}>
                    {method.name}
                  </Text>
                  {!method.available && (
                    <Text style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.gray400
                    }}>
                      暂不可用
                    </Text>
                  )}
                </View>
              </View>
              
              {selectedMethod === method.id && (
                <Icon name="check" size="sm" color={getMethodColor(method.id)} />
              )}
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
      overflow: 'hidden'
    }}>
      {showTitle && (
        <View style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.gray200}`
        }}>
          <View style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.xs
          }}>
            <Icon name="check" size="md" color={theme.colors.primary} />
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.gray900
            }}>
              支付方式
            </Text>
          </View>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600
          }}>
            选择您偏好的支付方式完成订单
          </Text>
        </View>
      )}

      <View style={{
        padding: showTitle ? theme.spacing.lg : theme.spacing.md
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.md
        }}>
          {methods.map(method => (
            <View 
              key={method.id}
              style={{
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                backgroundColor: selectedMethod === method.id ? `${getMethodColor(method.id)}10` : theme.colors.gray50,
                border: `2px solid ${selectedMethod === method.id ? getMethodColor(method.id) : 'transparent'}`,
                cursor: method.available ? 'pointer' : 'not-allowed',
                opacity: method.available ? 1 : 0.6
              }}
              onClick={() => method.available && onSelect(method.id)}
            >
              <View style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.sm
              }}>
                <View style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: theme.borderRadius.sm,
                    backgroundColor: getMethodColor(method.id),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon name={getMethodIcon(method.id) as any} size="md" color="white" />
                  </View>
                  <View>
                    <Text style={{
                      fontSize: theme.typography.fontSize.md,
                      fontWeight: theme.typography.fontWeight.bold,
                      color: method.available ? theme.colors.gray900 : theme.colors.gray400
                    }}>
                      {method.name}
                    </Text>
                    <Text style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: method.available ? theme.colors.gray600 : theme.colors.gray400
                    }}>
                      {method.description}
                    </Text>
                  </View>
                </View>
                
                {selectedMethod === method.id && (
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: getMethodColor(method.id),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon name="check" size="xs" color="white" />
                  </View>
                )}
              </View>

              {(method.fee !== undefined || method.processingTime) && (
                <View style={{
                  display: 'flex',
                  gap: theme.spacing.md,
                  marginTop: theme.spacing.sm,
                  paddingTop: theme.spacing.sm,
                  borderTop: `1px solid ${theme.colors.gray200}`
                }}>
                  {method.fee !== undefined && (
                    <View style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.xs
                    }}>
                      <Icon name="info" size="xs" color={theme.colors.gray500} />
                      <Text style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.gray600
                      }}>
                        手续费: ¥{method.fee.toFixed(2)}
                      </Text>
                    </View>
                  )}
                  {method.processingTime && (
                    <View style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.xs
                    }}>
                      <Icon name="clock" size="xs" color={theme.colors.gray500} />
                      <Text style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.gray600
                      }}>
                        处理时间: {method.processingTime}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {!method.available && (
                <View style={{
                  marginTop: theme.spacing.sm,
                  padding: theme.spacing.xs,
                  backgroundColor: theme.colors.gray100,
                  borderRadius: theme.borderRadius.sm
                }}>
                  <Text style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.gray600,
                    textAlign: 'center'
                  }}>
                    该支付方式暂不可用
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{
          marginTop: theme.spacing.lg,
          padding: theme.spacing.md,
          backgroundColor: theme.colors.gray50,
          borderRadius: theme.borderRadius.md
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray700,
            lineHeight: 1.5
          }}>
            • 模拟支付仅用于演示，不会产生实际交易{'\n'}
            • 微信支付和支付宝需要配置商户号才能使用{'\n'}
            • 支付完成后订单将立即进入处理状态
          </Text>
        </View>
      </View>
    </View>
  )
}

export default PaymentMethodSelector