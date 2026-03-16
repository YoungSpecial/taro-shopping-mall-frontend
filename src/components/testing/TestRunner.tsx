import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import { functionalityTester, testReportGenerator } from '@/utils/testing';
import { getPlatform } from '@/utils/platform';
import './TestRunner.css';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

const TestRunner: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [platform, setPlatform] = useState<string>('');

  useEffect(() => {
    setPlatform(getPlatform());
    
    // 初始化测试结果
    const initialResults: Record<string, TestResult> = {
      productBrowsing: { name: '产品浏览功能', status: 'pending' },
      productDetails: { name: '产品详情功能', status: 'pending' },
      shoppingCart: { name: '购物车功能', status: 'pending' },
      orderCreation: { name: '订单创建功能', status: 'pending' },
      loadingAndErrorHandling: { name: '加载状态和错误处理', status: 'pending' },
      touchInteractions: { name: '触摸交互组件', status: 'pending' }
    };
    
    setTestResults(initialResults);
  }, []);

  const updateTestResult = (testName: string, updates: Partial<TestResult>) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: {
        ...prev[testName],
        ...updates
      }
    }));
  };

  const runSingleTest = async (testName: string, testFunction: () => Promise<boolean>): Promise<boolean> => {
    updateTestResult(testName, { status: 'running' });
    
    const startTime = Date.now();
    
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      updateTestResult(testName, {
        status: result ? 'passed' : 'failed',
        duration,
        error: result ? undefined : '测试失败'
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      updateTestResult(testName, {
        status: 'failed',
        duration,
        error: errorMessage
      });
      
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    
    // 重置所有测试状态
    Object.keys(testResults).forEach(testName => {
      updateTestResult(testName, { status: 'pending', duration: undefined, error: undefined });
    });
    
    try {
      // 运行各个功能测试
      const productBrowsingResult = await runSingleTest('productBrowsing', () => 
        functionalityTester.testProductBrowsing()
      );
      
      const productDetailsResult = await runSingleTest('productDetails', () => 
        functionalityTester.testProductDetails()
      );
      
      const shoppingCartResult = await runSingleTest('shoppingCart', () => 
        functionalityTester.testShoppingCart()
      );
      
      const orderCreationResult = await runSingleTest('orderCreation', () => 
        functionalityTester.testOrderCreation()
      );
      
      const loadingAndErrorResult = await runSingleTest('loadingAndErrorHandling', () => 
        functionalityTester.testLoadingAndErrorHandling()
      );
      
      const touchInteractionsResult = await runSingleTest('touchInteractions', () => 
        functionalityTester.testTouchInteractions()
      );
      
      // 计算总体结果
      const allPassed = productBrowsingResult && productDetailsResult && shoppingCartResult && 
                       orderCreationResult && loadingAndErrorResult && touchInteractionsResult;
      
      setOverallStatus('completed');
      
      // 生成测试报告
      const booleanResults: Record<string, boolean> = {
        productBrowsing: productBrowsingResult,
        productDetails: productDetailsResult,
        shoppingCart: shoppingCartResult,
        orderCreation: orderCreationResult,
        loadingAndErrorHandling: loadingAndErrorResult,
        touchInteractions: touchInteractionsResult,
        allPassed
      };
      
      const report = testReportGenerator.generateReport(booleanResults, platform);
      console.log('测试报告:', report);
      
      // 在实际项目中，这里可以保存报告或显示给用户
      alert(`测试完成！${allPassed ? '所有测试通过' : '部分测试失败'}。查看控制台获取详细报告。`);
      
    } catch (error) {
      console.error('测试运行过程中发生错误:', error);
      setOverallStatus('completed');
      alert('测试运行失败，请查看控制台错误信息。');
    } finally {
      setIsRunning(false);
    }
  };

  const runSpecificTest = async (testName: string) => {
    setIsRunning(true);
    
    let testFunction: () => Promise<boolean>;
    
    switch (testName) {
      case 'productBrowsing':
        testFunction = () => functionalityTester.testProductBrowsing();
        break;
      case 'productDetails':
        testFunction = () => functionalityTester.testProductDetails();
        break;
      case 'shoppingCart':
        testFunction = () => functionalityTester.testShoppingCart();
        break;
      case 'orderCreation':
        testFunction = () => functionalityTester.testOrderCreation();
        break;
      case 'loadingAndErrorHandling':
        testFunction = () => functionalityTester.testLoadingAndErrorHandling();
        break;
      case 'touchInteractions':
        testFunction = () => functionalityTester.testTouchInteractions();
        break;
      default:
        alert('未知的测试类型');
        setIsRunning(false);
        return;
    }
    
    await runSingleTest(testName, testFunction);
    setIsRunning(false);
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return '#4CAF50';
      case 'failed': return '#F44336';
      case 'running': return '#2196F3';
      case 'pending': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return '通过';
      case 'failed': return '失败';
      case 'running': return '运行中';
      case 'pending': return '待运行';
      default: return '未知';
    }
  };

  return (
    <View className="test-runner">
      <View className="test-header">
        <Text className="test-title">多端功能测试运行器</Text>
        <Text className="test-platform">当前平台: {platform}</Text>
      </View>
      
      <View className="test-controls">
        <Button 
          className="test-button primary"
          onClick={runAllTests}
          disabled={isRunning}
        >
          {isRunning && overallStatus === 'running' ? '测试运行中...' : '运行所有测试'}
        </Button>
        
        <View className="test-status">
          <Text className={`status-indicator ${overallStatus}`}>
            {overallStatus === 'idle' ? '待测试' : 
             overallStatus === 'running' ? '测试中' : '测试完成'}
          </Text>
        </View>
      </View>
      
      <ScrollView className="test-results" scrollY>
        {Object.entries(testResults).map(([key, result]) => (
          <View key={key} className="test-result-item">
            <View className="test-result-header">
              <Text className="test-name">{result.name}</Text>
              <View className="test-status-badge" style={{ backgroundColor: getStatusColor(result.status) }}>
                <Text className="status-text">{getStatusText(result.status)}</Text>
              </View>
            </View>
            
            <View className="test-result-details">
              {result.duration && (
                <Text className="test-duration">耗时: {result.duration}ms</Text>
              )}
              
              {result.error && (
                <Text className="test-error">错误: {result.error}</Text>
              )}
              
              <Button 
                className="test-button secondary"
                onClick={() => runSpecificTest(key)}
                disabled={isRunning}
                size="mini"
              >
                单独运行
              </Button>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View className="test-summary">
        <Text className="summary-title">测试说明</Text>
        <Text className="summary-text">
          此测试运行器用于验证电商功能在 {platform} 平台上的表现。
          测试包括产品浏览、详情查看、购物车操作、订单创建等核心功能，
          以及加载状态、错误处理和触摸交互等优化功能。
        </Text>
        <Text className="summary-text">
          测试结果将显示在控制台中，包括详细的测试报告和平台特定建议。
        </Text>
      </View>
    </View>
  );
};

export default TestRunner;