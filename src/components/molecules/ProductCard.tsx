import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { Product } from '../../types';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import { theme } from '../../styles/theme';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  compact?: boolean;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  compact = false
}) => {
  // 使用useCallback记忆化事件处理函数
  const handleCardClick = useCallback((e) => {
    navigateTo({
      url: `/pages/product/detail?productId=${product.id}`,
    });
  }, [product.id]);

  const handleAddToCart = useCallback((e: any) => {
    // e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  }, [onAddToCart, product]);

  // 使用useMemo记忆化评分组件
  const ratingComponent = useMemo(() => {
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;

    return (
      <View style={{ display: 'flex', alignItems: 'center', marginTop: theme.spacing.xs }}>
        <View style={{ display: 'flex' }}>
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) {
              return <Icon key={i} name='star-filled' size='sm' color={theme.colors.warning} />;
            } else if (i === fullStars && hasHalfStar) {
              return <Icon key={i} name='star' size='sm' color={theme.colors.warning} />;
            } else {
              return <Icon key={i} name='star' size='sm' color={theme.colors.gray300} />;
            }
          })}
        </View>
        <Text style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.gray600,
          marginLeft: theme.spacing.xs
        }}
        >
          {product.rating.toFixed(1)} ({product.reviewCount})
        </Text>
      </View>
    );
  }, [product.rating, product.reviewCount]);

  // 使用useMemo记忆化价格组件
  const priceComponent = useMemo(() => {
    return (
      <View style={{ marginTop: theme.spacing.sm }}>
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary
          }}
          >
            ¥{product.price.toFixed(2)}
          </Text>
          {product.originalPrice && (
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray500,
              textDecoration: 'line-through',
              marginLeft: theme.spacing.xs
            }}
            >
              ¥{product.originalPrice.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    );
  }, [product.price, product.originalPrice]);

  // 使用useMemo记忆化库存状态组件
  const stockStatusComponent = useMemo(() => {
    if (product.stock === 0) {
      return (
        <Text style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.danger,
          marginTop: theme.spacing.xs
        }}
        >
          已售罄
        </Text>
      );
    } else if (product.stock < 10) {
      return (
        <Text style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.warning,
          marginTop: theme.spacing.xs
        }}
        >
          仅剩{product.stock}件
        </Text>
      );
    }
    return null;
  }, [product.stock]);

  if (compact) {
    return (
      <Card
        padding='small'
        shadow='sm'
        hoverable
        style={{ height: '100%', cursor: 'pointer' }}
      >
        <View style={{ display: 'flex', flexDirection: 'column', height: '100%' }} onClick={() => handleCardClick()}>
          <Image
            src={product.imageUrl || ''}
            mode='aspectFill'
            style={{
              width: '100%',
              height: '120px',
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.sm,
            }}
          />
          <Text
            style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray800,
              lineHeight: 1.4,
              flex: 1,
            }}
            numberOfLines={2}
          >
            {product.name}
           </Text>
           {ratingComponent}
           {priceComponent}
           {stockStatusComponent}
         </View>
      </Card>
    );
  }

  return (
    <Card
      padding='medium'
      shadow='sm'
      hoverable
      style={{ height: '100%', cursor: 'pointer' }}
    >
      <View style={{ display: 'flex', flexDirection: 'column', height: '100%' }} >
        <Image
          src={product.images[0]}
          mode='aspectFill'
          style={{
            width: '100%',
            height: '180px',
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing.md,
          }}
        />

        <View style={{ flex: 1 }} onClick={(e) => { handleCardClick(e); }}>
          <Text
            style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.gray800,
              lineHeight: 1.4,
              marginBottom: theme.spacing.xs,
            }}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <Text
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray600,
              lineHeight: 1.5,
              marginBottom: theme.spacing.sm,
            }}
            numberOfLines={2}
          >
            {product.description}
           </Text>

           {ratingComponent}
           {priceComponent}
           {stockStatusComponent}
         </View>

        <View style={{ marginTop: theme.spacing.md }}>
          <Button
            variant='primary'
            size='small'
            fullWidth
            disabled={product.stock === 0}
            onPress={() => handleAddToCart({} as any)}
          >
            {product.stock === 0 ? '已售罄' : '加入购物车'}
          </Button>
        </View>
      </View>
    </Card>
  );
};

// Custom comparison function for React.memo
const arePropsEqual = (prevProps: ProductCardProps, nextProps: ProductCardProps) => {
  // Compare product object reference (assume product is immutable)
  if (prevProps.product !== nextProps.product) return false;

  // Compare callback function reference
  if (prevProps.onAddToCart !== nextProps.onAddToCart) return false;

  // Compare compact flag
  if (prevProps.compact !== nextProps.compact) return false;

  return true;
};

// Memoize the component to prevent unnecessary re-renders
const ProductCard = memo(ProductCardComponent, arePropsEqual);

export default ProductCard;
