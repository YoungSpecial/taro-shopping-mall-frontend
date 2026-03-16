import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { theme } from '../../styles/theme';
import Icon from '../atoms/Icon';

interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  height?: string;
  showIndicators?: boolean;
  showNavigation?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onImageChange?: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  initialIndex = 0,
  height = '400px',
  showIndicators = true,
  showNavigation = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onImageChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // 自动播放效果
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length, autoPlayInterval]);

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    onImageChange?.(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    onImageChange?.(prevIndex);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    onImageChange?.(index);
    // 点击时暂停自动播放
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      // 3秒后恢复自动播放
      setTimeout(() => setIsAutoPlaying(true), 3000);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (images.length === 0) {
    return (
      <View style={{
        height,
        backgroundColor: theme.colors.gray100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.borderRadius.md,
      }}>
        <Icon name="info" size="xl" color={theme.colors.gray400} />
        <Text style={{
          marginTop: theme.spacing.sm,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray500,
        }}>
          暂无图片
        </Text>
      </View>
    );
  }

  return (
    <View style={{
      position: 'relative',
      height,
      backgroundColor: theme.colors.gray100,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
    }}>
      {/* 主图显示 */}
      <View style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
        {images.map((image, index) => (
          <View
            key={index}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 0.3s ease',
              backgroundImage: `url(${image})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}
      </View>

      {/* 导航按钮 */}
      {showNavigation && images.length > 1 && (
        <>
          <View
            onClick={goToPrev}
            style={{
              position: 'absolute',
              left: theme.spacing.md,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              zIndex: 10,
            }}
            hoverClass="gallery-nav-hover"
            hoverStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              transform: 'translateY(-50%) scale(1.1)',
            }}
          >
            <Icon name="arrow-left" size="md" color={theme.colors.white} />
          </View>

          <View
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: theme.spacing.md,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              zIndex: 10,
            }}
            hoverClass="gallery-nav-hover"
            hoverStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              transform: 'translateY(-50%) scale(1.1)',
            }}
          >
            <Icon name="arrow-right" size="md" color={theme.colors.white} />
          </View>
        </>
      )}

      {/* 图片指示器 */}
      {showIndicators && images.length > 1 && (
        <View style={{
          position: 'absolute',
          bottom: theme.spacing.md,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: theme.spacing.xs,
          zIndex: 10,
        }}>
          {images.map((_, index) => (
            <View
              key={index}
              onClick={() => goToImage(index)}
              style={{
                width: index === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: index === currentIndex 
                  ? theme.colors.primary 
                  : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              hoverClass="gallery-indicator-hover"
              hoverStyle={{
                backgroundColor: index === currentIndex 
                  ? theme.colors.primaryDark 
                  : 'rgba(255, 255, 255, 0.7)',
              }}
            />
          ))}
        </View>
      )}

      {/* 自动播放控制 */}
      {autoPlay && images.length > 1 && (
        <View
          onClick={toggleAutoPlay}
          style={{
            position: 'absolute',
            top: theme.spacing.md,
            right: theme.spacing.md,
            width: '32px',
            height: '32px',
            borderRadius: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
          hoverClass="gallery-autoplay-hover"
          hoverStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            transform: 'scale(1.1)',
          }}
        >
          {isAutoPlaying ? (
            <View style={{ position: 'relative', width: '16px', height: '16px' }}>
              <View style={{
                position: 'absolute',
                left: '4px',
                top: '0',
                width: '4px',
                height: '16px',
                backgroundColor: theme.colors.white,
                borderRadius: '1px',
              }} />
              <View style={{
                position: 'absolute',
                right: '4px',
                top: '0',
                width: '4px',
                height: '16px',
                backgroundColor: theme.colors.white,
                borderRadius: '1px',
              }} />
            </View>
          ) : (
            <View style={{
              width: '0',
              height: '0',
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderLeft: `12px solid ${theme.colors.white}`,
              marginLeft: '2px',
            }} />
          )}
        </View>
      )}

      {/* 图片计数器 */}
      {images.length > 1 && (
        <View style={{
          position: 'absolute',
          top: theme.spacing.md,
          left: theme.spacing.md,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: theme.borderRadius.md,
          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          zIndex: 10,
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.white,
            fontWeight: theme.typography.fontWeight.medium,
          }}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      )}

      {/* 缩略图预览（水平滚动） */}
      {images.length > 1 && (
        <View style={{
          position: 'absolute',
          bottom: showIndicators ? '60px' : theme.spacing.md,
          left: 0,
          right: 0,
          padding: `0 ${theme.spacing.md}`,
          zIndex: 10,
        }}>
          <View style={{
            display: 'flex',
            gap: theme.spacing.xs,
            overflowX: 'auto',
            padding: theme.spacing.xs,
            scrollbarWidth: 'none', // 隐藏滚动条
          }}>
            {images.map((image, index) => (
              <View
                key={index}
                onClick={() => goToImage(index)}
                style={{
                  flex: '0 0 auto',
                  width: '60px',
                  height: '60px',
                  borderRadius: theme.borderRadius.sm,
                  border: `2px solid ${index === currentIndex ? theme.colors.primary : 'transparent'}`,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  opacity: index === currentIndex ? 1 : 0.7,
                  transition: 'all 0.2s ease',
                }}
                hoverClass="gallery-thumbnail-hover"
                hoverStyle={{
                  opacity: 1,
                  transform: 'scale(1.05)',
                }}
              >
                <View style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default ImageGallery;