import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { View } from '@tarojs/components';
import { theme } from '../../styles/theme';
import { isWeapp, isH5, platformExecute } from '../../utils/platform';
import LoadingSpinner from './LoadingSpinner';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
  type?: 'spinner' | 'skeleton' | 'progress';
}

interface LoadingContextType {
  showLoading: (message?: string, type?: LoadingState['type']) => void;
  hideLoading: () => void;
  updateProgress: (progress: number) => void;
  updateMessage: (message: string) => void;
  loadingState: LoadingState;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingManagerProps {
  children: ReactNode;
  defaultType?: LoadingState['type'];
  globalLoading?: boolean;
}

export const LoadingManager: React.FC<LoadingManagerProps> = ({
  children,
  defaultType = 'spinner',
  globalLoading = false
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    type: defaultType
  });

  const showLoading = (message?: string, type: LoadingState['type'] = defaultType) => {
    setLoadingState({
      isLoading: true,
      message,
      type,
      progress: type === 'progress' ? 0 : undefined
    });
  };

  const hideLoading = () => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false
    }));
  };

  const updateProgress = (progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.max(0, Math.min(100, progress))
    }));
  };

  const updateMessage = (message: string) => {
    setLoadingState(prev => ({
      ...prev,
      message
    }));
  };

  // 平台特定的全局加载样式
  const globalLoadingStyle = platformExecute({
    weapp: () => ({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }),
    h5: () => ({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }),
    default: () => ({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    })
  });

  const contextValue: LoadingContextType = {
    showLoading,
    hideLoading,
    updateProgress,
    updateMessage,
    loadingState
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      
      {globalLoading && loadingState.isLoading && (
        <View style={globalLoadingStyle}>
          {loadingState.type === 'spinner' && (
            <LoadingSpinner
              size="lg"
              text={loadingState.message || '加载中...'}
              textPosition="bottom"
            />
          )}
          
          {loadingState.type === 'progress' && (
            <View style={{ width: '80%', maxWidth: '400px' }}>
              <LoadingSpinner.ProgressBar
                progress={loadingState.progress || 0}
                height={8}
                showPercentage
                animated
              />
              {loadingState.message && (
                <View style={{ marginTop: theme.spacing.md, textAlign: 'center' }}>
                  <LoadingSpinner.SkeletonText
                    lines={1}
                    width="60%"
                    variant="body"
                  />
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingManager');
  }
  return context;
};

// 高阶组件：为组件添加加载状态
export const withLoading = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    loadingMessage?: string;
    loadingType?: LoadingState['type'];
    showOnMount?: boolean;
  }
) => {
  const { loadingMessage, loadingType = 'spinner', showOnMount = false } = options || {};

  return function WithLoadingComponent(props: P) {
    const { showLoading, hideLoading, loadingState } = useLoading();
    const [internalLoading, setInternalLoading] = useState(false);

    useEffect(() => {
      if (showOnMount) {
        showLoading(loadingMessage, loadingType);
        return () => hideLoading();
      }
    }, []);

    const startLoading = (message?: string) => {
      setInternalLoading(true);
      showLoading(message || loadingMessage, loadingType);
    };

    const stopLoading = () => {
      setInternalLoading(false);
      hideLoading();
    };

    const isLoading = internalLoading || loadingState.isLoading;

    return (
      <>
        <Component {...props} />
        {isLoading && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}>
            <LoadingSpinner
              size="md"
              text={loadingState.message || loadingMessage}
              textPosition="bottom"
            />
          </View>
        )}
      </>
    );
  };
};

// 加载状态包装器组件
export const LoadingWrapper: React.FC<{
  isLoading: boolean;
  loadingType?: LoadingState['type'];
  loadingMessage?: string;
  skeleton?: ReactNode;
  children: ReactNode;
  overlay?: boolean;
}> = ({
  isLoading,
  loadingType = 'spinner',
  loadingMessage,
  skeleton,
  children,
  overlay = true
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  if (loadingType === 'skeleton' && skeleton) {
    return <>{skeleton}</>;
  }

  if (loadingType === 'skeleton') {
    return (
      <View style={{
        width: '100%',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoadingSpinner.SkeletonRect width="100%" height="200px" />
      </View>
    );
  }

  const wrapperStyle = overlay ? {
    position: 'relative',
    minHeight: '100px'
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100px'
  };

  const overlayStyle = overlay ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  };

  return (
    <View style={wrapperStyle}>
      {overlay && children}
      <View style={overlayStyle}>
        {loadingType === 'progress' ? (
          <View style={{ width: '80%' }}>
            <LoadingSpinner.ProgressBar
              progress={0}
              height={6}
              showPercentage={false}
              animated
            />
            {loadingMessage && (
              <View style={{ marginTop: theme.spacing.sm, textAlign: 'center' }}>
                <LoadingSpinner.SkeletonText
                  lines={1}
                  width="60%"
                  variant="caption"
                />
              </View>
            )}
          </View>
        ) : (
          <LoadingSpinner
            size="md"
            text={loadingMessage}
            textPosition="bottom"
          />
        )}
      </View>
    </View>
  );
};

// 平台特定的加载管理器变体
export const WeappLoadingManager: React.FC<LoadingManagerProps> = (props) => {
  if (!isWeapp()) return null;
  return <LoadingManager {...props} />;
};

export const H5LoadingManager: React.FC<LoadingManagerProps> = (props) => {
  if (!isH5()) return null;
  return <LoadingManager {...props} />;
};

export default LoadingManager;