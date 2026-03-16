import React from 'react'
import { View, Text } from '@tarojs/components'
import { ShippingAddress } from '../../types'
import Icon from '../atoms/Icon'
import { theme } from '../../styles/theme'

interface ShippingAddressFormProps {
  address: ShippingAddress
  onChange: (field: keyof ShippingAddress, value: string) => void
  errors?: Record<string, string>
  showTitle?: boolean
  compact?: boolean
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  address,
  onChange,
  errors = {},
  showTitle = true,
  compact = false
}) => {
  const handleChange = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field, e.target.value)
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
            <Icon name="home" size="md" color={theme.colors.primary} />
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.gray900
            }}>
              收货地址
            </Text>
          </View>
        )}

        <View style={{ marginBottom: theme.spacing.sm }}>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray700,
            marginBottom: theme.spacing.xs
          }}>
            收货人
          </Text>
          <input
            type="text"
            placeholder="请输入收货人姓名"
            value={address.name}
            onChange={handleChange('name')}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.name ? theme.colors.danger : theme.colors.gray300}`,
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray800,
              backgroundColor: theme.colors.white
            }}
          />
          {errors.name && (
            <Text style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.danger,
              marginTop: '4px'
            }}>
              {errors.name}
            </Text>
          )}
        </View>

        <View style={{ marginBottom: theme.spacing.sm }}>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray700,
            marginBottom: theme.spacing.xs
          }}>
            手机号码
          </Text>
          <input
            type="tel"
            placeholder="请输入手机号码"
            value={address.phone}
            onChange={handleChange('phone')}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.phone ? theme.colors.danger : theme.colors.gray300}`,
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray800,
              backgroundColor: theme.colors.white
            }}
          />
          {errors.phone && (
            <Text style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.danger,
              marginTop: '4px'
            }}>
              {errors.phone}
            </Text>
          )}
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
          <Icon name="home" size="md" color={theme.colors.primary} />
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.gray900
          }}>
            收货地址
          </Text>
        </View>
      )}

      <View style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md
      }}>
        <View style={{
          display: 'flex',
          gap: theme.spacing.md
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginBottom: theme.spacing.xs
            }}>
              收货人
            </Text>
            <input
              type="text"
              placeholder="请输入收货人姓名"
              value={address.name}
              onChange={handleChange('name')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.name ? theme.colors.danger : theme.colors.gray300}`,
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray800,
                backgroundColor: theme.colors.white
              }}
            />
            {errors.name && (
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.danger,
                marginTop: '4px'
              }}>
                {errors.name}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginBottom: theme.spacing.xs
            }}>
              手机号码
            </Text>
            <input
              type="tel"
              placeholder="请输入手机号码"
              value={address.phone}
              onChange={handleChange('phone')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.phone ? theme.colors.danger : theme.colors.gray300}`,
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray800,
                backgroundColor: theme.colors.white
              }}
            />
            {errors.phone && (
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.danger,
                marginTop: '4px'
              }}>
                {errors.phone}
              </Text>
            )}
          </View>
        </View>

        <View style={{
          display: 'flex',
          gap: theme.spacing.md
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginBottom: theme.spacing.xs
            }}>
              省份
            </Text>
            <input
              type="text"
              placeholder="请输入省份"
              value={address.province}
              onChange={handleChange('province')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.province ? theme.colors.danger : theme.colors.gray300}`,
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray800,
                backgroundColor: theme.colors.white
              }}
            />
            {errors.province && (
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.danger,
                marginTop: '4px'
              }}>
                {errors.province}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginBottom: theme.spacing.xs
            }}>
              城市
            </Text>
            <input
              type="text"
              placeholder="请输入城市"
              value={address.city}
              onChange={handleChange('city')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.city ? theme.colors.danger : theme.colors.gray300}`,
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray800,
                backgroundColor: theme.colors.white
              }}
            />
            {errors.city && (
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.danger,
                marginTop: '4px'
              }}>
                {errors.city}
              </Text>
            )}
          </View>
        </View>

        <View style={{
          display: 'flex',
          gap: theme.spacing.md
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginBottom: theme.spacing.xs
            }}>
              区县
            </Text>
            <input
              type="text"
              placeholder="请输入区县"
              value={address.district}
              onChange={handleChange('district')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.district ? theme.colors.danger : theme.colors.gray300}`,
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray800,
                backgroundColor: theme.colors.white
              }}
            />
            {errors.district && (
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.danger,
                marginTop: '4px'
              }}>
                {errors.district}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginBottom: theme.spacing.xs
            }}>
              邮政编码
            </Text>
            <input
              type="text"
              placeholder="请输入邮政编码"
              value={address.postalCode}
              onChange={handleChange('postalCode')}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.postalCode ? theme.colors.danger : theme.colors.gray300}`,
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray800,
                backgroundColor: theme.colors.white
              }}
            />
            {errors.postalCode && (
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.danger,
                marginTop: '4px'
              }}>
                {errors.postalCode}
              </Text>
            )}
          </View>
        </View>

        <View>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray700,
            marginBottom: theme.spacing.xs
          }}>
            详细地址
          </Text>
          <input
            type="text"
            placeholder="请输入详细地址（街道、门牌号等）"
            value={address.address}
            onChange={handleChange('address')}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${errors.address ? theme.colors.danger : theme.colors.gray300}`,
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray800,
              backgroundColor: theme.colors.white
            }}
          />
          {errors.address && (
            <Text style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.danger,
              marginTop: '4px'
            }}>
              {errors.address}
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default ShippingAddressForm