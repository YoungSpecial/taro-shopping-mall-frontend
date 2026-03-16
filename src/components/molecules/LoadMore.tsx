import React, { useEffect, useRef } from 'react';
import { View, Text } from '@tarojs/components';
import { theme } from '../../styles/theme';
import Icon from '../atoms/Icon';

interface LoadMoreProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingText?: string;
  noMoreText?: string;
  loadMoreText?: string;
  style?: React.CSSProperties;
  mode?: 'button' | 'auto' | 'infinite';
  threshold?: number; // 触发自动加载的阈值（像素）
}

const LoadMore: React.FC<LoadMoreProps> = ({
  loading,
  hasMore,
  onLoadMore,
  loadingText = '加载中...',
  noMoreText = '没有更多了',
  loadMoreText = '加载更多',
  style,
  mode = 'button',
  threshold = 100,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (mode !== 'auto' && mode !== 'infinite') return;

    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;

      // 防止重复触发
      if (Math.abs(scrollTop - lastScrollY.current) < 50) return;
      lastScrollY.current = scrollTop;

      // 检查是否接近底部
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        onLoadMore();
      }
    };

    // 对于'infinite'模式，添加滚动监听
    if (mode === 'infinite') {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      
      // 初始检查
      setTimeout(handleScroll, 100);
    }

    return () => {
      if (mode === 'infinite') {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      }
    };
  }, [loading, hasMore, onLoadMore, mode, threshold]);

  if (!hasMore) {
    return (
      <View style={{
        padding: theme.spacing.lg,
        textAlign: 'center',
        ...style,
      }}>
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray500,
        }}>
          {noMoreText}
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{
        padding: theme.spacing.lg,
        textAlign: 'center',
        ...style,
      }}>
        <View style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.sm,
        }}>
          <Icon name="arrow-down" size="sm" color={theme.colors.primary} />
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.primary,
          }}>
            {loadingText}
          </Text>
        </View>
      </View>
    );
  }

  // 对于'auto'模式，不显示按钮，只监听滚动
  if (mode === 'auto') {
    return (
      <View 
        ref={containerRef}
        style={{
          padding: theme.spacing.lg,
          textAlign: 'center',
          ...style,
        }}
      >
        <Text style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.gray400,
        }}>
          滚动加载更多
        </Text>
      </View>
    );
  }

  // 默认'button'模式
  return (
    <View style={{
      padding: theme.spacing.lg,
      textAlign: 'center',
      ...style,
    }}>
      <View
        onClick={onLoadMore}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.sm,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.gray300}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        hoverClass="load-more-hover"
        hoverStyle={{
          backgroundColor: theme.colors.gray50,
          borderColor: theme.colors.primary,
          transform: 'translateY(-1px)',
        }}
      >
        <Icon name="arrow-down" size="sm" color={theme.colors.primary} />
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.primary,
          fontWeight: theme.typography.fontWeight.medium,
        }}>
          {loadMoreText}
        </Text>
      </View>
    </View>
  );
};

export default LoadMore;