import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { Product } from '../../types';
import { ApiService } from '../../services/api';
import ProductCard from './ProductCard';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import { theme } from '../../styles/theme';
import { ProductCardSkeleton, LoadingSpinner } from '../loading';

interface RelatedProductsProps {
  currentProduct: Product;
  maxProducts?: number;
  showHeader?: boolean;
  title?: string;
  onAddToCart?: (product: Product) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProduct,
  maxProducts = 4,
  showHeader = true,
  title = '相关推荐',
  onAddToCart
}) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadRelatedProducts();
  }, [currentProduct]);

  const loadRelatedProducts = async () => {
    try {
      setLoading(true);
      
      // 获取所有产品
      const result = await ApiService.getProducts();
      const products = result.products;
      setAllProducts(products);
      
      // 过滤相关产品：同类别且不是当前产品
      const related = products
        .filter(product => 
          product.id !== currentProduct.id && 
          product.category === currentProduct.category
        )
        .slice(0, maxProducts);
      
      // 如果同类别产品不足，添加其他类别的热门产品
      if (related.length < maxProducts) {
        const remainingCount = maxProducts - related.length;
        const otherProducts = products
          .filter(product => 
            product.id !== currentProduct.id && 
            product.category !== currentProduct.category &&
            !related.some(r => r.id === product.id)
          )
          .sort((a, b) => b.rating - a.rating) // 按评分排序
          .slice(0, remainingCount);
        
        related.push(...otherProducts);
      }
      
      setRelatedProducts(related);
      setError(null);
    } catch (err) {
      setError('加载相关产品失败，请稍后重试');
      console.error('Failed to load related products:', err);
    } finally {
      setLoading(false);
    }
  };



  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const getRecommendationReason = (product: Product) => {
    if (product.category === currentProduct.category) {
      return '同类别商品';
    }
    
    // 检查是否有共同属性
    if (currentProduct.attributes && product.attributes) {
      const commonAttributes = Object.keys(currentProduct.attributes).filter(
        key => product.attributes![key] === currentProduct.attributes![key]
      );
      
      if (commonAttributes.length > 0) {
        return '相似属性';
      }
    }
    
    return '热门推荐';
  };

  if (loading) {
    return (
      <View style={{
        backgroundColor: theme.colors.white
      }}>
        {showHeader && (
          <View style={{
            padding: theme.spacing.lg,
            borderBottom: `1px solid ${theme.colors.gray200}`
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray800
            }}>
              {title}
            </Text>
            <Text style={{
              marginTop: theme.spacing.xs,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray600
            }}>
              根据您的浏览为您推荐
            </Text>
          </View>
        )}
        
        <ScrollView
          style={{
            padding: theme.spacing.lg,
            paddingTop: showHeader ? 0 : theme.spacing.lg
          }}
          scrollX
        >
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: theme.spacing.md
          }}>
            <ProductCardSkeleton count={maxProducts} compact={true} />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.white
      }}>
        {showHeader && (
          <Text style={{
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            marginBottom: theme.spacing.md
          }}>
            {title}
          </Text>
        )}
        <View style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing.xl
        }}>
          <Icon name="error" size="md" color={theme.colors.danger} />
          <Text style={{
            marginTop: theme.spacing.sm,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600,
            textAlign: 'center'
          }}>
            {error}
          </Text>
          <Button
            style={{ marginTop: theme.spacing.md }}
            onPress={loadRelatedProducts}
            variant="outline"
            size="small"
          >
            重试
          </Button>
        </View>
      </View>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <View style={{
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.white
      }}>
        {showHeader && (
          <Text style={{
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            marginBottom: theme.spacing.md
          }}>
            {title}
          </Text>
        )}
        <View style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing.xl
        }}>
          <Icon name="info" size="xl" color={theme.colors.gray400} />
          <Text style={{
            marginTop: theme.spacing.md,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600,
            textAlign: 'center'
          }}>
            暂无相关推荐
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{
      backgroundColor: theme.colors.white
    }}>
      {showHeader && (
        <View style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.gray200}`
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800
          }}>
            {title}
          </Text>
          <Text style={{
            marginTop: theme.spacing.xs,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600
          }}>
            根据您的浏览为您推荐
          </Text>
        </View>
      )}

      <ScrollView
        style={{
          padding: theme.spacing.lg,
          paddingTop: showHeader ? 0 : theme.spacing.lg
        }}
        scrollX
      >
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing.md
        }}>
          {relatedProducts.map((product) => (
            <View
              key={product.id}
              style={{
                width: '160px',
                flexShrink: 0
              }}
            >
              <ProductCard
                product={product}
                compact={true}
                onAddToCart={handleAddToCart}
              />
              
              {/* 推荐理由 */}
              <View style={{
                marginTop: theme.spacing.xs,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                backgroundColor: theme.colors.gray50,
                borderRadius: theme.borderRadius.sm
              }}>
                <Text style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.gray600,
                  textAlign: 'center'
                }}>
                  {getRecommendationReason(product)}
                </Text>
              </View>
              
              {/* 价格对比（如果有折扣） */}
              {product.originalPrice && product.originalPrice > product.price && (
                <View style={{
                  marginTop: theme.spacing.xs,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.xs
                }}>
                  <Text style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.primary
                  }}>
                    ¥{product.price.toFixed(2)}
                  </Text>
                  <Text style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.gray500,
                    textDecoration: 'line-through'
                  }}>
                    ¥{product.originalPrice.toFixed(2)}
                  </Text>
                  <View style={{
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    backgroundColor: theme.colors.danger,
                    borderRadius: theme.borderRadius.sm
                  }}>
                    <Text style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.white,
                      fontWeight: theme.typography.fontWeight.medium
                    }}>
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 查看更多按钮 */}
      {allProducts.length > maxProducts && (
        <View style={{
          padding: theme.spacing.lg,
          paddingTop: 0,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button
            onPress={() => {
              // 跳转到产品列表页，筛选当前类别
              navigateTo({
                url: `/pages/index/index?category=${currentProduct.category}`,
              });
            }}
            variant="outline"
            size="small"
          >
            查看更多{currentProduct.category}商品
          </Button>
        </View>
      )}
    </View>
  );
};

export default RelatedProducts;