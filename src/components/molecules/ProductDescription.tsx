import React from 'react';
import { View, Text } from '@tarojs/components';
import { Product } from '../../types';
import { theme } from '../../styles/theme';

interface ProductDescriptionProps {
  product: Product;
  showDescription?: boolean;
  showSpecifications?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  product,
  showDescription = true,
  showSpecifications = true,
  expanded = false,
  onToggleExpand
}) => {
  // 检查是否有描述内容
  const hasDescription = product.description && product.description.trim().length > 0;
  
  // 检查是否有规格属性
  const hasSpecifications = product.attributes && Object.keys(product.attributes).length > 0;
  
  // 如果没有内容需要显示，返回null
  if (!showDescription && !showSpecifications) {
    return null;
  }

  // 如果没有描述和规格，显示占位符
  if (!hasDescription && !hasSpecifications) {
    return (
      <View style={{
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.gray200}`
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray500,
          textAlign: 'center'
        }}>
          暂无商品描述和规格信息
        </Text>
      </View>
    );
  }

  // 截断描述文本（如果未展开）
  const getTruncatedDescription = () => {
    if (!product.description || expanded) {
      return product.description;
    }
    
    const maxLength = 150;
    if (product.description.length <= maxLength) {
      return product.description;
    }
    
    return product.description.substring(0, maxLength) + '...';
  };

  return (
    <View style={{
      backgroundColor: theme.colors.white
    }}>
      {/* 商品描述部分 */}
      {showDescription && hasDescription && (
        <View style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.gray200}`
        }}>
          <View style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.md
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray800
            }}>
              商品描述
            </Text>
            
            {product.description.length > 150 && onToggleExpand && (
              <Text
                onClick={onToggleExpand}
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.primary,
                  cursor: 'pointer'
                }}
              >
                {expanded ? '收起' : '展开'}
              </Text>
            )}
          </View>
          
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray700,
            lineHeight: '1.6'
          }}>
            {getTruncatedDescription()}
          </Text>
          
          {/* 描述中的关键点（如果有） */}
          {product.description.includes('•') || product.description.includes('·') ? (
            <View style={{
              marginTop: theme.spacing.md,
              paddingLeft: theme.spacing.md
            }}>
              {product.description.split('\n').map((line, index) => {
                if (line.trim().startsWith('•') || line.trim().startsWith('·') || line.trim().startsWith('-')) {
                  return (
                    <View key={index} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: theme.spacing.xs
                    }}>
                      <Text style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.primary,
                        marginRight: theme.spacing.xs
                      }}>
                        •
                      </Text>
                      <Text style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.gray700,
                        lineHeight: '1.5',
                        flex: 1
                      }}>
                        {line.trim().substring(1).trim()}
                      </Text>
                    </View>
                  );
                }
                return null;
              })}
            </View>
          ) : null}
        </View>
      )}

      {/* 商品规格部分 */}
      {showSpecifications && hasSpecifications && (
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
            商品规格
          </Text>
          
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm
          }}>
            {Object.entries(product.attributes!).map(([key, value]) => (
              <View 
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: theme.spacing.xs,
                  borderBottom: `1px solid ${theme.colors.gray100}`
                }}
              >
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray600,
                  flex: 1
                }}>
                  {key}
                </Text>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray800,
                  fontWeight: theme.typography.fontWeight.medium,
                  flex: 1,
                  textAlign: 'right'
                }}>
                  {value}
                </Text>
              </View>
            ))}
          </View>
          
          {/* 规格分组显示（如果属性有特定模式） */}
          {Object.keys(product.attributes!).some(key => 
            key.toLowerCase().includes('size') || 
            key.toLowerCase().includes('color') ||
            key.toLowerCase().includes('material')
          ) && (
            <View style={{
              marginTop: theme.spacing.lg,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.gray50,
              borderRadius: theme.borderRadius.md
            }}>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.gray700,
                marginBottom: theme.spacing.sm
              }}>
                规格说明
              </Text>
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.gray600,
                lineHeight: '1.5'
              }}>
                请根据您的需求选择合适的规格。如有疑问，请联系客服。
              </Text>
            </View>
          )}
        </View>
      )}

      {/* 商品SKU信息 */}
      <View style={{
        padding: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.gray200}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray600
        }}>
          商品编号
        </Text>
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray800,
          fontWeight: theme.typography.fontWeight.medium,
          fontFamily: 'monospace'
        }}>
          {product.sku}
        </Text>
      </View>

      {/* 商品分类信息 */}
      <View style={{
        padding: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.gray200}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray600
        }}>
          商品分类
        </Text>
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray800,
          fontWeight: theme.typography.fontWeight.medium
        }}>
          {product.category}
        </Text>
      </View>
    </View>
  );
};

export default ProductDescription;