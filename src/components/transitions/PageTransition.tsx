import React, { useState, useEffect, ReactNode } from 'react';
import { View } from '@tarojs/components';
import { theme } from '../../styles/theme';
import { isWeapp, isH5, platformExecute } from '../../utils/platform';

export type TransitionType = 
  | 'fade' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right'
  | 'zoom'
  | 'flip'
  | 'bounce';

export type TransitionSpeed = 'fast' | 'normal' | 'slow';

interface PageTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  speed?: TransitionSpeed;
  isEntering?: boolean;
  isExiting?: boolean;
  onEntered?: () => void;
  onExited?: () => void;
  duration?: number;
  delay?: number;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  speed = 'normal',
  isEntering = true,
  isExiting = false,
  onEntered,
  onExited,
  duration,
  delay = 0,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const speedMap = {
    fast: 200,
    normal: 300,
    slow: 500
  };

  const transitionDuration = duration || speedMap[speed];

  // 平台特定的动画配置
  const platformAnimation = platformExecute({
    weapp: () => {
      // 微信小程序：使用CSS动画，性能优化
      const baseStyle = {
        transition: `all ${transitionDuration}ms ease`,
        transitionDelay: `${delay}ms`
      };

      switch (type) {
        case 'fade':
          return {
            ...baseStyle,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        case 'slide-up':
          return {
            ...baseStyle,
            transform: `translateY(${isEntering && !isExiting ? '0' : '100%'})`,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        case 'slide-down':
          return {
            ...baseStyle,
            transform: `translateY(${isEntering && !isExiting ? '0' : '-100%'})`,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        case 'slide-left':
          return {
            ...baseStyle,
            transform: `translateX(${isEntering && !isExiting ? '0' : '100%'})`,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        case 'slide-right':
          return {
            ...baseStyle,
            transform: `translateX(${isEntering && !isExiting ? '0' : '-100%'})`,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        case 'zoom':
          return {
            ...baseStyle,
            transform: `scale(${isEntering && !isExiting ? 1 : 0.8})`,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        default:
          return baseStyle;
      }
    },
    h5: () => {
      // H5：支持更复杂的动画
      const baseStyle = {
        transition: `all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity'
      };

      switch (type) {
        case 'fade':
          return {
            ...baseStyle,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        case 'slide-up':
          return {
            ...baseStyle,
            transform: `translateY(${isEntering && !isExiting ? '0' : '100%'})`,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        case 'slide-down':
          return {
            ...baseStyle,
            transform: `translateY(${isEntering && !isExiting ? '0' : '-100%'})`,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        case 'slide-left':
          return {
            ...baseStyle,
            transform: `translateX(${isEntering && !isExiting ? '0' : '100%})`,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        case 'slide-right':
          return {
            ...baseStyle,
            transform: `translateX(${isEntering && !isExiting ? '0' : '-100%'})`,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        case 'zoom':
          return {
            ...baseStyle,
            transform: `scale(${isEntering && !isExiting ? 1 : 0.8})`,
            opacity: isEntering && !isExiting ? 1 : 0
          };
        case 'flip':
          return {
            ...baseStyle,
            transform: `rotateY(${isEntering && !isExiting ? '0' : '180deg'})`,
            opacity: isEntering && !isExiting ? 1 : 0,
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden'
          };
        case 'bounce':
          return {
            ...baseStyle,
            transform: `scale(${isEntering && !isExiting ? 1 : 0.8})`,
            opacity: isEntering && !isExiting ? 1 : 0,
            animation: isEntering && !isExiting ? 'bounce 0.5s ease' : 'none'
          };
        default:
          return baseStyle;
      }
    },
    default: () => ({})
  });

  useEffect(() => {
    if (isEntering && !isExiting) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(false);
        onEntered?.();
      }, delay);
      return () => clearTimeout(timer);
    } else if (isExiting) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
        onExited?.();
      }, transitionDuration + delay);
      return () => clearTimeout(timer);
    }
  }, [isEntering, isExiting, delay, transitionDuration, onEntered, onExited]);

  if (!isVisible && isExiting) {
    return null;
  }

  const containerStyle = {
    width: '100%',
    height: '100%',
    ...platformAnimation
  };

  return (
    <View 
      style={containerStyle}
      className={`page-transition page-transition-${type} ${className}`}
    >
      {children}
    </View>
  );
};

// 页面过渡包装器 - 用于整个页面
export const PageTransitionWrapper: React.FC<{
  children: ReactNode;
  transitionType?: TransitionType;
  transitionSpeed?: TransitionSpeed;
  isActive?: boolean;
}> = ({
  children,
  transitionType = 'fade',
  transitionSpeed = 'normal',
  isActive = true
}) => {
  return (
    <PageTransition
      type={transitionType}
      speed={transitionSpeed}
      isEntering={isActive}
      isExiting={!isActive}
    >
      {children}
    </PageTransition>
  );
};

// 路由过渡管理器
export const RouteTransitionManager: React.FC<{
  children: ReactNode;
  location: string;
  transitionType?: TransitionType;
}> = ({
  children,
  location,
  transitionType = 'slide-left'
}) => {
  const [currentLocation, setCurrentLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevChildren, setPrevChildren] = useState<ReactNode>(null);
  const [nextChildren, setNextChildren] = useState<ReactNode>(children);

  useEffect(() => {
    if (location !== currentLocation) {
      setIsTransitioning(true);
      setPrevChildren(children);
      setNextChildren(children);
      
      const timer = setTimeout(() => {
        setCurrentLocation(location);
        setIsTransitioning(false);
        setPrevChildren(null);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [location, currentLocation, children]);

  if (isTransitioning && prevChildren) {
    return (
      <View style={{ position: 'relative', width: '100%', height: '100%' }}>
        <PageTransition
          type={transitionType}
          speed="normal"
          isEntering={false}
          isExiting={true}
        >
          {prevChildren}
        </PageTransition>
        <PageTransition
          type={transitionType}
          speed="normal"
          isEntering={true}
          isExiting={false}
          delay={150}
        >
          {nextChildren}
        </PageTransition>
      </View>
    );
  }

  return <>{children}</>;
};

// 平台特定的过渡组件
export const WeappPageTransition: React.FC<PageTransitionProps> = (props) => {
  if (!isWeapp()) return null;
  return <PageTransition {...props} />;
};

export const H5PageTransition: React.FC<PageTransitionProps> = (props) => {
  if (!isH5()) return null;
  return <PageTransition {...props} />;
};

// 过渡钩子
export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionType>('fade');

  const startTransition = (type: TransitionType = 'fade') => {
    setTransitionType(type);
    setIsTransitioning(true);
  };

  const endTransition = () => {
    setIsTransitioning(false);
  };

  return {
    isTransitioning,
    transitionType,
    startTransition,
    endTransition
  };
};

export default PageTransition;