import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { View } from '@tarojs/components';
import { theme } from '../../styles/theme';
import { isWeapp, isH5, platformExecute } from '../../utils/platform';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface SwipeableProps {
  children: ReactNode;
  onSwipe?: (direction: SwipeDirection, distance: number) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // 滑动阈值（像素）
  minDistance?: number; // 最小滑动距离
  maxDistance?: number; // 最大滑动距离
  enableSwipe?: boolean | SwipeDirection[];
  swipeActions?: ReactNode; // 滑动后显示的操作
  actionWidth?: number; // 操作区域宽度
  bounceBack?: boolean; // 是否回弹
  className?: string;
  style?: React.CSSProperties;
}

const Swipeable: React.FC<SwipeableProps> = ({
  children,
  onSwipe,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  minDistance = 10,
  maxDistance = 200,
  enableSwipe = true,
  swipeActions,
  actionWidth = 80,
  bounceBack = true,
  className = '',
  style = {}
}) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isActionVisible, setIsActionVisible] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // 检查是否启用特定方向的滑动
  const isDirectionEnabled = (direction: SwipeDirection): boolean => {
    if (typeof enableSwipe === 'boolean') {
      return enableSwipe;
    }
    return enableSwipe.includes(direction);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isDirectionEnabled('left') && !isDirectionEnabled('right') && 
        !isDirectionEnabled('up') && !isDirectionEnabled('down')) {
      return;
    }

    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setCurrentX(touch.clientX);
    setCurrentY(touch.clientY);
    setIsSwiping(true);
    setSwipeDirection(null);
    
    // 取消任何正在进行的动画
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    // 确定主要滑动方向
    if (!swipeDirection) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && isDirectionEnabled('right')) {
          setSwipeDirection('right');
        } else if (deltaX < 0 && isDirectionEnabled('left')) {
          setSwipeDirection('left');
        }
      } else {
        if (deltaY > 0 && isDirectionEnabled('down')) {
          setSwipeDirection('down');
        } else if (deltaY < 0 && isDirectionEnabled('up')) {
          setSwipeDirection('up');
        }
      }
    }
    
    // 限制滑动距离
    let newX = currentX;
    let newY = currentY;
    
    if (swipeDirection === 'left' || swipeDirection === 'right') {
      newX = Math.max(-maxDistance, Math.min(maxDistance, deltaX));
    } else if (swipeDirection === 'up' || swipeDirection === 'down') {
      newY = Math.max(-maxDistance, Math.min(maxDistance, deltaY));
    }
    
    setCurrentX(newX);
    setCurrentY(newY);
    
    // 使用requestAnimationFrame平滑更新
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      // 更新UI
    });
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    
    setIsSwiping(false);
    
    const deltaX = currentX;
    const deltaY = currentY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // 清理动画帧
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // 检查是否达到阈值
    if (absDeltaX > threshold || absDeltaY > threshold) {
      let direction: SwipeDirection;
      let distance: number;
      
      if (absDeltaX > absDeltaY) {
        direction = deltaX > 0 ? 'right' : 'left';
        distance = absDeltaX;
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
        distance = absDeltaY;
      }
      
      // 触发回调
      onSwipe?.(direction, distance);
      
      switch (direction) {
        case 'left':
          onSwipeLeft?.();
          if (swipeActions) {
            setIsActionVisible(true);
            setCurrentX(-actionWidth);
          }
          break;
        case 'right':
          onSwipeRight?.();
          if (swipeActions) {
            setIsActionVisible(true);
            setCurrentX(actionWidth);
          }
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
    } else if (bounceBack) {
      // 未达到阈值，回弹
      animateBack();
    }
    
    setSwipeDirection(null);
  };

  const handleTouchCancel = () => {
    setIsSwiping(false);
    if (bounceBack && !isActionVisible) {
      animateBack();
    }
    setSwipeDirection(null);
  };

  const animateBack = () => {
    const startTime = Date.now();
    const duration = 300;
    const startXVal = currentX;
    const startYVal = currentY;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 缓动函数
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCurrentX(startXVal * (1 - easeOut));
      setCurrentY(startYVal * (1 - easeOut));
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const resetPosition = () => {
    setIsActionVisible(false);
    animateBack();
  };

  // 平台特定的触摸样式
  const platformTouchStyles = platformExecute({
    weapp: () => ({
      // 微信小程序：优化触摸性能
      transition: isSwiping ? 'none' : 'transform 0.3s ease',
      willChange: 'transform',
      WebkitUserSelect: 'none',
      userSelect: 'none'
    }),
    h5: () => ({
      // H5：完整的触摸支持
      transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: 'transform',
      WebkitUserSelect: 'none',
      userSelect: 'none',
      touchAction: 'pan-y',
      WebkitTapHighlightColor: 'transparent'
    }),
    default: () => ({})
  });

  const transformStyle = {
    transform: `translate3d(${currentX}px, ${currentY}px, 0)`,
    ...platformTouchStyles
  };

  // 清理效果
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <View
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      className={`swipeable ${className}`}
    >
      {/* 滑动操作区域 */}
      {swipeActions && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: isActionVisible && currentX < 0 ? 0 : `-${actionWidth}px`,
            left: isActionVisible && currentX > 0 ? 0 : `-${actionWidth}px`,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: currentX < 0 ? 'flex-end' : 'flex-start',
            padding: '0 16px',
            backgroundColor: currentX < 0 ? theme.colors.danger : theme.colors.primary,
            transition: 'right 0.3s ease, left 0.3s ease',
            zIndex: 1
          }}
        >
          {swipeActions}
        </View>
      )}
      
      {/* 可滑动内容 */}
      <View
        ref={containerRef}
        style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: theme.colors.white,
          ...transformStyle
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {children}
        
        {/* 滑动指示器 */}
        {isSwiping && swipeDirection && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: `${theme.colors.primary}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <View
              style={{
                padding: '8px 16px',
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius.md,
                opacity: 0.8
              }}
            >
              <View style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.white,
                fontWeight: theme.typography.fontWeight.medium
              }}>
                {swipeDirection === 'left' && '向左滑动'}
                {swipeDirection === 'right' && '向右滑动'}
                {swipeDirection === 'up' && '向上滑动'}
                {swipeDirection === 'down' && '向下滑动'}
              </View>
            </View>
          </View>
        )}
      </View>
      
      {/* 重置按钮 */}
      {isActionVisible && (
        <View
          onClick={resetPosition}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '8px 16px',
            backgroundColor: theme.colors.gray800,
            color: theme.colors.white,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
            cursor: 'pointer',
            zIndex: 3,
            opacity: 0.7
          }}
        >
          点击重置
        </View>
      )}
    </View>
  );
};

// 滑动删除组件
export const SwipeToDelete: React.FC<{
  children: ReactNode;
  onDelete: () => void;
  confirmText?: string;
  deleteWidth?: number;
}> = ({
  children,
  onDelete,
  confirmText = '删除',
  deleteWidth = 80
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (showConfirm) {
      onDelete();
    } else {
      setShowConfirm(true);
    }
  };

  const handleReset = () => {
    setShowConfirm(false);
  };

  return (
    <Swipeable
      onSwipeLeft={() => setShowConfirm(true)}
      swipeActions={
        <View
          onClick={handleDelete}
          style={{
            padding: '8px 16px',
            backgroundColor: showConfirm ? theme.colors.danger : theme.colors.warning,
            borderRadius: theme.borderRadius.sm,
            cursor: 'pointer'
          }}
        >
          <View style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.white,
            fontWeight: theme.typography.fontWeight.medium,
            whiteSpace: 'nowrap'
          }}>
            {showConfirm ? '确认删除' : confirmText}
          </View>
        </View>
      }
      actionWidth={deleteWidth}
      bounceBack={!showConfirm}
      enableSwipe={['left']}
    >
      {children}
      
      {showConfirm && (
        <View
          onClick={handleReset}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: `${theme.colors.gray800}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <View style={{
            padding: '4px 8px',
            backgroundColor: theme.colors.gray800,
            borderRadius: theme.borderRadius.sm,
            opacity: 0.8
          }}>
            <View style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.white
            }}>
              滑动取消
            </View>
          </View>
        </View>
      )}
    </Swipeable>
  );
};

