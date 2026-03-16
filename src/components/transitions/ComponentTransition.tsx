import React, { useState, useEffect, ReactNode } from 'react';
import { View } from '@tarojs/components';
import { theme } from '../../styles/theme';
import { isWeapp, isH5, platformExecute } from '../../utils/platform';

export type ComponentTransitionType = 
  | 'fade' 
  | 'scale' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right'
  | 'bounce'
  | 'pulse'
  | 'shake'
  | 'flip'
  | 'rotate';

export type ComponentTransitionTrigger = 
  | 'mount' 
  | 'hover' 
  | 'click' 
  | 'visible'
  | 'custom';

interface ComponentTransitionProps {
  children: ReactNode;
  type?: ComponentTransitionType;
  trigger?: ComponentTransitionTrigger;
  duration?: number;
  delay?: number;
  repeat?: number | 'infinite';
  threshold?: number; // 用于visible触发
  className?: string;
  style?: React.CSSProperties;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

const ComponentTransition: React.FC<ComponentTransitionProps> = ({
  children,
  type = 'fade',
  trigger = 'mount',
  duration = 300,
  delay = 0,
  repeat = 1,
  threshold = 0.1,
  className = '',
  style = {},
  onAnimationStart,
  onAnimationEnd
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationCount, setAnimationCount] = useState(0);
  const observerRef = React.useRef<IntersectionObserver>();

  // 平台特定的动画样式
  const getAnimationStyle = platformExecute({
    weapp: () => {
      // 微信小程序：简化动画，性能优先
      const baseStyle = {
        transition: `all ${duration}ms ease`,
        transitionDelay: `${delay}ms`
      };

      switch (type) {
        case 'fade':
          return {
            ...baseStyle,
            opacity: isVisible ? 1 : 0
          };
        case 'scale':
          return {
            ...baseStyle,
            transform: `scale(${isVisible ? 1 : 0.8})`,
            opacity: isVisible ? 1 : 0
          };
        case 'slide-up':
          return {
            ...baseStyle,
            transform: `translateY(${isVisible ? '0' : '20px'})`,
            opacity: isVisible ? 1 : 0
          };
        case 'slide-down':
          return {
            ...baseStyle,
            transform: `translateY(${isVisible ? '0' : '-20px'})`,
            opacity: isVisible ? 1 : 0
          };
        case 'slide-left':
          return {
            ...baseStyle,
            transform: `translateX(${isVisible ? '0' : '20px'})`,
            opacity: isVisible ? 1 : 0
          };
        case 'slide-right':
          return {
            ...baseStyle,
            transform: `translateX(${isVisible ? '0' : '-20px'})`,
            opacity: isVisible ? 1 : 0
          };
        case 'bounce':
          return {
            ...baseStyle,
            transform: `scale(${isVisible ? 1 : 0.8})`,
            opacity: isVisible ? 1 : 0
          };
        default:
          return baseStyle;
      }
    },
    h5: () => {
      // H5：支持完整动画特性
      const baseStyle = {
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity',
        animationIterationCount: repeat === 'infinite' ? 'infinite' : repeat,
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`
      };

      switch (type) {
        case 'fade':
          return {
            ...baseStyle,
            opacity: isVisible ? 1 : 0,
            animation: isAnimating ? `fadeIn ${duration}ms ease ${delay}ms` : 'none'
          };
        case 'scale':
          return {
            ...baseStyle,
            transform: `scale(${isVisible ? 1 : 0.8})`,
            opacity: isVisible ? 1 : 0,
            animation: isAnimating ? `scaleIn ${duration}ms ease ${delay}ms` : 'none'
          };
        case 'slide-up':
          return {
            ...baseStyle,
            transform: `translateY(${isVisible ? '0' : '20px'})`,
            opacity: isVisible ? 1 : 0,
            animation: isAnimating ? `slideUp ${duration}ms ease ${delay}ms` : 'none'
          };
        case 'slide-down':
          return {
            ...baseStyle,
            transform: `translateY(${isVisible ? '0' : '-20px'})`,
            opacity: isVisible ? 1 : 0,
            animation: isAnimating ? `slideDown ${duration}ms ease ${delay}ms` : 'none'
          };
        case 'slide-left':
          return {
            ...baseStyle,
            transform: `translateX(${isVisible ? '0' : '20px'})`,
            opacity: isVisible ? 1 : 0,
            animation: isAnimating ? `slideLeft ${duration}ms ease ${delay}ms` : 'none'
          };
        case 'slide-right':
          return {
            ...baseStyle,
            transform: `translateX(${isVisible ? '0' : '-20px'})`,
            opacity: isVisible ? 1 : 0,
            animation: isAnimating ? `slideRight ${duration}ms ease ${delay}ms` : 'none'
          };
        case 'bounce':
          return {
            ...baseStyle,
            animation: isAnimating ? `bounce ${duration}ms ease ${delay}ms` : 'none'
          };
        case 'pulse':
          return {
            ...baseStyle,
            animation: isAnimating ? `pulse ${duration}ms ease ${delay}ms` : 'none'
          };
        case 'shake':
          return {
            ...baseStyle,
            animation: isAnimating ? `shake ${duration}ms ease ${delay}ms` : 'none'
          };
        case 'flip':
          return {
            ...baseStyle,
            transformStyle: 'preserve-3d',
            animation: isAnimating ? `flip ${duration}ms ease ${delay}ms` : 'none'
          };
        case 'rotate':
          return {
            ...baseStyle,
            animation: isAnimating ? `rotate ${duration}ms linear ${delay}ms` : 'none'
          };
        default:
          return baseStyle;
      }
    },
    default: () => ({})
  });

  // 处理动画触发
  useEffect(() => {
    if (trigger === 'mount') {
      setIsVisible(true);
      setIsAnimating(true);
      onAnimationStart?.();
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationEnd?.();
      }, duration + delay);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, duration, delay, onAnimationStart, onAnimationEnd]);

  // 处理可见性触发（仅H5）
  useEffect(() => {
    if (trigger === 'visible' && isH5()) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              setIsAnimating(true);
              onAnimationStart?.();
              
              const timer = setTimeout(() => {
                setIsAnimating(false);
                onAnimationEnd?.();
                observer.unobserve(entry.target);
              }, duration + delay);
              
              return () => clearTimeout(timer);
            }
          });
        },
        {
          threshold,
          rootMargin: '50px'
        }
      );

      const current = observerRef.current;
      return () => {
        if (current) {
          current.disconnect();
        }
      };
    }
  }, [trigger, threshold, duration, delay, onAnimationStart, onAnimationEnd]);

  // 处理重复动画
  useEffect(() => {
    if (isAnimating && repeat !== 1 && repeat !== 'infinite') {
      if (animationCount < repeat - 1) {
        const timer = setTimeout(() => {
          setIsAnimating(false);
          setTimeout(() => {
            setIsAnimating(true);
            setAnimationCount(prev => prev + 1);
          }, 100);
        }, duration + delay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isAnimating, animationCount, repeat, duration, delay]);

  const handleClick = () => {
    if (trigger === 'click') {
      setIsAnimating(true);
      onAnimationStart?.();
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationEnd?.();
      }, duration + delay);
      
      return () => clearTimeout(timer);
    }
  };

  const handleHover = () => {
    if (trigger === 'hover' && isH5()) {
      setIsAnimating(true);
      onAnimationStart?.();
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationEnd?.();
      }, duration + delay);
      
      return () => clearTimeout(timer);
    }
  };

  const containerStyle = {
    ...getAnimationStyle,
    ...style
  };

  return (
    <View
      style={containerStyle}
      className={`component-transition component-transition-${type} ${className}`}
      onClick={handleClick}
      onMouseEnter={isH5() ? handleHover : undefined}
      onMouseLeave={isH5() ? () => setIsAnimating(false) : undefined}
      ref={(node) => {
        if (node && trigger === 'visible' && isH5()) {
          observerRef.current?.observe(node);
        }
      }}
    >
      {children}
    </View>
  );
};

// 卡片过渡效果
export const CardTransition: React.FC<{
  children: ReactNode;
  hoverEffect?: boolean;
  clickEffect?: boolean;
}> = ({ children, hoverEffect = true, clickEffect = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseEnter = () => {
    if (hoverEffect && isH5()) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverEffect && isH5()) {
      setIsHovered(false);
    }
  };

  const handleClick = () => {
    if (clickEffect) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    }
  };

  const cardStyle = {
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: isHovered 
      ? '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)'
      : '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    transform: isClicked ? 'scale(0.98)' : (isHovered ? 'translateY(-4px)' : 'translateY(0)')
  };

  return (
    <View
      style={cardStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </View>
  );
};

// 按钮过渡效果
export const ButtonTransition: React.FC<{
  children: ReactNode;
  type?: 'scale' | 'bounce' | 'pulse';
}> = ({ children, type = 'scale' }) => {
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyle = {
    transition: 'all 0.15s ease',
    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
    opacity: isPressed ? 0.9 : 1
  };

  return (
    <View
      style={buttonStyle}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={isH5() ? () => setIsPressed(true) : undefined}
      onMouseUp={isH5() ? () => setIsPressed(false) : undefined}
      onMouseLeave={isH5() ? () => setIsPressed(false) : undefined}
    >
      {children}
    </View>
  );
};

// 列表项过渡效果
export const ListItemTransition: React.FC<{
  children: ReactNode;
  index: number;
  staggerDelay?: number;
}> = ({ children, index, staggerDelay = 50 }) => {
  return (
    <ComponentTransition
      type="slide-up"
      trigger="mount"
      delay={index * staggerDelay}
      duration={300}
    >
      {children}
    </ComponentTransition>
  );
};

// 图片加载过渡效果
export const ImageTransition: React.FC<{
  children: ReactNode;
  loaded: boolean;
}> = ({ children, loaded }) => {
  const imageStyle = {
    transition: 'all 0.5s ease',
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'scale(1)' : 'scale(0.95)',
    filter: loaded ? 'blur(0)' : 'blur(10px)'
  };

  return (
    <View style={imageStyle}>
      {children}
    </View>
  );
};

// 平台特定的组件过渡
export const WeappComponentTransition: React.FC<ComponentTransitionProps> = (props) => {
  if (!isWeapp()) return null;
  return <ComponentTransition {...props} />;
};

export const H5ComponentTransition: React.FC<ComponentTransitionProps> = (props) => {
  if (!isH5()) return null;
  return <ComponentTransition {...props} />;
};

export default ComponentTransition;