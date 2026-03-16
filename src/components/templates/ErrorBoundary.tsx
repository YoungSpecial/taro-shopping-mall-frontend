import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Button } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { isWeapp, isH5, platformExecute } from '../../utils/platform';
import { theme } from '../../styles/theme';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo
    });

    // 调用自定义错误处理
    this.props.onError?.(error, errorInfo);

    // 平台特定的错误处理
    platformExecute({
      weapp: () => {
        // 微信小程序：记录错误到云监控
        console.error('微信小程序错误:', error, errorInfo);
        wx.reportMonitor?.('1', 1); // 错误监控
      },
      h5: () => {
        // H5：发送错误到监控服务
        console.error('H5错误:', error, errorInfo);
        
        // 可以发送到Sentry、LogRocket等
        if (window._sentry) {
          window._sentry.captureException(error);
        }
      },
      default: () => {
        console.error('应用错误:', error, errorInfo);
      }
    });
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = (): void => {
    navigateTo({
      url: '/pages/index/index'
    });
  };

  handleReportError = (): void => {
    const { error, errorInfo } = this.state;
    
    platformExecute({
      weapp: () => {
        // 微信小程序反馈
        wx.showModal({
          title: '错误反馈',
          content: '是否将错误信息反馈给开发者？',
          success: (res) => {
            if (res.confirm) {
              console.log('用户确认反馈错误:', error?.message);
            }
          }
        });
      },
      h5: () => {
        // H5反馈
        const errorDetails = `
错误: ${error?.message}
组件栈: ${errorInfo?.componentStack}
时间: ${new Date().toISOString()}
用户代理: ${navigator.userAgent}
        `;
        
        console.log('错误详情:', errorDetails);
        alert('错误已记录，感谢反馈！');
      }
    });
  };

  renderFallback(): ReactNode {
    if (this.props.fallback) {
      return this.props.fallback;
    }

    const { error } = this.state;
    const errorMessage = error?.message || '未知错误';

    return (
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          backgroundColor: theme.colors.white,
          minHeight: '400px'
        }}
      >
        <View
          style={{
            fontSize: '64px',
            color: theme.colors.gray300,
            marginBottom: '24px'
          }}
        >
          ⚠️
        </View>

        <Text
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: theme.colors.gray800,
            marginBottom: '12px',
            textAlign: 'center'
          }}
        >
          哎呀，出错了！
        </Text>

        <Text
          style={{
            fontSize: '14px',
            color: theme.colors.gray600,
            marginBottom: '24px',
            textAlign: 'center',
            lineHeight: 1.5
          }}
        >
          {errorMessage}
        </Text>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            maxWidth: '300px'
          }}
        >
          <Button
            onClick={this.handleRetry}
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              textAlign: 'center'
            }}
          >
            重试
          </Button>

          <Button
            onClick={this.handleGoHome}
            style={{
              backgroundColor: theme.colors.white,
              color: theme.colors.primary,
              border: `1px solid ${theme.colors.primary}`,
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              textAlign: 'center'
            }}
          >
            返回首页
          </Button>

          {isH5() && (
            <Button
              onClick={this.handleReportError}
              style={{
                backgroundColor: theme.colors.gray100,
                color: theme.colors.gray700,
                border: `1px solid ${theme.colors.gray300}`,
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              反馈错误
            </Button>
          )}
        </View>

        {isH5() && (
          <Text
            style={{
              fontSize: '12px',
              color: theme.colors.gray500,
              marginTop: '24px',
              textAlign: 'center'
            }}
          >
            如果问题持续存在，请联系客服
          </Text>
        )}
      </View>
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

// 全局错误处理器
export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorListeners: Array<(error: Error) => void> = [];

  private constructor() {
    this.setupGlobalHandlers();
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private setupGlobalHandlers(): void {
    // 全局未捕获的Promise错误
    window.addEventListener('unhandledrejection', (event) => {
      console.error('未处理的Promise拒绝:', event.reason);
      this.notifyListeners(event.reason);
    });

    // 全局错误
    window.addEventListener('error', (event) => {
      console.error('全局错误:', event.error);
      this.notifyListeners(event.error);
    });

    // React渲染错误（通过ErrorBoundary处理）
  }

  addErrorListener(listener: (error: Error) => void): void {
    this.errorListeners.push(listener);
  }

  removeErrorListener(listener: (error: Error) => void): void {
    this.errorListeners = this.errorListeners.filter(l => l !== listener);
  }

  private notifyListeners(error: Error): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (e) {
        console.error('错误监听器异常:', e);
      }
    });
  }

  reportError(error: Error, context?: Record<string, any>): void {
    console.error('报告错误:', error, context);
    this.notifyListeners(error);

    // 平台特定的错误上报
    platformExecute({
      weapp: () => {
        // 微信小程序错误上报
        wx.reportAnalytics?.('error_occurred', {
          error_message: error.message,
          error_stack: error.stack?.substring(0, 200),
          ...context
        });
      },
      h5: () => {
        // H5错误上报
        if (window.gtag) {
          window.gtag('event', 'exception', {
            description: error.message,
            fatal: true
          });
        }
      }
    });
  }
}

// 错误边界HOC
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
): React.ComponentType<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// 使用示例
export const SafeComponent = withErrorBoundary;

export default ErrorBoundary;