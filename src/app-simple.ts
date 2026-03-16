import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import './app.css';

function SimpleApp({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.');
  });

  // 使用Fragment而不是View
  return <>{children}</>;
}

export default SimpleApp;