// 轮播图组件
export const SwipeCarousel: React.FC<{
  items: ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}> = ({
  items,
  autoPlay = false,
  autoPlayInterval = 3000,
  showDots = true,
  showArrows = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout>();

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleSwipe = (direction: SwipeDirection) => {
    if (direction === 'left') {
      goToNext();
    } else if (direction === 'right') {
      goToPrev();
    }
  };

  // 自动播放
  useEffect(() => {
    if (autoPlay && !isSwiping) {
      autoPlayTimerRef.current = setInterval(goToNext, autoPlayInterval);
    }
    
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isSwiping]);

  return (
    <View style={{ position: 'relative', overflow: 'hidden' }}>
      <Swipeable
        onSwipe={handleSwipe}
        onSwipeLeft={goToNext}
        onSwipeRight={goToPrev}
        threshold={30}
        enableSwipe={['left', 'right']}
        onTouchStart={() => setIsSwiping(true)}
        onTouchEnd={() => setIsSwiping(false)}
      >
        <View style={{
          display: 'flex',
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.3s ease'
        }}>
          {items.map((item, index) => (
            <View
              key={index}
              style={{
                width: '100%',
                flexShrink: 0
              }}
            >
              {item}
            </View>
          ))}
        </View>
      </Swipeable>
      
      {/* 指示点 */}
      {showDots && items.length > 1 && (
        <View style={{
          position: 'absolute',
          bottom: '16px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          zIndex: 10
        }}>
          {items.map((_, index) => (
            <View
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? theme.colors.primary : theme.colors.gray300,
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            />
          ))}
        </View>
      )}
      
      {/* 导航箭头 */}
      {showArrows && items.length > 1 && (
        <>
          <View
            onClick={goToPrev}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <View style={{
              fontSize: '20px',
              color: theme.colors.white
            }}>
              ‹
            </View>
          </View>
          
          <View
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <View style={{
              fontSize: '20px',
              color: theme.colors.white
            }}>
              ›
            </View>
          </View>
        </>
      )}
    </View>
  );
};

// 平台特定的滑动组件
export const WeappSwipeable: React.FC<SwipeableProps> = (props) => {
  if (!isWeapp()) return null;
  return <Swipeable {...props} />;
};

export const H5Swipeable: React.FC<SwipeableProps> = (props) => {
  if (!isH5()) return null;
  return <Swipeable {...props} />;
};

export default Swipeable;