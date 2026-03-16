import React from 'react';
import { View, Text } from '@tarojs/components';
import { theme } from '../../styles/theme';


type EmptyStateType = 'no-products' | 'no-search-results' | 'no-favorites' | 'no-orders' | 'error' | 'loading';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  showIcon?: boolean;
  style?: React.CSSProperties;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-products',
  title,
  description,
  actionText,
  onAction,
  showIcon = true,
  style,
}) => {
  const getConfig = () => {
    const configs = {
      'no-products': {
        icon: '🛒',
        defaultTitle: '暂无商品',
        defaultDescription: '当前分类下没有商品，请尝试其他分类',
        defaultActionText: '浏览所有商品',
      },
      'no-search-results': {
        icon: '🔍',
        defaultTitle: '未找到相关商品',
        defaultDescription: '请尝试其他搜索关键词或筛选条件',
        defaultActionText: '清除搜索',
      },
      'no-favorites': {
        icon: '❤️',
        defaultTitle: '暂无收藏',
        defaultDescription: '您还没有收藏任何商品',
        defaultActionText: '去逛逛',
      },
      'no-orders': {
        icon: '📦',
        defaultTitle: '暂无订单',
        defaultDescription: '您还没有任何订单记录',
        defaultActionText: '去购物',
      },
      'error': {
        icon: '❌',
        defaultTitle: '加载失败',
        defaultDescription: '网络似乎出了点问题，请稍后重试',
        defaultActionText: '重试',
      },
      'loading': {
        icon: '⏳',
        defaultTitle: '加载中...',
        defaultDescription: '正在努力加载数据',
        defaultActionText: '',
      },
    };

    return configs[type] || configs['no-products'];
  };

  const config = getConfig();

  return (
    <View style={{
      padding: theme.spacing.xxl,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      ...style,
    }}>
      {showIcon && (
        <View style={{
          width: '80px',
          height: '80px',
          borderRadius: '40px',
          backgroundColor: theme.colors.gray100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: theme.spacing.lg,
        }}>
          <Text style={{ fontSize: '32px' }}>
            {config.icon}
          </Text>
        </View>
      )}

      <Text style={{
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.medium,
        color: theme.colors.gray800,
        marginBottom: theme.spacing.sm,
      }}>
        {title || config.defaultTitle}
      </Text>

      <Text style={{
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.gray600,
        lineHeight: '1.5',
        maxWidth: '280px',
        marginBottom: theme.spacing.lg,
      }}>
        {description || config.defaultDescription}
      </Text>

      {onAction && actionText && (
        <View
          onClick={onAction}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          hoverClass="empty-state-action-hover"
          hoverStyle={{
            backgroundColor: theme.colors.primaryDark,
            transform: 'translateY(-1px)',
          }}
        >
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.white,
            fontWeight: theme.typography.fontWeight.medium,
          }}>
            {actionText || config.defaultActionText}
          </Text>
        </View>
      )}

      {type === 'loading' && (
        <View style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: theme.spacing.lg,
        }}>
          <View style={{
            width: '20px',
            height: '20px',
            borderRadius: '10px',
            border: `2px solid ${theme.colors.gray300}`,
            borderTopColor: theme.colors.primary,
            animation: 'spin 1s linear infinite',
            marginRight: theme.spacing.sm,
          }} />
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600,
          }}>
            请稍候...
          </Text>
        </View>
      )}
    </View>
  );
};

export default EmptyState;