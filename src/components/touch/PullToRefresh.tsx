import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { View, Text } from '@tarojs/components';
import { theme } from '../../styles/theme';
import { isWeapp, isH5, platformExecute } from '../../utils/platform';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  pullingText?: string;
  releasingText?: string;
  refreshingText?: string;
  completeText?: string;
  pullThreshold?: number;
  maxPullDistance?: number;
  resistance?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  pullingText = '下拉刷新',
  releasingText = '释放刷新',
  refreshingText = '刷新中...',
  completeText = '刷新完成',
  pullThreshold = 80,
  maxPullDistance = 150,
  resistance = 2.5,
  disabled = false,
  className = '',
  style = {}
}) => {
  const [state, setState] = useState<'idle' | 'pulling' | 'releasing' | 'refreshing' | 'complete'>('idle');
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshComplete, setRefreshComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const isTouchingRef = useRef(false);
  const animationFrameRef = useRef<number>();

  // 状态文本
  const getStatusText = () => {
    switch (state) {
      case 'pulling':
        return pullingText;
      case 'releasing':
        return releasingText;
      case 'refreshing':
        return refreshingText;
      case 'complete':
        return completeText;
      default:
        return pullingText;
    }
  };

  // 状态图标
  const getStatusIcon = () => {
    const iconStyle = {
      fontSize: '20px',
      color: theme.colors.gray600,
      transition: 'transform 0.3s ease'
    };

    switch (state) {
      case 'pulling':
        return (
          <Text style={{
            ...iconStyle,
            transform: `rotate(${Math.min(pullDistance / pullThreshold, 1) * 180}deg)`
          }}>
            ↓
          </Text>
        );
      case 'releasing':
        return (
          <Text style={{
            ...iconStyle,
            transform: 'rotate(180deg)'
          }}>
            ↓
          </Text>
        );
      case 'refreshing':
        return (
          <Text style={{
            ...iconStyle,
            animation: 'spin 1s linear infinite'
          }}>
            ↻
          </Text>
        );
      case 'complete':
        return (
          <Text style={{
            ...iconStyle,
            color: theme.colors.success
          }}>
            ✓
          </Text>
        );
      default:
        return (
          <Text style={iconStyle}>
            ↓
          </Text>
        );
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || state === 'refreshing') return;
    
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    currentYRef.current = touch.clientY;
    isTouchingRef.current = true;
    
    // 检查是否在顶部
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      if (scrollTop > 0) {
        isTouchingRef.current = false;
        return;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchingRef.current || state === 'refreshing') return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - startYRef.current;
    
    if (deltaY > 0) {
      // 下拉
      e.preventDefault();
      
      const resistanceFactor = 1 + (pullDistance / maxPullDistance) * (resistance - 1);
      const newPullDistance = Math.min(deltaY / resistanceFactor, maxPullDistance);
      
      setPullDistance(newPullDistance);
      
      if (newPullDistance >= pullThreshold) {
        setState('releasing');
      } else {
        setState('pulling');
      }
      
      currentYRef.current = touch.clientY;
    }
  };

  const handleTouchEnd = () => {
    if (!isTouchingRef.current) return;
    
    isTouchingRef.current = false;
    
    if (state === 'releasing') {
      // 触发刷新
      setState('refreshing');
      setRefreshComplete(false);
      
      // 执行刷新
      const refreshResult = onRefresh();
      
      if (refreshResult instanceof Promise) {
        refreshResult
          .then(() => {
            setState('complete');
            setRefreshComplete(true);
            
            // 2秒后重置
            setTimeout(() => {
              setState('idle');
              setPullDistance(0);
            }, 2000);
          })
          .catch(() => {
            setState('idle');
            setPullDistance(0);
          });
      } else {
        // 同步刷新
        setTimeout(() => {
          setState('complete');
          setRefreshComplete(true);
          
          setTimeout(() => {
            setState('idle');
            setPullDistance(0);
          }, 2000);
        }, 1000);
      }
    } else {
      // 回弹
      animateBack();
    }
  };

  const animateBack = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    const startTime = Date.now();
    const duration = 300;
    const startPullDistance = pullDistance;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 缓动函数
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setPullDistance(startPullDistance * (1 - easeOut));
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setState('idle');
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // 平台特定的样式
  const platformStyles = platformExecute({
    weapp: () => ({
      // 微信小程序：优化性能
      transition: 'transform 0.2s ease',
      WebkitOverflowScrolling: 'touch',
      overflowScrolling: 'touch'
    }),
    h5: () => ({
      // H5：完整支持
      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      WebkitOverflowScrolling: 'touch',
      overflowScrolling: 'touch',
      touchAction: 'pan-y',
      willChange: 'transform'
    }),
    default: () => ({})
  });

  // 清理
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const containerTransform = {
    transform: `translateY(${state === 'refreshing' ? pullThreshold : pullDistance}px)`,
    ...platformStyles
  };

  return (
    <View
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100%',
        overflow: 'auto',
        ...style
      }}
      className={`pull-to-refresh ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* 刷新指示器 */}
      <View
        style={{
          position: 'absolute',
          top: `-${pullThreshold}px`,
          left: 0,
          right: 0,
          height: `${pullThreshold}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${-pullDistance}px)`
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {getStatusIcon()}
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600
          }}>
            {getStatusText()}
          </Text>
          
          {/* 进度指示器 */}
          {(state === 'pulling' || state === 'releasing') && (
            <View style={{
              width: '60px',
              height: '4px',
              backgroundColor: theme.colors.gray200,
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '4px'
            }}>
              <View
                style={{
                  width: `${Math.min((pullDistance / pullThreshold) * 100, 100)}%`,
                  height: '100%',
                  backgroundColor: theme.colors.primary,
                  borderRadius: '2px',
                  transition: 'width 0.1s ease'
                }}
              />
            </View>
          )}
        </View>
      </View>
      
      {/* 内容区域 */}
      <View style={containerTransform}>
        {children}
      </View>
      
      {/* 刷新完成提示 */}
      {refreshComplete && state === 'complete' && (
        <View
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            backgroundColor: theme.colors.success,
            color: theme.colors.white,
            padding: '12px 16px',
            textAlign: 'center',
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            zIndex: 1000,
            animation: 'slideDown 0.3s ease, fadeOut 0.3s ease 1.7s',
            animationFillMode: 'forwards'
          }}
        >
          {completeText}
        </View>
      )}
    </View>
  );
};

// 无限滚动组件
export const InfiniteScroll: React.FC<{
  children: ReactNode;
  onLoadMore: () => Promise<void> | void;
  loadingText?: string;
  noMoreText?: string;
  threshold?: number;
  disabled?: boolean;
}> = ({
  children,
  onLoadMore,
  loadingText = '加载更多...',
  noMoreText = '没有更多了',
  threshold = 100,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  const handleLoadMore = async () => {
    if (isLoading || !hasMore || disabled) return;
    
    setIsLoading(true);
    
    try {
      await onLoadMore();
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 使用IntersectionObserver检测底部（仅H5）
  useEffect(() => {
    if (!isH5() || !containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading && hasMore) {
            handleLoadMore();
          }
        });
      },
      {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    );
    
    observerRef.current = observer;
    
    // 创建底部哨兵元素
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.width = '1px';
    sentinel.style.position = 'absolute';
    sentinel.style.bottom = '0';
    
    containerRef.current.appendChild(sentinel);
    observer.observe(sentinel);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (sentinel.parentNode) {
        sentinel.parentNode.removeChild(sentinel);
      }
    };
  }, [isLoading, hasMore, threshold]);

  // 手动检查滚动位置（小程序和H5备用）
  const handleScroll = (e: React.UIEvent) => {
    if (!isH5() || isLoading || !hasMore || disabled) return;
    
    const target = e.currentTarget as HTMLDivElement;
    const scrollHeight = target.scrollHeight;
    const scrollTop = target.scrollTop;
    const clientHeight = target.clientHeight;
    
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      handleLoadMore();
    }
  };

  return (
    <View
      ref={containerRef}
      style={{
        height: '100%',
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={isH5() ? handleScroll : undefined}
    >
      {children}
      
      {/* 加载更多指示器 */}
      <View
        style={{
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        {isLoading ? (
          <>
            <View
              style={{
                width: '24px',
                height: '24px',
                border: `3px solid ${theme.colors.gray200}`,
                borderTopColor: theme.colors.primary,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray600
            }}>
              {loadingText}
            </Text>
          </>
        ) : !hasMore ? (
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray500
          }}>
            {noMoreText}
          </Text>
        ) : (
          <View
            onClick={handleLoadMore}
            style={{
              padding: '8px 16px',
              backgroundColor: theme.colors.gray100,
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer'
            }}
          >
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700
            }}>
              点击加载更多
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// 平台特定的刷新组件
export const WeappPullToRefresh: React.FC<PullToRefreshProps> = (props) => {
  if (!isWeapp()) return null;
  return <PullToRefresh {...props} />;
};

export const H5PullToRefresh: React.FC<PullToRefreshProps> = (props) => {
  if (!isH5()) return null;
  return <PullToRefresh {...props} />;
};

export default PullToRefresh;