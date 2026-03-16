import React, { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { AppProvider } from './contexts/AppProvider';
import './app.css';

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.');
  });

  return React.createElement(AppProvider, null, children);
}

export default App;