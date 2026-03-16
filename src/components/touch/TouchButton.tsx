import React, { useState, useRef, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { theme } from '../../styles/theme';
import { isWeapp, isH5, platformExecute } from '../../utils/platform';

interface TouchButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  touchFeedback?: boolean;
  longPressDelay?: number;
  rippleEffect?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  touchFeedback = true,
  longPressDelay = 500,
  rippleEffect = true,
  style = {},
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  const sizeStyles = {
    xs: { padding: '4px 8px', fontSize: theme.typography.fontSize.xs, height: '28px' },
    sm: { padding: '6px 12px', fontSize: theme.typography.fontSize.sm, height: '32px' },
    md: { padding: '8px 16px', fontSize: theme.typography.fontSize.md, height: '40px' },
    lg: { padding: '12px 24px', fontSize: theme.typography.fontSize.lg, height: '48px' },
    xl: { padding: '16px 32px', fontSize: theme.typography.fontSize.xl, height: '56px' }
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      border: 'none'
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.white,
      border: 'none'
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      border: `1px solid ${theme.colors.primary}`
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.gray700,
      border: 'none'
    },
    danger: {
      backgroundColor: theme.colors.danger,
      color: theme.colors.white,
      border: 'none'
    }
  };

  const disabledStyles = disabled ? {
    opacity: 0.5,
    cursor: 'not-allowed'
  } : {};

  const pressedStyles = isPressed && touchFeedback && !disabled ? {
    transform: 'scale(0.95)',
    opacity: 0.8
  } : {};

  // 平台特定的触摸反馈
  const platformTouchStyles = platformExecute({
    weapp: () => ({
      // 微信小程序：优化触摸反馈
      transition: 'all 0.15s ease',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent'
    }),
    h5: () => ({
      // H5：完整的触摸反馈
      transition: 'all 0.15s ease',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
      WebkitTouchCallout: 'none'
    }),
    default: () => ({})
  });

  const handlePressStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    
    // 添加涟漪效果
    if (rippleEffect && isH5() && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
      
      const newRipple = { x, y, id: rippleIdRef.current++ };
      setRipples(prev => [...prev, newRipple]);
      
      // 自动移除涟漪
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }
    
    // 长按检测
    pressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      // 可以在这里触发长按事件
      console.log('长按触发');
    }, longPressDelay);
  };

  const handlePressEnd = () => {
    if (disabled || loading) return;
    
    setIsPressed(false);
    
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    
    if (!isLongPress) {
      onPress();
    }
    
    setIsLongPress(false);
  };

  const handlePressCancel = () => {
    setIsPressed(false);
    setIsLongPress(false);
    
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.typography.fontWeight.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...disabledStyles,
    ...pressedStyles,
    ...platformTouchStyles,
    ...style
  };

  return (
    <View
      ref={buttonRef}
      style={buttonStyle}
      className={`touch-button touch-button-${variant} ${className}`}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressCancel}
      onMouseDown={isH5() ? handlePressStart : undefined}
      onMouseUp={isH5() ? handlePressEnd : undefined}
      onMouseLeave={isH5() ? handlePressCancel : undefined}
    >
      {/* 加载状态 */}
      {loading && (
        <View style={{
          marginRight: iconPosition === 'left' ? '8px' : 0,
          marginLeft: iconPosition === 'right' ? '8px' : 0
        }}>
          <View style={{
            width: '16px',
            height: '16px',
            border: `2px solid ${variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.white}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </View>
      )}
      
      {/* 图标 */}
      {!loading && icon && iconPosition === 'left' && (
        <View style={{ marginRight: '8px' }}>
          {icon}
        </View>
      )}
      
      {/* 文本内容 */}
      <Text style={{
        fontSize: sizeStyles[size].fontSize,
        color: variantStyles[variant].color,
        fontWeight: theme.typography.fontWeight.medium
      }}>
        {children}
      </Text>
      
      {/* 图标 */}
      {!loading && icon && iconPosition === 'right' && (
        <View style={{ marginLeft: '8px' }}>
          {icon}
        </View>
      )}
      
      {/* 涟漪效果 (仅H5) */}
      {rippleEffect && isH5() && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          {ripples.map(ripple => (
            <View
              key={ripple.id}
              style={{
                position: 'absolute',
                top: ripple.y,
                left: ripple.x,
                width: '0',
                height: '0',
                borderRadius: '50%',
                backgroundColor: variant === 'outline' || variant === 'ghost' 
                  ? `${theme.colors.primary}20` 
                  : `${theme.colors.white}40`,
                transform: 'translate(-50%, -50%)',
                animation: 'ripple 0.6s ease-out'
              }}
            />
          ))}
        </View>
      )}
      
      {/* 长按指示器 */}
      {isLongPress && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `${theme.colors.primary}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: variantStyles[variant].color,
            fontWeight: theme.typography.fontWeight.bold
          }}>
            长按中...
          </Text>
        </View>
      )}
    </View>
  );
};

// 平台特定的按钮变体
export const WeappTouchButton: React.FC<TouchButtonProps> = (props) => {
  if (!isWeapp()) return null;
  return <TouchButton {...props} />;
};

export const H5TouchButton: React.FC<TouchButtonProps> = (props) => {
  if (!isH5()) return null;
  return <TouchButton {...props} />;
};

// 浮动操作按钮 (FAB)
export const FloatingActionButton: React.FC<{
  icon: React.ReactNode;
  onPress: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}> = ({
  icon,
  onPress,
  position = 'bottom-right',
  size = 'md',
  color = theme.colors.primary
}) => {
  const sizeMap = {
    sm: { width: '48px', height: '48px', iconSize: '20px' },
    md: { width: '56px', height: '56px', iconSize: '24px' },
    lg: { width: '64px', height: '64px', iconSize: '28px' }
  };

  const positionMap = {
    'bottom-right': { bottom: '24px', right: '24px' },
    'bottom-left': { bottom: '24px', left: '24px' },
    'top-right': { top: '24px', right: '24px' },
    'top-left': { top: '24px', left: '24px' }
  };

  return (
    <TouchButton
      onPress={onPress}
      variant="primary"
      size="md"
      style={{
        position: 'fixed',
        ...positionMap[position],
        width: sizeMap[size].width,
        height: sizeMap[size].height,
        borderRadius: '50%',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      rippleEffect={true}
      touchFeedback={true}
    >
      {icon}
    </TouchButton>
  );
};

// 开关按钮
export const ToggleButton: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}> = ({ checked, onChange, size = 'md', disabled = false }) => {
  const sizeMap = {
    sm: { width: '40px', height: '24px', knobSize: '20px' },
    md: { width: '48px', height: '28px', knobSize: '24px' },
    lg: { width: '56px', height: '32px', knobSize: '28px' }
  };

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <TouchButton
      onPress={handleToggle}
      variant="ghost"
      style={{
        width: sizeMap[size].width,
        height: sizeMap[size].height,
        padding: 0,
        borderRadius: sizeMap[size].height,
        backgroundColor: checked ? theme.colors.primary : theme.colors.gray300,
        position: 'relative',
        transition: 'background-color 0.3s ease'
      }}
      disabled={disabled}
      touchFeedback={false}
    >
      <View
        style={{
          position: 'absolute',
          top: '2px',
          left: checked ? `calc(100% - ${sizeMap[size].knobSize} - 2px)` : '2px',
          width: sizeMap[size].knobSize,
          height: sizeMap[size].knobSize,
          borderRadius: '50%',
          backgroundColor: theme.colors.white,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          transition: 'left 0.3s ease'
        }}
      />
    </TouchButton>
  );
};

export default TouchButton;