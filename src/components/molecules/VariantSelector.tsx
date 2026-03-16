import React from 'react';
import { View, Text } from '@tarojs/components';
import { ProductVariant } from '../../types';
import { theme } from '../../styles/theme';
import Icon from '../atoms/Icon';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string;
  onSelectVariant: (variantId: string) => void;
  title?: string;
  layout?: 'grid' | 'list';
  showStock?: boolean;
  showPrice?: boolean;
  disabled?: boolean;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariantId,
  onSelectVariant,
  title = '选择规格',
  layout = 'grid',
  showStock = true,
  showPrice = true,
  disabled = false,
}) => {
  if (variants.length === 0) {
    return null;
  }

  const handleVariantSelect = (variantId: string) => {
    if (!disabled) {
      onSelectVariant(variantId);
    }
  };

  const getVariantDisplayName = (variant: ProductVariant) => {
    // 如果有属性，显示属性值
    if (variant.attributes && Object.keys(variant.attributes).length > 0) {
      return Object.values(variant.attributes).join(' / ');
    }
    return variant.name;
  };

  const renderGridLayout = () => (
    <View style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    }}>
      {variants.map(variant => {
        const isSelected = selectedVariantId === variant.id;
        const isAvailable = variant.stock > 0;
        const canSelect = isAvailable && !disabled;
        
        return (
          <View
            key={variant.id}
            onClick={() => canSelect && handleVariantSelect(variant.id)}
            style={{
              position: 'relative',
              padding: theme.spacing.sm,
              backgroundColor: isSelected ? theme.colors.primary : theme.colors.gray100,
              border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.gray300}`,
              borderRadius: theme.borderRadius.md,
              cursor: canSelect ? 'pointer' : 'not-allowed',
              opacity: canSelect ? 1 : 0.5,
              transition: 'all 0.2s ease',
              minWidth: '80px',
              flex: '1 0 auto',
            }}
            hoverClass={canSelect ? "variant-option-hover" : undefined}
            hoverStyle={canSelect ? {
              transform: 'translateY(-1px)',
              boxShadow: theme.shadows.sm,
            } : undefined}
          >
            {/* 变体名称 */}
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: isSelected ? theme.colors.white : theme.colors.gray700,
              fontWeight: isSelected ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
              textAlign: 'center',
              marginBottom: showPrice || showStock ? theme.spacing.xs : 0,
            }}>
              {getVariantDisplayName(variant)}
            </Text>

            {/* 价格显示 */}
            {showPrice && (
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: isSelected ? theme.colors.white : theme.colors.primary,
                fontWeight: theme.typography.fontWeight.medium,
                textAlign: 'center',
                marginBottom: showStock ? '2px' : 0,
              }}>
                ¥{variant.price.toFixed(2)}
              </Text>
            )}

            {/* 库存状态 */}
            {showStock && (
              <View style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2px',
              }}>
                {isAvailable ? (
                  <>
                        <Icon name="check" size="xs" color={isSelected ? theme.colors.white : theme.colors.success} />
                    <Text style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: isSelected ? theme.colors.white : theme.colors.success,
                    }}>
                      有货
                    </Text>
                  </>
                ) : (
                  <>
                        <Icon name="close" size="xs" color={isSelected ? theme.colors.white : theme.colors.danger} />
                    <Text style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: isSelected ? theme.colors.white : theme.colors.danger,
                    }}>
                      缺货
                    </Text>
                  </>
                )}
              </View>
            )}

            {/* 选中标记 */}
            {isSelected && (
              <View style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '16px',
                height: '16px',
                borderRadius: '8px',
                backgroundColor: theme.colors.primary,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Icon name="check" size="xs" color={theme.colors.white} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );

  const renderListLayout = () => (
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm,
    }}>
      {variants.map(variant => {
        const isSelected = selectedVariantId === variant.id;
        const isAvailable = variant.stock > 0;
        const canSelect = isAvailable && !disabled;
        
        return (
          <View
            key={variant.id}
            onClick={() => canSelect && handleVariantSelect(variant.id)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: theme.spacing.md,
              backgroundColor: isSelected ? theme.colors.primary : theme.colors.gray100,
              border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.gray300}`,
              borderRadius: theme.borderRadius.md,
              cursor: canSelect ? 'pointer' : 'not-allowed',
              opacity: canSelect ? 1 : 0.5,
              transition: 'all 0.2s ease',
            }}
            hoverClass={canSelect ? "variant-option-hover" : undefined}
            hoverStyle={canSelect ? {
              backgroundColor: theme.colors.gray50,
              transform: 'translateX(2px)',
            } : undefined}
          >
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: isSelected ? theme.colors.white : theme.colors.gray700,
                fontWeight: isSelected ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
                marginBottom: theme.spacing.xs,
              }}>
                {getVariantDisplayName(variant)}
              </Text>
              
              <View style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}>
                {showPrice && (
                  <Text style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: isSelected ? theme.colors.white : theme.colors.primary,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}>
                    ¥{variant.price.toFixed(2)}
                  </Text>
                )}
                
                {showStock && (
                  <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}>
                    {isAvailable ? (
                      <>
                    <Icon name="check" size="xs" color={isSelected ? theme.colors.white : theme.colors.success} />
                        <Text style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: isSelected ? theme.colors.white : theme.colors.success,
                        }}>
                          有货
                        </Text>
                      </>
                    ) : (
                      <>
                    <Icon name="close" size="xs" color={isSelected ? theme.colors.white : theme.colors.danger} />
                        <Text style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: isSelected ? theme.colors.white : theme.colors.danger,
                        }}>
                          缺货
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* 选中标记 */}
            {isSelected && (
              <Icon name="check" size="sm" color={theme.colors.white} />
            )}
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={{
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.gray200}`,
    }}>
      {/* 标题 */}
      <View style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.gray800,
        }}>
          {title}
        </Text>
        
        {disabled && (
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.gray500,
            backgroundColor: theme.colors.gray100,
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            borderRadius: theme.borderRadius.sm,
          }}>
            不可选
          </Text>
        )}
      </View>

      {/* 变体选择器 */}
      {layout === 'grid' ? renderGridLayout() : renderListLayout()}

      {/* 帮助文本 */}
      <View style={{
        marginTop: theme.spacing.md,
        paddingTop: theme.spacing.md,
        borderTop: `1px solid ${theme.colors.gray200}`,
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.gray600,
          lineHeight: '1.4',
        }}>
          {disabled 
            ? '当前商品规格不可选择'
            : '请选择您需要的商品规格，不同规格可能有不同的价格和库存'
          }
        </Text>
      </View>
    </View>
  );
};

export default VariantSelector;