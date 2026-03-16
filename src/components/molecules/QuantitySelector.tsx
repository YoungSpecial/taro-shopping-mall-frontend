import React, { useState, useEffect } from 'react';
import { View, Text, Input } from '@tarojs/components';
import { theme } from '../../styles/theme';
import Icon from '../atoms/Icon';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'compact' | 'outline';
  showLabel?: boolean;
  label?: string;
  disabled?: boolean;
  showStock?: boolean;
  stock?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  min = 1,
  max = 99,
  step = 1,
  onChange,
  size = 'medium',
  variant = 'default',
  showLabel = true,
  label = '数量',
  disabled = false,
  showStock = false,
  stock,
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);

  // 同步外部value变化
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          buttonSize: '28px',
          fontSize: theme.typography.fontSize.sm,
          inputWidth: '40px',
        };
      case 'large':
        return {
          buttonSize: '44px',
          fontSize: theme.typography.fontSize.lg,
          inputWidth: '60px',
        };
      default: // medium
        return {
          buttonSize: '36px',
          fontSize: theme.typography.fontSize.md,
          inputWidth: '50px',
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          buttonBg: theme.colors.gray100,
          buttonBorder: theme.colors.gray300,
          buttonColor: theme.colors.gray700,
          inputBg: 'transparent',
          inputBorder: 'none',
          inputColor: theme.colors.gray800,
        };
      case 'outline':
        return {
          buttonBg: 'transparent',
          buttonBorder: theme.colors.primary,
          buttonColor: theme.colors.primary,
          inputBg: 'transparent',
          inputBorder: `1px solid ${theme.colors.gray300}`,
          inputColor: theme.colors.gray800,
        };
      default:
        return {
          buttonBg: theme.colors.primary,
          buttonBorder: theme.colors.primary,
          buttonColor: theme.colors.white,
          inputBg: theme.colors.white,
          inputBorder: `1px solid ${theme.colors.gray300}`,
          inputColor: theme.colors.gray800,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const handleDecrease = () => {
    if (disabled) return;
    const newValue = Math.max(min, value - step);
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleIncrease = () => {
    if (disabled) return;
    const newValue = Math.min(max, value + step);
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: any) => {
    const newValue = e.detail.value;
    setInputValue(newValue);
    
    // 只允许数字
    if (/^\d*$/.test(newValue)) {
      const numValue = parseInt(newValue, 10);
      if (!isNaN(numValue)) {
        const clampedValue = Math.max(min, Math.min(max, numValue));
        if (clampedValue !== value) {
          onChange(clampedValue);
        }
      }
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    let numValue = parseInt(inputValue, 10);
    
    if (isNaN(numValue) || numValue < min) {
      numValue = min;
    } else if (numValue > max) {
      numValue = max;
    }
    
    setInputValue(numValue.toString());
    if (numValue !== value) {
      onChange(numValue);
    }
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const isMin = value <= min;
  const isMax = value >= max;
  const isStockLimited = showStock && stock !== undefined && stock > 0;
  const effectiveMax = isStockLimited ? Math.min(max, stock) : max;

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm,
    }}>
      {/* 标签和库存信息 */}
      <View style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {showLabel && (
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: disabled ? theme.colors.gray500 : theme.colors.gray700,
          }}>
            {label}
          </Text>
        )}
        
        {showStock && stock !== undefined && (
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: stock > 0 ? theme.colors.success : theme.colors.danger,
          }}>
            {stock > 0 ? `库存: ${stock}` : '缺货'}
          </Text>
        )}
      </View>

      {/* 数量选择器 */}
      <View style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
      }}>
        {/* 减少按钮 */}
        <View
          onClick={handleDecrease}
          style={{
            width: sizeStyles.buttonSize,
            height: sizeStyles.buttonSize,
            borderRadius: '50%',
            backgroundColor: isMin || disabled ? theme.colors.gray200 : variantStyles.buttonBg,
            border: `1px solid ${isMin || disabled ? theme.colors.gray300 : variantStyles.buttonBorder}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: isMin || disabled ? 'not-allowed' : 'pointer',
            opacity: isMin || disabled ? 0.5 : 1,
            transition: 'all 0.2s ease',
            userSelect: 'none',
          }}
          hoverClass={!isMin && !disabled ? "quantity-button-hover" : undefined}
          hoverStyle={!isMin && !disabled ? {
            transform: 'scale(1.05)',
            boxShadow: theme.shadows.sm,
          } : undefined}
        >
          <Icon 
            name="minus" 
            size={size === 'small' ? 'xs' : size === 'large' ? 'md' : 'sm'} 
            color={isMin || disabled ? theme.colors.gray500 : variantStyles.buttonColor}
          />
        </View>

        {/* 数量显示/输入 */}
        <View style={{
          position: 'relative',
          width: sizeStyles.inputWidth,
        }}>
          <Text
            style={{
              width: '100%',
              height: sizeStyles.buttonSize,
              fontSize: sizeStyles.fontSize,
              fontWeight: theme.typography.fontWeight.medium,
              color: variantStyles.inputColor,
              textAlign: 'center',
              lineHeight: sizeStyles.buttonSize,
              backgroundColor: variantStyles.inputBg,
              border: variantStyles.inputBorder,
              borderRadius: theme.borderRadius.md,
              outline: 'none',
              userSelect: 'none',
            }}
            onClick={() => !disabled && setIsEditing(true)}
          >
            {value}
          </Text>
          
          {/* 编辑模式输入框 */}
          {isEditing && !disabled && (
             <Input
              type="number"
              value={inputValue.toString()}
              onInput={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              focus={isEditing}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: sizeStyles.buttonSize,
                fontSize: sizeStyles.fontSize,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.gray800,
                textAlign: 'center',
                backgroundColor: theme.colors.white,
                border: `1px solid ${theme.colors.primary}`,
                borderRadius: theme.borderRadius.sm,
                outline: 'none',
                boxSizing: 'border-box',
                zIndex: 1
              }}
            />
          )}
        </View>

        {/* 增加按钮 */}
        <View
          onClick={handleIncrease}
          style={{
            width: sizeStyles.buttonSize,
            height: sizeStyles.buttonSize,
            borderRadius: '50%',
            backgroundColor: isMax || disabled ? theme.colors.gray200 : variantStyles.buttonBg,
            border: `1px solid ${isMax || disabled ? theme.colors.gray300 : variantStyles.buttonBorder}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: isMax || disabled ? 'not-allowed' : 'pointer',
            opacity: isMax || disabled ? 0.5 : 1,
            transition: 'all 0.2s ease',
            userSelect: 'none',
          }}
          hoverClass={!isMax && !disabled ? "quantity-button-hover" : undefined}
          hoverStyle={!isMax && !disabled ? {
            transform: 'scale(1.05)',
            boxShadow: theme.shadows.sm,
          } : undefined}
        >
          <Icon 
            name="plus" 
            size={size === 'small' ? 'xs' : size === 'large' ? 'md' : 'sm'} 
            color={isMax || disabled ? theme.colors.gray500 : variantStyles.buttonColor}
          />
        </View>
      </View>

      {/* 范围提示 */}
      <View style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.gray500,
        }}>
          最少 {min} 件
        </Text>
        
        <Text style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.gray500,
        }}>
          最多 {effectiveMax} 件
        </Text>
      </View>

      {/* 库存不足提示 */}
      {isStockLimited && value > stock! && (
        <View style={{
          padding: theme.spacing.sm,
          backgroundColor: theme.colors.warning + '20',
          borderRadius: theme.borderRadius.sm,
          border: `1px solid ${theme.colors.warning}`,
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.warning,
            textAlign: 'center',
          }}>
            库存仅剩 {stock} 件，请调整数量
          </Text>
        </View>
      )}

      {/* 禁用状态提示 */}
      {disabled && (
        <View style={{
          padding: theme.spacing.sm,
          backgroundColor: theme.colors.gray100,
          borderRadius: theme.borderRadius.sm,
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.gray600,
            textAlign: 'center',
          }}>
            当前不可选择数量
          </Text>
        </View>
      )}
    </View>
  );
};

export default QuantitySelector;