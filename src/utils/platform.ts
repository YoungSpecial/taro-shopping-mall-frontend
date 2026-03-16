/**
 * 平台工具函数 - 用于多端条件编译
 */

/**
 * 获取当前平台环境
 * @returns 当前平台: 'weapp' | 'h5' | 'alipay' | 'swan' | 'tt' | 'qq' | 'jd' | 'rn' | 'harmony-hybrid'
 */
export const getPlatform = (): string => {
  return process.env.TARO_ENV || 'h5';
};

/**
 * 检查当前是否为微信小程序平台
 */
export const isWeapp = (): boolean => {
  return getPlatform() === 'weapp';
};

/**
 * 检查当前是否为H5平台
 */
export const isH5 = (): boolean => {
  return getPlatform() === 'h5';
};

/**
 * 检查当前是否为支付宝小程序平台
 */
export const isAlipay = (): boolean => {
  return getPlatform() === 'alipay';
};

/**
 * 检查当前是否为字节跳动小程序平台
 */
export const isTt = (): boolean => {
  return getPlatform() === 'tt';
};

/**
 * 检查当前是否为百度小程序平台
 */
export const isSwan = (): boolean => {
  return getPlatform() === 'swan';
};

/**
 * 检查当前是否为移动端（小程序或H5）
 */
export const isMobile = (): boolean => {
  const platform = getPlatform();
  return platform === 'weapp' || platform === 'alipay' || platform === 'swan' || 
         platform === 'tt' || platform === 'qq' || platform === 'jd' || platform === 'h5';
};

/**
 * 平台特定的样式类名
 * @param baseClass 基础类名
 * @param platformClasses 平台特定的类名映射
 * @returns 组合后的类名
 */
export const platformClass = (
  baseClass: string,
  platformClasses: Record<string, string> = {}
): string => {
  const platform = getPlatform();
  const platformClass = platformClasses[platform] || '';
  return `${baseClass} ${platformClass}`.trim();
};

/**
 * 条件渲染组件
 * @param weappComponent 微信小程序组件
 * @param h5Component H5组件
 * @param defaultComponent 默认组件（可选）
 * @returns 对应平台的组件
 */
export const PlatformComponent = <T,>({
  weapp,
  h5,
  alipay,
  swan,
  tt,
  default: defaultComponent
}: {
  weapp?: T;
  h5?: T;
  alipay?: T;
  swan?: T;
  tt?: T;
  default?: T;
}): T | undefined => {
  const platform = getPlatform();
  
  switch (platform) {
    case 'weapp':
      return weapp || defaultComponent;
    case 'h5':
      return h5 || defaultComponent;
    case 'alipay':
      return alipay || defaultComponent;
    case 'swan':
      return swan || defaultComponent;
    case 'tt':
      return tt || defaultComponent;
    default:
      return defaultComponent;
  }
};

/**
 * 执行平台特定的代码
 * @param weappCode 微信小程序代码
 * @param h5Code H5代码
 * @param defaultCode 默认代码（可选）
 * @returns 执行对应平台的代码
 */
export const platformExecute = <T>({
  weapp,
  h5,
  alipay,
  swan,
  tt,
  default: defaultCode
}: {
  weapp?: () => T;
  h5?: () => T;
  alipay?: () => T;
  swan?: () => T;
  tt?: () => T;
  default?: () => T;
}): T | undefined => {
  const platform = getPlatform();
  
  switch (platform) {
    case 'weapp':
      return weapp ? weapp() : defaultCode ? defaultCode() : undefined;
    case 'h5':
      return h5 ? h5() : defaultCode ? defaultCode() : undefined;
    case 'alipay':
      return alipay ? alipay() : defaultCode ? defaultCode() : undefined;
    case 'swan':
      return swan ? swan() : defaultCode ? defaultCode() : undefined;
    case 'tt':
      return tt ? tt() : defaultCode ? defaultCode() : undefined;
    default:
      return defaultCode ? defaultCode() : undefined;
  }
};

/**
 * 平台特定的配置
 */
export const platformConfig = {
  // 导航栏配置
  navigationBar: {
    weapp: {
      backgroundColor: '#ffffff',
      titleColor: '#000000',
      borderColor: '#f0f0f0'
    },
    h5: {
      backgroundColor: '#ffffff',
      titleColor: '#000000',
      borderColor: '#e0e0e0'
    },
    default: {
      backgroundColor: '#ffffff',
      titleColor: '#000000',
      borderColor: '#f0f0f0'
    }
  },
  
  // 按钮配置
  button: {
    weapp: {
      borderRadius: '8px',
      padding: '12px 24px'
    },
    h5: {
      borderRadius: '6px',
      padding: '10px 20px'
    },
    default: {
      borderRadius: '8px',
      padding: '12px 24px'
    }
  },
  
  // 获取当前平台的配置
  getCurrentConfig: <T>(configs: Record<string, T>): T => {
    const platform = getPlatform();
    return configs[platform] || configs.default || configs.h5;
  }
};