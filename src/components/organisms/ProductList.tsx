import React, { memo, useMemo } from 'react';
import { View } from '@tarojs/components';
import { Product } from '../../types';
import ProductCard from '../molecules/ProductCard';
import EmptyState from '../molecules/EmptyState';
import { theme } from '../../styles/theme';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onAddToCart?: (product: Product) => void;
  layout?: 'grid' | 'list';
  columns?: number;
  emptyMessage?: string;
}

const ProductListComponent: React.FC<ProductListProps> = ({
  products,
  loading = false,
  error = null,
  onAddToCart,
  layout = 'grid',
  columns = 2,
  emptyMessage = '暂无商品',
}) => {
  if (loading && products.length === 0) {
    return <EmptyState type='loading' />;
  }

  if (error) {
    return (
      <EmptyState
        type='error'
        title='加载失败'
        description={error}
        actionText='重试'
        onAction={() => window.location.reload()}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        type='no-products'
        title={emptyMessage}
        description='请尝试其他分类或搜索关键词'
      />
    );
  }

  if (layout === 'list') {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
        {products.map(product => (
          <View key={product.id} style={{ marginBottom: theme.spacing.md }}>
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              compact
            />
          </View>
        ))}
      </View>
    );
  }

  // Grid layout
  const gridTemplateColumns = useMemo(() => `repeat(${columns}, 1fr)`, [columns]);

  // Memoize grid style to prevent unnecessary re-renders
  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns,
    gap: theme.spacing.md,
    padding: theme.spacing.md
  }), [gridTemplateColumns]);

  // Memoize list style
  const listStyle = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md
  }), [theme.spacing.md]);

  // Render product cards with memoization
  const renderProductCards = useMemo(() => {
    if (layout === 'list') {
      return products.map(product => (
        <View key={product.id} style={{ marginBottom: theme.spacing.md }}>
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            compact
          />
        </View>
      ));
    }

    // Grid layout
    return products.map(product => (
      <View key={product.id}>
        <ProductCard
          product={product}
          onAddToCart={onAddToCart}
          compact={columns > 2}
        />
      </View>
    ));
  }, [products, onAddToCart, layout, columns, theme.spacing.md]);

  if (layout === 'list') {
    return (
      <View style={listStyle}>
        {renderProductCards}
      </View>
    );
  }

  return (
    <View style={gridStyle}>
      {renderProductCards}
    </View>
  );
};

// Custom comparison function for React.memo
const arePropsEqual = (prevProps: ProductListProps, nextProps: ProductListProps) => {
  // Compare products array length and references
  if (prevProps.products.length !== nextProps.products.length) return false;
  if (prevProps.products !== nextProps.products) return false;

  // Compare other primitive props
  if (prevProps.loading !== nextProps.loading) return false;
  if (prevProps.error !== nextProps.error) return false;
  if (prevProps.layout !== nextProps.layout) return false;
  if (prevProps.columns !== nextProps.columns) return false;
  if (prevProps.emptyMessage !== nextProps.emptyMessage) return false;

  // Compare callback function reference
  if (prevProps.onAddToCart !== nextProps.onAddToCart) return false;

  return true;
};

// Memoize the component to prevent unnecessary re-renders
const ProductList = memo(ProductListComponent, arePropsEqual);

export default ProductList;
