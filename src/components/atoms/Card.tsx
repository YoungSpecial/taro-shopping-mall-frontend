import React from 'react';
import { View, Text } from '@tarojs/components';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  hoverable?: boolean;
  style?: React.CSSProperties;
  className?: string;
  headerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  padding = 'medium',
  shadow = 'sm',
  bordered = true,
  hoverable = false,
  style,
  className,
  headerStyle,
  bodyStyle,
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return '0';
      case 'small':
        return theme.spacing.sm;
      case 'medium':
        return theme.spacing.md;
      case 'large':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  };

  const getShadow = () => {
    switch (shadow) {
      case 'none':
        return 'none';
      case 'sm':
        return theme.shadows.sm;
      case 'md':
        return theme.shadows.md;
      case 'lg':
        return theme.shadows.lg;
      default:
        return theme.shadows.sm;
    }
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: getShadow(),
    border: bordered ? `1px solid ${theme.colors.gray200}` : 'none',
    ...style,
  };

  const headerStyleObj: React.CSSProperties = {
    padding: `${getPadding()} ${getPadding()} ${theme.spacing.sm} ${getPadding()}`,
    borderBottom: title ? `1px solid ${theme.colors.gray200}` : 'none',
    ...headerStyle,
  };

  const bodyStyleObj: React.CSSProperties = {
    padding: title ? getPadding() : getPadding(),
    ...bodyStyle,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray800,
    marginBottom: subtitle ? theme.spacing.xs : 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
  };

  return (
    <View
      style={cardStyle}
      className={className}
      hoverClass={hoverable ? 'card-hover' : ''}
      hoverStyle={hoverable ? { transform: 'translateY(-2px)', boxShadow: theme.shadows.md } : {}}
    >
      {title && (
        <View style={headerStyleObj}>
          <Text style={titleStyle}>{title}</Text>
          {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
        </View>
      )}
      
      <View style={bodyStyleObj}>{children}</View>
    </View>
  );
};

export default Card;