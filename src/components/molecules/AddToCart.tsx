import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../hooks';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import { theme } from '../../styles/theme';

interface AddToCartProps {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  showIcon?: boolean;
  showSuccessMessage?: boolean;
  disabled?: boolean;
}

const AddToCart: React.FC<AddToCartProps> = ({
  product,
  selectedVariant,
  quantity,
  onSuccess,
  onError,
  size = 'large',
  fullWidth = true,
  showIcon = true,
  showSuccessMessage = true,
  disabled = false,
}) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || isAdding) return;

    try {
      setIsAdding(true);

      // 验证库存
      const stock = selectedVariant?.stock || product.stock;
      if (stock <= 0) {
        throw new Error('商品已售罄');
      }

      if (quantity > stock) {
        throw new Error(`库存不足，仅剩 ${stock} 件`);
      }

      // 创建购物车商品
      const cartItem = {
        id: `${product.id}-${selectedVariant?.id || 'default'}`,
        productId: product.id,
        variantId: selectedVariant?.id,
        name: product.name,
        price: selectedVariant?.price || product.price,
        quantity,
        image: product.images[0] || '',
        stock,
        attributes: selectedVariant?.attributes,
      };

      // 添加到购物车
      addItem(cartItem);

      // 显示成功消息
      if (showSuccessMessage) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }

      // 回调成功
      onSuccess?.();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '添加到购物车失败';
      console.error('Add to cart error:', error);
      
      // 回调错误
      onError?.(errorMessage);
      
    } finally {
      setIsAdding(false);
    }
  };

  // 计算显示价格
  const displayPrice = selectedVariant?.price || product.price;
  const displayStock = selectedVariant?.stock || product.stock;
  const isOutOfStock = displayStock <= 0;
  const isQuantityExceedStock = quantity > displayStock;
  const isDisabled = disabled || isOutOfStock || isQuantityExceedStock || isAdding;

  // 获取按钮文本
  const getButtonText = () => {
    if (isOutOfStock) return '已售罄';
    if (isQuantityExceedStock) return '库存不足';
    if (isAdding) return '添加中...';
    return '加入购物车';
  };

  // 获取按钮变体
  const getButtonVariant = () => {
    if (isOutOfStock || isQuantityExceedStock) return 'ghost';
    return 'primary';
  };

  return (
    <View style={{
      width: fullWidth ? '100%' : 'auto',
    }}>
      {/* 成功消息 */}
      {showSuccess && (
        <View style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: theme.colors.success,
          color: theme.colors.white,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          borderRadius: theme.borderRadius.md,
          boxShadow: theme.shadows.lg,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          animation: 'fadeInOut 3s ease',
        }}>
          <Icon name="check" size="sm" color={theme.colors.white} />
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
          }}>
            已成功添加到购物车！
          </Text>
        </View>
      )}

      {/* 价格和库存信息 */}
      <View style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.gray50,
        borderRadius: theme.borderRadius.md,
      }}>
        <View>
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600,
            marginBottom: '2px',
          }}>
            小计
          </Text>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary,
          }}>
            ¥{(displayPrice * quantity).toFixed(2)}
          </Text>
        </View>

        <View style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
        }}>
          {isOutOfStock ? (
            <Icon name="close" size="sm" color={theme.colors.danger} />
          ) : (
            <Icon name="check" size="sm" color={theme.colors.success} />
          )}
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: isOutOfStock ? theme.colors.danger : theme.colors.success,
            fontWeight: theme.typography.fontWeight.medium,
          }}>
            {isOutOfStock ? '缺货' : `库存 ${displayStock} 件`}
          </Text>
        </View>
      </View>

      {/* 错误提示 */}
      {isQuantityExceedStock && !isOutOfStock && (
        <View style={{
          padding: theme.spacing.sm,
          backgroundColor: theme.colors.warning + '20',
          borderRadius: theme.borderRadius.sm,
          border: `1px solid ${theme.colors.warning}`,
          marginBottom: theme.spacing.md,
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.warning,
            textAlign: 'center',
          }}>
            库存仅剩 {displayStock} 件，请调整数量
          </Text>
        </View>
      )}

      {/* 加入购物车按钮 */}
      <Button
        onPress={handleAddToCart}
        disabled={isDisabled}
        size={size}
        variant={getButtonVariant()}
        fullWidth={fullWidth}
        loading={isAdding}
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {showIcon && !isAdding && (
          <View style={{
            position: 'absolute',
            left: theme.spacing.md,
            top: '50%',
            transform: 'translateY(-50%)',
          }}>
            <Icon 
              name="cart" 
              size={size === 'small' ? 'xs' : size === 'large' ? 'md' : 'sm'} 
              color={isOutOfStock || isQuantityExceedStock ? theme.colors.gray600 : theme.colors.white}
            />
          </View>
        )}
        
        <Text style={{
          fontSize: size === 'small' ? theme.typography.fontSize.sm : 
                   size === 'large' ? theme.typography.fontSize.lg : 
                   theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.medium,
          marginLeft: showIcon && !isAdding ? '24px' : 0,
        }}>
          {getButtonText()}
        </Text>
      </Button>

      {/* 购物车统计 */}
      <View style={{
        marginTop: theme.spacing.sm,
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.gray50,
        borderRadius: theme.borderRadius.md,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.gray600,
        }}>
          购物车统计
        </Text>
        <View style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
        }}>
          <Icon name="cart" size="xs" color={theme.colors.primary} />
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.primary,
            fontWeight: theme.typography.fontWeight.medium,
          }}>
            {quantity} 件商品 · ¥{(displayPrice * quantity).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* 购物提示 */}
      <View style={{
        marginTop: theme.spacing.md,
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.gray50,
        borderRadius: theme.borderRadius.md,
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.gray600,
          lineHeight: '1.4',
        }}>
          {isOutOfStock 
            ? '该商品暂时缺货，您可以关注商品或选择其他规格'
            : '加入购物车后，您可以在购物车页面查看和修改商品'
          }
        </Text>
      </View>
    </View>
  );
};

export default AddToCart;