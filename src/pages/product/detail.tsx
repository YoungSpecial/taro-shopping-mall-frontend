import { View, Text, ScrollView } from '@tarojs/components'
import {useLoad, useRouter, navigateBack, navigateTo} from '@tarojs/taro'
import {useCallback, useState} from 'react'
import { useProduct, useCart } from '../../hooks'
import Icon from '../../components/atoms/Icon'
import Button from '../../components/atoms/Button'
import ProductDescription from '../../components/molecules/ProductDescription'
import RelatedProducts from '../../components/molecules/RelatedProducts'
import CartSummary from '../../components/molecules/CartSummary'
import { theme } from '../../styles/theme'
import './detail.css'

export default function ProductDetail() {
  const router = useRouter()
  const { productId } = router.params
  const { product, loading, error, refresh } = useProduct(productId || '')
  const { addItem } = useCart()

  const [selectedVariant, setSelectedVariant] = useState<string>('default')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  useLoad(() => {
    console.log('Product detail page loaded.', { productId })
  })

  const handleAddToCart = () => {
    if (!product) return

    const cartItem = {
      id: `${product.id}-${selectedVariant}`,
      productId: product.id,
      variantId: selectedVariant !== 'default' ? selectedVariant : undefined,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[selectedImageIndex] || product.images[0],
      stock: product.stock,
      attributes: product.variants?.find(v => v.id === selectedVariant)?.attributes
    }

    addItem(cartItem)

    // 显示添加成功提示
    // 在实际应用中，这里可以显示Toast或Modal
    console.log('Added to cart:', cartItem)
  }

  const handleBuyNow = () => {
    if (!product) return

    navigateTo({
      url: `/pages/order/single-checkout?productId=${product.id}&quantity=${quantity}`,
    });
  }

  const handleQuantityIncrease = () => {
    if (product) {
      // 检查库存限制
      const maxAllowed = Math.min(displayStock, 10) // 每人限购10件，且不能超过库存
      if (quantity < maxAllowed) {
        setQuantity(quantity + 1)
      }
    }
  }

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId)
    // 重置数量为1当选择新变体时
    setQuantity(1)
  }

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handleToggleDescription = () => {
    setDescriptionExpanded(!descriptionExpanded)
  }

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.colors.white
      }}>
        <Text style={{ color: theme.colors.gray600 }}>加载中...</Text>
      </View>
    )
  }

  if (error || !product) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.colors.white,
        padding: theme.spacing.xl
      }}>
        <Icon name="error" size="xl" color={theme.colors.danger} />
        <Text style={{
          marginTop: theme.spacing.md,
          color: theme.colors.gray800,
          fontSize: theme.typography.fontSize.md
        }}>
          {error || '产品不存在'}
        </Text>
        <Button
          style={{ marginTop: theme.spacing.lg }}
          onPress={refresh}
          variant="outline"
        >
          重试
        </Button>
      </View>
    )
  }

  const selectedVariantData = product.variants?.find(v => v.id === selectedVariant)
  const displayPrice = selectedVariantData?.price || product.price
  const displayStock = selectedVariantData?.stock || product.stock
  const isOutOfStock = displayStock <= 0
  const isLowStock = displayStock > 0 && displayStock <= 10
  const isMediumStock = displayStock > 10 && displayStock <= 50

  return (
    <ScrollView
      style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.white
      }}
      scrollY
    >
      {/* 产品图片区域 */}
      <View style={{
        position: 'relative',
        height: '400px',
        backgroundColor: theme.colors.gray100
      }}>
        {/* 主图显示 */}
        <View style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {product.images.length > 0 ? (
            <View style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${product.images[selectedImageIndex]})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }} />
          ) : (
            <Icon name="info" size="xl" color={theme.colors.gray400} />
          )}
        </View>

        {/* 图片指示器 */}
        {product.images.length > 1 && (
          <View style={{
            position: 'absolute',
            bottom: theme.spacing.md,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: theme.spacing.xs
          }}>
            {product.images.map((_, index) => (
              <View
                key={index}
                onClick={() => handleImageSelect(index)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: index === selectedImageIndex
                    ? theme.colors.primary
                    : theme.colors.gray300,
                  cursor: 'pointer'
                }}
              />
            ))}
          </View>
        )}

        {/* 返回按钮 */}
        <View
          onClick={() => {
            // 返回上一页
            navigateBack()
          }}
          style={{
            position: 'absolute',
            top: theme.spacing.md,
            left: theme.spacing.md,
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <Icon name="arrow-left" size="md" color={theme.colors.white} />
        </View>

        <View style={{
          position: 'absolute',
          top: theme.spacing.md,
          right: theme.spacing.md,
          zIndex: 10
        }}>
          <CartSummary compact={true} />
        </View>
      </View>

      {/* 产品基本信息 */}
      <View style={{
        padding: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.gray200}`
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.gray900,
          marginBottom: theme.spacing.xs
        }}>
          {product.name}
        </Text>

        <View style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing.md
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary,
            marginRight: theme.spacing.sm
          }}>
            ¥{displayPrice.toFixed(2)}
          </Text>
          {product.originalPrice && (
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray500,
              textDecoration: 'line-through'
            }}>
              ¥{product.originalPrice.toFixed(2)}
            </Text>
          )}
        </View>

        <View style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm
        }}>
          <View style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name="star"
                size="sm"
                color={i < Math.floor(product.rating) ? theme.colors.warning : theme.colors.gray300}
              />
            ))}
          </View>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600
          }}>
            {product.rating.toFixed(1)} ({product.reviewCount}条评价)
          </Text>
        </View>
      </View>

      {/* 产品规格/变体选择 */}
      {product.variants && product.variants.length > 0 && (
        <View style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.gray200}`
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            marginBottom: theme.spacing.md
          }}>
            选择规格
          </Text>

          <View style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: theme.spacing.sm
          }}>
            {product.variants.map(variant => {
              const isSelected = selectedVariant === variant.id
              const isAvailable = variant.stock > 0

              return (
                <View
                  key={variant.id}
                  onClick={() => isAvailable && handleVariantSelect(variant.id)}
                  style={{
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.gray100,
                    border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.gray300}`,
                    borderRadius: theme.borderRadius.md,
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    opacity: isAvailable ? 1 : 0.5
                  }}
                >
                  <Text style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: isSelected ? theme.colors.white : theme.colors.gray700,
                    fontWeight: isSelected ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal
                  }}>
                    {variant.name}
                  </Text>
                  {!isAvailable && (
                    <Text style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.danger,
                      marginTop: '2px'
                    }}>
                      缺货
                    </Text>
                  )}
                </View>
              )
            })}
          </View>
        </View>
      )}

      {/* 数量选择器 */}
      <View style={{
        padding: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.gray200}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.gray800
        }}>
          数量
        </Text>

        <View style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md
        }}>
          <View
            onClick={handleQuantityDecrease}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '16px',
              border: `1px solid ${theme.colors.gray300}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: quantity > 1 ? 'pointer' : 'not-allowed',
              opacity: quantity > 1 ? 1 : 0.5
            }}
          >
            <Icon name="minus" size="xs" color={theme.colors.gray700} />
          </View>

          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            minWidth: '40px',
            textAlign: 'center'
          }}>
            {quantity}
          </Text>

            <View
              onClick={handleQuantityIncrease}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '16px',
                border: `1px solid ${theme.colors.gray300}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: quantity < Math.min(displayStock, 10) ? 'pointer' : 'not-allowed',
                opacity: quantity < Math.min(displayStock, 10) ? 1 : 0.5
              }}
            >
            <Icon name="plus" size="xs" color={theme.colors.gray700} />
          </View>
        </View>
      </View>

      {/* 加个 */}
      <View style={{
        padding: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.gray200}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.gray800
        }}>
          金额
        </Text>

        <View style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            minWidth: '40px',
            textAlign: 'center'
          }}>
            {(product.price * quantity).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* 库存状态 */}
      <View style={{
        padding: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.gray200}`
      }}>
        <View style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.sm
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600
          }}>
            库存状态
          </Text>
          <View style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs
          }}>
            {isOutOfStock ? (
              <>
                <Icon name="error" size="xs" color={theme.colors.danger} />
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.danger,
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  缺货
                </Text>
              </>
            ) : isLowStock ? (
              <>
                <Icon name="warning" size="xs" color={theme.colors.warning} />
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.warning,
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  库存紧张
                </Text>
              </>
            ) : (
              <>
                <Icon name="check" size="xs" color={theme.colors.success} />
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.success,
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  有货
                </Text>
              </>
            )}
          </View>
        </View>

        {/* 库存数量显示 */}
        <View style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.sm
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600
          }}>
            剩余数量
          </Text>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: isOutOfStock ? theme.colors.danger :
                   isLowStock ? theme.colors.warning : theme.colors.success,
            fontWeight: theme.typography.fontWeight.medium
          }}>
            {isOutOfStock ? '0 件' : `${displayStock} 件`}
          </Text>
        </View>

        {/* 库存进度条 */}
        {!isOutOfStock && (
          <View>
            <View style={{
              height: '6px',
              backgroundColor: theme.colors.gray200,
              borderRadius: theme.borderRadius.sm,
              overflow: 'hidden',
              marginBottom: theme.spacing.xs
            }}>
              <View style={{
                width: `${Math.min(100, (displayStock / 100) * 100)}%`,
                height: '100%',
                backgroundColor: isLowStock ? theme.colors.warning :
                               isMediumStock ? theme.colors.success : theme.colors.primary
              }} />
            </View>
            <View style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.gray500
              }}>
                {isLowStock ? '库存紧张，建议尽快购买' :
                 isMediumStock ? '库存充足' :
                 '库存充裕'}
              </Text>
              {isLowStock && (
                <Text style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.warning,
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  仅剩 {displayStock} 件
                </Text>
              )}
            </View>
          </View>
        )}

        {/* 库存限制说明 */}
        <View style={{
          marginTop: theme.spacing.md,
          padding: theme.spacing.sm,
          backgroundColor: theme.colors.gray50,
          borderRadius: theme.borderRadius.sm
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.gray600,
            lineHeight: '1.4'
          }}>
            {isOutOfStock ? '该商品暂时缺货，到货后会及时通知您。' :
             isLowStock ? `库存紧张，每人限购10件，建议尽快下单。当前最多可购买${Math.min(displayStock, 10)}件。` :
             `库存充足，每人限购10件。当前最多可购买${Math.min(displayStock, 10)}件。`}
          </Text>
        </View>
      </View>

      {/* 直接购买 */}
      <View style={{
        padding: theme.spacing.lg,
        position: 'sticky',
        bottom: 0,
        backgroundColor: theme.colors.white,
        borderTop: `1px solid ${theme.colors.gray200}`,
        zIndex: 100
      }}>
        <Button
          onPress={handleBuyNow}
          disabled={isOutOfStock}
          fullWidth
          size="large"
        >
          {isOutOfStock ? '已售罄' : '购买'}
        </Button>
      </View>

      {/* 加入购物车按钮 */}
      <View style={{
        padding: theme.spacing.lg,
        position: 'sticky',
        bottom: 0,
        backgroundColor: theme.colors.white,
        borderTop: `1px solid ${theme.colors.gray200}`,
        zIndex: 100
      }}>
        <Button
          onPress={handleAddToCart}
          disabled={isOutOfStock}
          fullWidth
          size="large"
        >
          {isOutOfStock ? '已售罄' : '加入购物车'}
        </Button>
      </View>

      {/* 产品描述和规格 */}
      <ProductDescription
        product={product}
        showDescription={true}
        showSpecifications={true}
        expanded={descriptionExpanded}
        onToggleExpand={handleToggleDescription}
      />

      {/* 相关商品推荐 */}
      {product && (
        <RelatedProducts
          currentProduct={product}
          maxProducts={4}
          showHeader={true}
          title="相关推荐"
        />
      )}
    </ScrollView>
  )
}
