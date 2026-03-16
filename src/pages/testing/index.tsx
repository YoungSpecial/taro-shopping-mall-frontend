import React from 'react';
import { View } from '@tarojs/components';
import { TestRunner } from '@/components/testing';

const TestingPage: React.FC = () => {
  return (
    <View className="testing-page">
      <TestRunner />
    </View>
  );
};

export default TestingPage;