import React from 'react';
import { View, Text } from '@tarojs/components';
import { theme } from '../../styles/theme';
import { isWeapp, isH5, platformExecute } from '../../utils/platform';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  text?: string;
  textPosition?: 'top' | 'bottom' | 'right' | 'left';
  fullScreen?: boolean;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color,
  text,
  textPosition = 'bottom',
  fullScreen = false,
  overlay = false
}) => {
  const sizeMap = {
    xs: { spinner: 16, border: 2 },
    sm: { spinner: 24, border: 3 },
    md: { spinner: 32, border: 4 },
    lg: { spinner: 48, border: 5 },
    xl: { spinner: 64, border: 6 }
  };

  const { spinner: spinnerSize, border: borderWidth } = sizeMap[size];
  const spinnerColor = color || theme.colors.primary;

  // 平台特定的动画
  const platformAnimation = platformExecute({
    weapp: () => ({
      animation: 'spin 1s linear infinite',
      transformOrigin: 'center center'
    }),
    h5: () => ({
      animation: 'spin 1s linear infinite',
      transformOrigin: 'center center'
    }),
    default: () => ({
      animation: 'spin 1s linear infinite',
      transformOrigin: 'center center'
    })
  });

  const spinner = (
    <View
      style={{
        width: spinnerSize,
        height: spinnerSize,
        border: `${borderWidth}px solid ${theme.colors.gray200}`,
        borderTopColor: spinnerColor,
        borderRadius: '50%',
        ...platformAnimation
      }}
    />
  );

  const content = text ? (
    <View
      style={{
        display: 'flex',
        flexDirection: textPosition === 'top' || textPosition === 'bottom' ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm
      }}
    >
      {(textPosition === 'top' || textPosition === 'left') && (
        <Text
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600,
            textAlign: 'center'
          }}
        >
          {text}
        </Text>
      )}
      
      {spinner}
      
      {(textPosition === 'bottom' || textPosition === 'right') && (
        <Text
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600,
            textAlign: 'center'
          }}
        >
          {text}
        </Text>
      )}
    </View>
  ) : spinner;

  if (fullScreen) {
    return (
      <View
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: overlay ? 'rgba(255, 255, 255, 0.9)' : theme.colors.white,
          zIndex: 1000
        }}
      >
        {content}
      </View>
    );
  }

  if (overlay) {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 100
        }}
      >
        {content}
      </View>
    );
  }

  return content;
};

// 平台特定的加载器变体
export const WeappLoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => {
  if (!isWeapp()) return null;
  return <LoadingSpinner {...props} />;
};

export const H5LoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => {
  if (!isH5()) return null;
  return <LoadingSpinner {...props} />;
};

// 进度条加载器
export const ProgressBar: React.FC<{
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  animated?: boolean;
}> = ({
  progress,
  height = 8,
  color = theme.colors.primary,
  backgroundColor = theme.colors.gray200,
  showPercentage = false,
  animated = true
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          width: '100%',
          height,
          backgroundColor,
          borderRadius: height / 2,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <View
          style={{
            width: `${clampedProgress}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: height / 2,
            transition: animated ? 'width 0.3s ease-in-out' : 'none',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {animated && clampedProgress > 0 && clampedProgress < 100 && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                animation: 'shimmer 1.5s infinite'
              }}
            />
          )}
        </View>
      </View>
      
      {showPercentage && (
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: theme.spacing.xs
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.gray600
            }}
          >
            加载中...
          </Text>
          <Text
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.gray600,
              fontWeight: theme.typography.fontWeight.medium
            }}
          >
            {clampedProgress}%
          </Text>
        </View>
      )}
    </View>
  );
};

// 骨架屏文本
export const SkeletonText: React.FC<{
  lines?: number;
  width?: string | number;
  height?: string | number;
  variant?: 'title' | 'body' | 'caption';
}> = ({ lines = 1, width = '100%', height, variant = 'body' }) => {
  const heightMap = {
    title: '24px',
    body: '16px',
    caption: '12px'
  };

  const lineHeight = height || heightMap[variant];
  const lineSpacing = variant === 'title' ? '8px' : '4px';

  return (
    <View style={{ width: '100%' }}>
      {Array.from({ length: lines }, (_, index) => (
        <View
          key={index}
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: lineHeight,
            backgroundColor: theme.colors.gray200,
            borderRadius: '4px',
            marginBottom: index < lines - 1 ? lineSpacing : 0,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              animation: 'shimmer 1.5s infinite'
            }}
          />
        </View>
      ))}
    </View>
  );
};

// 骨架屏矩形
export const SkeletonRect: React.FC<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}> = ({ width = '100%', height = '100px', borderRadius = '8px' }) => {
  return (
    <View
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        backgroundColor: theme.colors.gray200,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          animation: 'shimmer 1.5s infinite'
        }}
      />
    </View>
  );
};

// 骨架屏圆形
export const SkeletonCircle: React.FC<{
  size?: number;
}> = ({ size = 40 }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: theme.colors.gray200,
        borderRadius: '50%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          animation: 'shimmer 1.5s infinite'
        }}
      />
    </View>
  );
};

export default LoadingSpinner;