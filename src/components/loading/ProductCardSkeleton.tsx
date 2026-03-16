import React from 'react';
import { View } from '@tarojs/components';
import { theme } from '../../styles/theme';
import { isWeapp, isH5, platformExecute } from '../../utils/platform';

interface ProductCardSkeletonProps {
  count?: number;
  compact?: boolean;
  showPrice?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  count = 1,
  compact = false,
  showPrice = true,
  showRating = true,
  showAddToCart = true
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <View
      key={index}
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        boxShadow: theme.shadows.sm,
        ...(compact ? {
          width: '160px',
          flexShrink: 0
        } : {
          flex: 1,
          minWidth: '200px'
        })
      }}
    >
      {/* 图片占位符 */}
      <View
        style={{
          width: '100%',
          height: compact ? '120px' : '180px',
          backgroundColor: theme.colors.gray200,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* 骨架屏动画 */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: platformExecute({
              weapp: () => 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              h5: () => 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              default: () => 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
            }),
            animation: 'shimmer 1.5s infinite'
          }}
        />
      </View>

      <View
        style={{
          padding: compact ? theme.spacing.sm : theme.spacing.md
        }}
      >
        {/* 标题占位符 */}
        <View
          style={{
            height: compact ? '16px' : '20px',
            backgroundColor: theme.colors.gray200,
            borderRadius: theme.borderRadius.xs,
            marginBottom: compact ? theme.spacing.xs : theme.spacing.sm,
            width: '80%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              animation: 'shimmer 1.5s infinite'
            }}
          />
        </View>

        {/* 描述占位符 */}
        {!compact && (
          <View
            style={{
              height: '14px',
              backgroundColor: theme.colors.gray200,
              borderRadius: theme.borderRadius.xs,
              marginBottom: theme.spacing.sm,
              width: '60%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                animation: 'shimmer 1.5s infinite'
              }}
            />
          </View>
        )}

        {/* 价格和评分占位符 */}
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: compact ? theme.spacing.xs : theme.spacing.sm
          }}
        >
          {showPrice && (
            <View
              style={{
                height: compact ? '18px' : '24px',
                backgroundColor: theme.colors.gray200,
                borderRadius: theme.borderRadius.xs,
                width: '40%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'shimmer 1.5s infinite'
                }}
              />
            </View>
          )}

          {showRating && (
            <View
              style={{
                height: compact ? '14px' : '16px',
                backgroundColor: theme.colors.gray200,
                borderRadius: theme.borderRadius.xs,
                width: '30%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'shimmer 1.5s infinite'
                }}
              />
            </View>
          )}
        </View>

        {/* 添加到购物车按钮占位符 */}
        {showAddToCart && (
          <View
            style={{
              height: compact ? '28px' : '36px',
              backgroundColor: theme.colors.gray200,
              borderRadius: theme.borderRadius.md,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                animation: 'shimmer 1.5s infinite'
              }}
            />
          </View>
        )}
      </View>
    </View>
  ));

  return <>{skeletons}</>;
};

// 平台特定的骨架屏变体
export const WeappProductCardSkeleton: React.FC<ProductCardSkeletonProps> = (props) => {
  if (!isWeapp()) return null;
  return <ProductCardSkeleton {...props} />;
};

export const H5ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = (props) => {
  if (!isH5()) return null;
  return <ProductCardSkeleton {...props} />;
};

// 网格布局骨架屏
export const ProductGridSkeleton: React.FC<{
  columns?: number;
  rows?: number;
  compact?: boolean;
}> = ({ columns = 2, rows = 3, compact = false }) => {
  const totalItems = columns * rows;

  return (
    <View
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: theme.spacing.md,
        padding: theme.spacing.lg
      }}
    >
      <ProductCardSkeleton count={totalItems} compact={compact} />
    </View>
  );
};

// 列表布局骨架屏
export const ProductListSkeleton: React.FC<{
  count?: number;
  showImage?: boolean;
  showDescription?: boolean;
}> = ({ count = 5, showImage = true, showDescription = true }) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md,
        padding: theme.spacing.lg
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          style={{
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            display: 'flex',
            gap: theme.spacing.md,
            alignItems: 'center',
            boxShadow: theme.shadows.sm
          }}
        >
          {showImage && (
            <View
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: theme.colors.gray200,
                borderRadius: theme.borderRadius.md,
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'shimmer 1.5s infinite'
                }}
              />
            </View>
          )}

          <View style={{ flex: 1 }}>
            {/* 标题占位符 */}
            <View
              style={{
                height: '20px',
                backgroundColor: theme.colors.gray200,
                borderRadius: theme.borderRadius.xs,
                marginBottom: theme.spacing.sm,
                width: '70%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'shimmer 1.5s infinite'
                }}
              />
            </View>

            {/* 描述占位符 */}
            {showDescription && (
              <View
                style={{
                  height: '14px',
                  backgroundColor: theme.colors.gray200,
                  borderRadius: theme.borderRadius.xs,
                  marginBottom: theme.spacing.sm,
                  width: '50%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    animation: 'shimmer 1.5s infinite'
                  }}
                />
              </View>
            )}

            {/* 价格和评分占位符 */}
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  height: '24px',
                  backgroundColor: theme.colors.gray200,
                  borderRadius: theme.borderRadius.xs,
                  width: '40%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    animation: 'shimmer 1.5s infinite'
                  }}
                />
              </View>

              <View
                style={{
                  height: '16px',
                  backgroundColor: theme.colors.gray200,
                  borderRadius: theme.borderRadius.xs,
                  width: '30%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                    animation: 'shimmer 1.5s infinite'
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ProductCardSkeleton;