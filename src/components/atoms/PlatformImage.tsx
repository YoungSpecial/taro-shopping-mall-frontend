import React, { useState, useEffect } from 'react';
import { Image as TaroImage, View } from '@tarojs/components';
import { isWeapp, isH5, platformExecute } from '../../utils/platform';
import { theme } from '../../styles/theme';

interface PlatformImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix';
  lazyLoad?: boolean;
  placeholder?: string;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

const PlatformImage: React.FC<PlatformImageProps> = ({
  src,
  alt = '',
  width,
  height,
  mode = 'aspectFit',
  lazyLoad = true,
  placeholder = 'https://via.placeholder.com/300x200/cccccc/969696?text=Loading...',
  fallback = 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Error',
  className = '',
  style = {},
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 平台特定的图片加载策略
  const loadImage = platformExecute({
    weapp: () => {
      // 微信小程序：直接使用src，小程序自己处理加载
      return src;
    },
    h5: () => {
      // H5：实现渐进式加载和错误处理
      const img = new window.Image();
      img.src = src;
      
      img.onload = () => {
        setIsLoading(false);
        setImageSrc(src);
        onLoad?.();
      };
      
      img.onerror = () => {
        setIsLoading(false);
        setHasError(true);
        setImageSrc(fallback);
        onError?.();
      };
      
      return placeholder;
    },
    default: () => src
  });

  useEffect(() => {
    if (isH5()) {
      // H5平台预加载图片
      const img = new window.Image();
      img.src = src;
    }
    
    setImageSrc(loadImage || placeholder);
    setIsLoading(true);
    setHasError(false);
  }, [src, placeholder]);

  const handleLoad = () => {
    setIsLoading(false);
    if (!hasError) {
      setImageSrc(src);
    }
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(fallback);
    onError?.();
  };

  // 平台特定的样式
  const platformStyles = platformExecute({
    weapp: () => ({
      // 小程序优化
      display: 'block',
      backgroundColor: isLoading ? theme.colors.gray100 : 'transparent'
    }),
    h5: () => ({
      // H5优化：过渡效果和懒加载
      transition: 'opacity 0.3s ease-in-out',
      opacity: isLoading ? 0.5 : 1,
      backgroundColor: isLoading ? theme.colors.gray100 : 'transparent',
      objectFit: mode === 'aspectFit' ? 'contain' : 
                 mode === 'aspectFill' ? 'cover' : 
                 mode === 'scaleToFill' ? 'fill' : 'none'
    }),
    default: () => ({})
  });

  const imageStyle = {
    width: width || '100%',
    height: height || 'auto',
    ...platformStyles,
    ...style
  };

  // 平台特定的图片组件
  if (isWeapp()) {
    return (
      <TaroImage
        src={hasError ? fallback : src}
        mode={mode}
        lazyLoad={lazyLoad}
        className={className}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }

  // H5和其他平台使用img标签
  return (
    <View style={{ position: 'relative', width, height }}>
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={imageStyle}
        loading={lazyLoad ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* H5加载指示器 */}
      {isH5() && isLoading && (
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
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <View
            style={{
              width: '40px',
              height: '40px',
              border: `3px solid ${theme.colors.gray200}`,
              borderTopColor: theme.colors.primary,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        </View>
      )}

      {/* H5错误状态 */}
      {isH5() && hasError && (
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
            flexDirection: 'column',
            backgroundColor: theme.colors.gray50,
            padding: '16px'
          }}
        >
          <View
            style={{
              fontSize: '48px',
              color: theme.colors.gray400,
              marginBottom: '8px'
            }}
          >
            🖼️
          </View>
          <View
            style={{
              fontSize: '14px',
              color: theme.colors.gray600,
              textAlign: 'center'
            }}
          >
            图片加载失败
          </View>
        </View>
      )}
    </View>
  );
};

// 平台特定的图片变体
export const WeappImage: React.FC<PlatformImageProps> = (props) => {
  if (!isWeapp()) return null;
  return <PlatformImage {...props} />;
};

export const H5Image: React.FC<PlatformImageProps> = (props) => {
  if (!isH5()) return null;
  return <PlatformImage {...props} />;
};

// 懒加载图片组件（H5专用）
export const LazyImage: React.FC<PlatformImageProps> = (props) => {
  if (!isH5()) {
    return <PlatformImage {...props} lazyLoad={false} />;
  }

  const [isInView, setIsInView] = useState(false);
  const observerRef = React.useRef<IntersectionObserver>();

  useEffect(() => {
    if (!isH5()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    const current = observerRef.current;
    return () => {
      if (current) {
        current.disconnect();
      }
    };
  }, []);

  const setRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node && isH5()) {
      observerRef.current?.observe(node);
    }
  }, []);

  if (!isInView) {
    return (
      <div ref={setRef} style={{ width: props.width, height: props.height }}>
        <PlatformImage {...props} src={props.placeholder || ''} lazyLoad={false} />
      </div>
    );
  }

  return <PlatformImage {...props} />;
};

export default PlatformImage;