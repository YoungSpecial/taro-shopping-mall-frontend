import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import Icon from '../atoms/Icon';
import { theme } from '../../styles/theme';
import { isWeapp, isH5, platformConfig } from '../../utils/platform';

interface PlatformNavigationProps {
  title: string;
  showBack?: boolean;
  showCart?: boolean;
  onBack?: () => void;
  onCartClick?: () => void;
}

const PlatformNavigation: React.FC<PlatformNavigationProps> = ({
  title,
  showBack = false,
  showCart = true,
  onBack,
  onCartClick
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // 默认返回行为
      if (isWeapp()) {
        // 小程序使用 navigateBack
        navigateTo({ url: '/pages/index/index' });
      } else if (isH5()) {
        // H5可以使用 history.back() 或导航到首页
        window.history.length > 1 ? window.history.back() : navigateTo({ url: '/pages/index/index' });
      }
    }
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      navigateTo({ url: '/pages/cart/index' });
    }
  };

  // 获取平台特定的样式配置
  const navConfig = platformConfig.getCurrentConfig(platformConfig.navigationBar);
  const btnConfig = platformConfig.getCurrentConfig(platformConfig.button);

  return (
    <View
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: navConfig.backgroundColor,
        borderBottom: `1px solid ${navConfig.borderColor}`,
        padding: isWeapp() ? '12px 16px' : '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: isWeapp() ? '44px' : '56px',
        boxSizing: 'border-box'
      }}
    >
      {/* 左侧区域 */}
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: 1
        }}
      >
        {showBack && (
          <Button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon
              name="arrow-left"
              size={isWeapp() ? 'md' : 'lg'}
              color={navConfig.titleColor}
            />
          </Button>
        )}
        
        <Text
          style={{
            fontSize: isWeapp() ? '17px' : '18px',
            fontWeight: 'bold',
            color: navConfig.titleColor,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </Text>
      </View>

      {/* 右侧区域 */}
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        {showCart && (
          <Button
            onClick={handleCartClick}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Icon
              name="cart"
              size={isWeapp() ? 'md' : 'lg'}
              color={navConfig.titleColor}
            />
            {/* 购物车数量徽章 - 仅H5显示动画 */}
            {isH5() && (
              <View
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: theme.colors.primary,
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                3
              </View>
            )}
          </Button>
        )}

        {/* 平台特定的额外按钮 */}
        {isWeapp() && (
          <Button
            onClick={() => {
              // 小程序分享功能
              console.log('微信小程序分享');
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon
              name="share"
              size="md"
              color={navConfig.titleColor}
            />
          </Button>
        )}

        {isH5() && (
          <Button
            onClick={() => {
              // H5搜索功能
              console.log('H5搜索');
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon
              name="search"
              size="lg"
              color={navConfig.titleColor}
            />
          </Button>
        )}
      </View>
    </View>
  );
};

// 平台特定的变体组件
export const WeappNavigation: React.FC<PlatformNavigationProps> = (props) => {
  if (!isWeapp()) return null;
  return <PlatformNavigation {...props} />;
};

export const H5Navigation: React.FC<PlatformNavigationProps> = (props) => {
  if (!isH5()) return null;
  return <PlatformNavigation {...props} />;
};

export default PlatformNavigation;