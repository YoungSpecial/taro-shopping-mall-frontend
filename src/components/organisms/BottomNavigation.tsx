import { View, Text } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { theme } from '../../styles/theme'
import Icon from '../atoms/Icon'
import './index.css'

interface BottomNavigationProps {
  activeTab: 'home' | 'orders'
}

export default function BottomNavigation({ activeTab }: BottomNavigationProps) {
  return (
    <View className='bottom-navigation'>
      <View
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => navigateTo({ url: '/pages/index/index' })}
      >
        <Icon
          name='home'
          size='md'
          color={activeTab === 'home' ? theme.colors.primary : theme.colors.gray600}
        />
        <Text className={`nav-text ${activeTab === 'home' ? 'active' : ''}`}>
          首页
        </Text>
      </View>

      <View
        className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
        onClick={() => navigateTo({ url: '/pages/order/history' })}
      >
        <Icon
          name='package'
          size='md'
          color={activeTab === 'orders' ? theme.colors.primary : theme.colors.gray600}
        />
        <Text className={`nav-text ${activeTab === 'orders' ? 'active' : ''}`}>
          订单
        </Text>
      </View>
    </View>
  )
}
