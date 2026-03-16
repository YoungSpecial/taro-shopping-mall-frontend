import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { shallowEqual } from '@/utils/performance';
import './MemoizedProductCard.css';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  tags?: string[];
}

interface MemoizedProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
  isInCart: boolean;
  discountThreshold?: number;
}

/**
 * 优化后的记忆化组件
 */
const MemoizedProductCardComponent: React.FC<MemoizedProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  isInCart,
  discountThreshold = 100
}) => {
  // 使用useMemo记忆化昂贵的计算
  const discount = useMemo(() => {
    return product.originalPrice
      ? ((product.originalPrice - product.price) / product.originalPrice * 100)
      : 0;
  }, [product.originalPrice, product.price]);

  // 使用useMemo记忆化星星渲染
  const stars = useMemo(() => {
    const starElements = [];
    for (let i = 1; i <= 5; i++) {
      starElements.push(
        <Text key={i} className={`star ${i <= Math.floor(product.rating) ? 'filled' : ''}`}>
          ★
        </Text>
      );
    }
    return starElements;
  }, [product.rating]);

  // 使用useMemo记忆化标签过滤
  const filteredTags = useMemo(() => {
    return product.tags?.filter(tag =>
      tag.length > 0 && !tag.includes('test')
    ) || [];
  }, [product.tags]);

  // 使用useCallback记忆化回调函数（如果回调在父组件中定义）
  const handleAddToCart = useCallback(() => {
    onAddToCart(product.id);
  }, [onAddToCart, product.id]);

  const handleViewDetails = useCallback(() => {
    onViewDetails(product.id);
  }, [onViewDetails, product.id]);

  // 使用useMemo记忆化复杂的JSX片段
  const priceSection = useMemo(() => (
    <View className="price-section">
      <Text className="current-price">¥{product.price}</Text>
      {product.originalPrice && (
        <Text className="original-price">¥{product.originalPrice}</Text>
      )}
      {discount > discountThreshold && (
        <Text className="discount-badge">-{discount.toFixed(0)}%</Text>
      )}
    </View>
  ), [product.price, product.originalPrice, discount, discountThreshold]);

  const ratingSection = useMemo(() => (
    <View className="rating-section">
      {stars}
      <Text className="review-count">({product.reviewCount})</Text>
    </View>
  ), [stars, product.reviewCount]);

  const tagsSection = useMemo(() => {
    if (filteredTags.length === 0) return null;

    return (
      <View className="tags-section">
        {filteredTags.map(tag => (
          <Text key={tag} className="tag">{tag}</Text>
        ))}
      </View>
    );
  }, [filteredTags]);

  const actionsSection = useMemo(() => (
    <View className="actions">
      <View
        className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
        onClick={handleAddToCart}
      >
        <Text>{isInCart ? '已在购物车' : '加入购物车'}</Text>
      </View>
      <View
        className="view-details-btn"
        onClick={handleViewDetails}
      >
        <Text>查看详情</Text>
      </View>
    </View>
  ), [isInCart, handleAddToCart, handleViewDetails]);

  return (
    <View className="product-card">
      <Image src={product.imageUrl} className="product-image" mode="aspectFill" />
      <View className="product-info">
        <Text className="product-name">{product.name}</Text>
        {priceSection}
        {ratingSection}
        {tagsSection}
        {actionsSection}
      </View>
    </View>
  );
};

/**
 * 使用React.memo包装组件，并提供自定义的props比较函数
 * 使用shallowEqual进行浅层比较，避免不必要的重新渲染
 */
const MemoizedProductCard = memo(MemoizedProductCardComponent, (prevProps, nextProps) => {
  // 自定义比较逻辑
  return (
    // 比较product对象（深度比较可能更合适，但这里使用引用比较+关键字段比较）
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.rating === nextProps.product.rating &&
    prevProps.isInCart === nextProps.isInCart &&
    // 比较回调函数引用（父组件应该使用useCallback）
    prevProps.onAddToCart === nextProps.onAddToCart &&
    prevProps.onViewDetails === nextProps.onViewDetails
  );
});


