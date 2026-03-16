import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { theme } from '../../styles/theme';
import { isWeapp, isH5 } from '../../utils/platform';
import {
  ProductCardSkeleton,
  ProductGridSkeleton,
  ProductListSkeleton,
  LoadingSpinner,
  LoadingManager,
  useLoading,
  LoadingWrapper
} from './index';

const LoadingDemo: React.FC = () => {
  const { showLoading, hideLoading, updateProgress } = useLoading();
  const [loadingType, setLoadingType] = useState<'spinner' | 'progress' | 'skeleton'>('spinner');
  const [progress, setProgress] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);

  // 模拟进度加载
  useEffect(() => {
    if (loadingType === 'progress' && progress < 100) {
      const timer = setTimeout(() => {
        const newProgress = progress + 10;
        setProgress(newProgress);
        updateProgress(newProgress);
        
        if (newProgress >= 100) {
          setTimeout(() => {
            hideLoading();
            setProgress(0);
          }, 500);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [loadingType, progress, updateProgress, hideLoading]);

  const handleShowLoading = (type: 'spinner' | 'progress' | 'skeleton') => {
    setLoadingType(type);
    setProgress(0);
    
    if (type === 'progress') {
      showLoading('正在加载数据...', 'progress');
    } else if (type === 'skeleton') {
      showLoading('加载骨架屏...', 'skeleton');
    } else {
      showLoading('加载中...', 'spinner');
    }
    
    // 3秒后自动隐藏
    setTimeout(() => {
      hideLoading();
      setProgress(0);
    }, 3000);
  };

  const handleShowFullScreen = () => {
    setShowFullScreen(true);
    showLoading('全屏加载中...', 'spinner');
    
    setTimeout(() => {
      hideLoading();
      setShowFullScreen(false);
    }, 2000);
  };

  const platformInfo = isWeapp() ? '微信小程序' : isH5() ? 'H5网页' : '其他平台';

  return (
    <ScrollView style={{ backgroundColor: theme.colors.gray50, minHeight: '100vh' }}>
      <View style={{ padding: theme.spacing.lg }}>
        <Text style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.gray800,
          marginBottom: theme.spacing.md
        }}>
          加载状态和骨架屏演示
        </Text>
        
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray600,
          marginBottom: theme.spacing.xl
        }}>
          当前平台: {platformInfo}
        </Text>

        {/* 加载指示器演示 */}
        <View style={{
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
          boxShadow: theme.shadows.sm
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            marginBottom: theme.spacing.md
          }}>
            加载指示器
          </Text>
          
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg
          }}>
            <View>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray700,
                marginBottom: theme.spacing.sm
              }}>
                不同尺寸的加载器
              </Text>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: theme.spacing.md
              }}>
                <LoadingSpinner size="xs" />
                <LoadingSpinner size="sm" text="小号" />
                <LoadingSpinner size="md" text="中号" />
                <LoadingSpinner size="lg" text="大号" />
                <LoadingSpinner size="xl" text="超大号" />
              </View>
            </View>
            
            <View>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray700,
                marginBottom: theme.spacing.sm
              }}>
                不同颜色的加载器
              </Text>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: theme.spacing.md
              }}>
                <LoadingSpinner color={theme.colors.primary} />
                <LoadingSpinner color={theme.colors.success} text="成功" />
                <LoadingSpinner color={theme.colors.warning} text="警告" />
                <LoadingSpinner color={theme.colors.danger} text="错误" />
              </View>
            </View>
            
            <View>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray700,
                marginBottom: theme.spacing.sm
              }}>
                文本位置
              </Text>
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md
              }}>
                <LoadingSpinner text="文本在底部" textPosition="bottom" />
                <LoadingSpinner text="文本在右侧" textPosition="right" />
                <LoadingSpinner text="文本在顶部" textPosition="top" />
                <LoadingSpinner text="文本在左侧" textPosition="left" />
              </View>
            </View>
            
            <View>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray700,
                marginBottom: theme.spacing.sm
              }}>
                进度条
              </Text>
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md
              }}>
                <LoadingSpinner.ProgressBar progress={30} />
                <LoadingSpinner.ProgressBar progress={60} showPercentage />
                <LoadingSpinner.ProgressBar progress={90} height={12} color={theme.colors.success} animated />
              </View>
            </View>
          </View>
        </View>

        {/* 骨架屏演示 */}
        <View style={{
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
          boxShadow: theme.shadows.sm
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            marginBottom: theme.spacing.md
          }}>
            骨架屏组件
          </Text>
          
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg
          }}>
            <View>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray700,
                marginBottom: theme.spacing.sm
              }}>
                产品卡片骨架屏
              </Text>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                gap: theme.spacing.md,
                overflowX: 'auto',
                paddingBottom: theme.spacing.sm
              }}>
                <ProductCardSkeleton count={3} compact />
              </View>
            </View>
            
            <View>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray700,
                marginBottom: theme.spacing.sm
              }}>
                网格布局骨架屏
              </Text>
              <ProductGridSkeleton columns={2} rows={2} />
            </View>
            
            <View>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray700,
                marginBottom: theme.spacing.sm
              }}>
                列表布局骨架屏
              </Text>
              <ProductListSkeleton count={3} showImage showDescription />
            </View>
            
            <View>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray700,
                marginBottom: theme.spacing.sm
              }}>
                基础骨架屏元素
              </Text>
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.md
              }}>
                <LoadingSpinner.SkeletonText lines={3} />
                <View style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                  <LoadingSpinner.SkeletonCircle size={50} />
                  <View style={{ flex: 1 }}>
                    <LoadingSpinner.SkeletonText lines={2} />
                  </View>
                </View>
                <LoadingSpinner.SkeletonRect width="100%" height="100px" />
              </View>
            </View>
          </View>
        </View>

        {/* 交互演示 */}
        <View style={{
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
          boxShadow: theme.shadows.sm
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            marginBottom: theme.spacing.md
          }}>
            交互演示
          </Text>
          
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700
            }}>
              点击按钮体验不同的加载状态
            </Text>
            
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: theme.spacing.sm
            }}>
              <View
                onClick={() => handleShowLoading('spinner')}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer'
                }}
              >
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.white,
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  显示加载器
                </Text>
              </View>
              
              <View
                onClick={() => handleShowLoading('progress')}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  backgroundColor: theme.colors.success,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer'
                }}
              >
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.white,
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  显示进度条
                </Text>
              </View>
              
              <View
                onClick={() => handleShowLoading('skeleton')}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  backgroundColor: theme.colors.warning,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer'
                }}
              >
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.white,
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  显示骨架屏
                </Text>
              </View>
              
              <View
                onClick={handleShowFullScreen}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  backgroundColor: theme.colors.danger,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer'
                }}
              >
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.white,
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  全屏加载
                </Text>
              </View>
            </View>
            
            <View style={{
              marginTop: theme.spacing.md,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.gray50,
              borderRadius: theme.borderRadius.md
            }}>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.gray700,
                marginBottom: theme.spacing.xs
              }}>
                加载包装器演示
              </Text>
              
              <LoadingWrapper
                isLoading={showFullScreen}
                loadingType="spinner"
                loadingMessage="全屏加载演示中..."
                overlay={false}
              >
                <View style={{
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.white,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.gray200}`
                }}>
                  <Text style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.gray600
                  }}>
                    这是一个会被加载状态覆盖的内容区域
                  </Text>
                </View>
              </LoadingWrapper>
            </View>
          </View>
        </View>

        {/* 平台特定演示 */}
        <View style={{
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
          boxShadow: theme.shadows.sm
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            marginBottom: theme.spacing.md
          }}>
            平台特定优化
          </Text>
          
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700
            }}>
              当前平台加载优化:
            </Text>
            
            {isWeapp() && (
              <View style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.gray50,
                borderRadius: theme.borderRadius.md
              }}>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.success,
                  fontWeight: theme.typography.fontWeight.medium,
                  marginBottom: theme.spacing.xs
                }}>
                  🎯 微信小程序优化
                </Text>
                <Text style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.gray600
                }}>
                  • 使用小程序原生动画性能更佳
                  {'\n'}• 减少CSS动画依赖，提升渲染性能
                  {'\n'}• 适配小程序特有的加载状态
                </Text>
              </View>
            )}
            
            {isH5() && (
              <View style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.gray50,
                borderRadius: theme.borderRadius.md
              }}>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.primary,
                  fontWeight: theme.typography.fontWeight.medium,
                  marginBottom: theme.spacing.xs
                }}>
                  🌐 H5网页优化
                </Text>
                <Text style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.gray600
                }}>
                  • 支持CSS高级动画和过渡效果
                  {'\n'}• 使用IntersectionObserver实现懒加载
                  {'\n'}• 渐进式图片加载和错误处理
                  {'\n'}• 支持prefers-reduced-motion可访问性
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 使用说明 */}
        <View style={{
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          boxShadow: theme.shadows.sm
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            marginBottom: theme.spacing.md
          }}>
            使用说明
          </Text>
          
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700
            }}>
              1. 基本加载器:
            </Text>
            <Text style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.gray600,
              fontFamily: 'monospace',
              backgroundColor: theme.colors.gray50,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.sm
            }}>
              {'<LoadingSpinner size="md" text="加载中..." />'}
            </Text>
            
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginTop: theme.spacing.sm
            }}>
              2. 骨架屏:
            </Text>
            <Text style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.gray600,
              fontFamily: 'monospace',
              backgroundColor: theme.colors.gray50,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.sm
            }}>
              {'<ProductCardSkeleton count={3} compact />'}
            </Text>
            
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginTop: theme.spacing.sm
            }}>
              3. 加载管理器:
            </Text>
            <Text style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.gray600,
              fontFamily: 'monospace',
              backgroundColor: theme.colors.gray50,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.sm
            }}>
              {`const { showLoading, hideLoading } = useLoading();
showLoading('正在处理...');
// ... 处理完成后
hideLoading();`}
            </Text>
            
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginTop: theme.spacing.sm
            }}>
              4. 加载包装器:
            </Text>
            <Text style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.gray600,
              fontFamily: 'monospace',
              backgroundColor: theme.colors.gray50,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.sm
            }}>
              {`<LoadingWrapper
  isLoading={isLoading}
  loadingType="skeleton"
  skeleton={<ProductCardSkeleton count={2} />}
>
  <YourContent />
</LoadingWrapper>`}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// 包装组件以提供LoadingContext
const LoadingDemoWithManager: React.FC = () => (
  <LoadingManager globalLoading>
    <LoadingDemo />
  </LoadingManager>
);

export default LoadingDemoWithManager;