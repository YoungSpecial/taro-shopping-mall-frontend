import React from 'react';
import { View, Text } from '@tarojs/components';
import { theme } from '../../styles/theme';

type IconName = 
  | 'home' | 'cart' | 'search' | 'heart' | 'user' | 'menu' | 'close' | 'arrow-left'
  | 'arrow-right' | 'arrow-up' | 'arrow-down' | 'plus' | 'minus' | 'check' | 'info'
  | 'warning' | 'error' | 'success' | 'star' | 'star-filled' | 'filter' | 'sort'
  | 'trash' | 'edit' | 'share' | 'download' | 'upload' | 'settings' | 'bell'
  | 'clock' | 'truck' | 'package' | 'wechat' | 'alipay' | 'creditcard' | 'bank';

interface IconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color,
  onClick,
  style,
  className,
}) => {
  const getSize = () => {
    switch (size) {
      case 'xs':
        return '16px';
      case 'sm':
        return '20px';
      case 'md':
        return '24px';
      case 'lg':
        return '32px';
      case 'xl':
        return '40px';
      default:
        return '24px';
    }
  };

  const getIconContent = () => {
    const iconMap: Record<IconName, string> = {
      'home': '🏠',
      'cart': '🛒',
      'search': '🔍',
      'heart': '❤️',
      'user': '👤',
      'menu': '☰',
      'close': '×',
      'arrow-left': '←',
      'arrow-right': '→',
      'arrow-up': '↑',
      'arrow-down': '↓',
      'plus': '+',
      'minus': '-',
      'check': '✓',
      'info': 'ℹ️',
      'warning': '⚠️',
      'error': '❌',
      'success': '✅',
      'star': '☆',
      'star-filled': '★',
      'filter': '⚙️',
      'sort': '⇅',
      'trash': '🗑️',
      'edit': '✏️',
      'share': '↗️',
      'download': '⤓',
      'upload': '⤒',
       'settings': '⚙️',
      'bell': '🔔',
      'clock': '🕒',
      'truck': '🚚',
      'package': '📦',
      'wechat': '💬',
      'alipay': '💰',
      'creditcard': '💳',
      'bank': '🏦',
    };

    return iconMap[name] || '?';
  };

  const iconStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: getSize(),
    color: color || theme.colors.gray700,
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
    ...style,
  };

  return (
    <View
      style={iconStyle}
      onClick={onClick}
      className={className}
      hoverClass={onClick ? 'icon-hover' : ''}
      hoverStyle={onClick ? { opacity: 0.7 } : {}}
    >
      <Text>{getIconContent()}</Text>
    </View>
  );
};

export default Icon;