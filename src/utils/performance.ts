/**
 * 性能优化工具函数
 */

import { useRef, useMemo, useCallback, useEffect } from 'react';

/**
 * 性能监控配置
 */
export interface PerformanceConfig {
  enabled: boolean;
  logThreshold: number; // 日志阈值（毫秒）
  sampleRate: number; // 采样率 0-1
}

/**
 * 默认性能配置
 */
export const defaultPerformanceConfig: PerformanceConfig = {
  enabled: process.env.NODE_ENV === 'development',
  logThreshold: 16, // 60fps的帧时间约16ms
  sampleRate: 0.1 // 10%采样率
};

/**
 * 组件渲染性能监控
 */
export function useRenderPerformance(componentName: string, config: Partial<PerformanceConfig> = {}) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  const mergedConfig = { ...defaultPerformanceConfig, ...config };
  
  useEffect(() => {
    if (!mergedConfig.enabled) return;
    
    renderCount.current++;
    const currentTime = performance.now();
    const renderDuration = currentTime - lastRenderTime.current;
    
    // 采样检查
    if (Math.random() < mergedConfig.sampleRate && renderDuration > mergedConfig.logThreshold) {
      console.warn(
        `[性能警告] ${componentName} 渲染耗时: ${renderDuration.toFixed(2)}ms`,
        `(渲染次数: ${renderCount.current})`
      );
    }
    
    lastRenderTime.current = currentTime;
  });
  
  return {
    renderCount: renderCount.current,
    resetRenderCount: () => { renderCount.current = 0; }
  };
}

/**
 * 记忆化选择器工厂函数
 * 用于创建记忆化的状态选择器，避免不必要的重新计算
 */
export function createMemoizedSelector<TState, TResult>(
  selector: (state: TState) => TResult,
  equalityFn?: (a: TResult, b: TResult) => boolean
) {
  let lastResult: TResult | undefined;
  let lastState: TState | undefined;
  
  return function memoizedSelector(state: TState): TResult {
    if (lastState === state && lastResult !== undefined) {
      return lastResult;
    }
    
    const result = selector(state);
    
    if (lastResult === undefined || !equalityFn?.(lastResult, result) || lastResult !== result) {
      lastResult = result;
      lastState = state;
    }
    
    return result;
  };
}

/**
 * 深度相等比较
 * 用于useMemo/useCallback的依赖项比较
 */
export function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) return true;
  
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }
  
  const keysA = Object.keys(a) as Array<keyof T>;
  const keysB = Object.keys(b) as Array<keyof T>;
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

/**
 * 浅层相等比较
 * 用于React.memo的props比较
 */
export function shallowEqual<T extends object>(objA: T, objB: T): boolean {
  if (Object.is(objA, objB)) return true;
  
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  
  const keysA = Object.keys(objA) as Array<keyof T>;
  const keysB = Object.keys(objB) as Array<keyof T>;
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key) || !Object.is(objA[key], objB[key])) {
      return false;
    }
  }
  
  return true;
}

/**
 * 防抖hook
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

/**
 * 节流hook
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;
    
    if (timeSinceLastCall >= delay) {
      lastCallRef.current = now;
      callback(...args);
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
        timeoutRef.current = undefined;
      }, delay - timeSinceLastCall);
    }
  }, [callback, delay]) as T;
}

/**
 * 虚拟列表配置
 */
export interface VirtualListConfig {
  itemHeight: number;
  overscanCount: number;
  containerHeight: number;
}

/**
 * 虚拟列表计算
 */
export function useVirtualList<T>(
  items: T[],
  config: VirtualListConfig
) {
  const { itemHeight, overscanCount, containerHeight } = config;
  
  return useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const visibleItemCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = 0; // 实际实现中会根据滚动位置计算
    const endIndex = Math.min(items.length, startIndex + visibleItemCount + overscanCount * 2);
    
    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;
    
    return {
      totalHeight,
      visibleItems,
      offsetY,
      startIndex,
      endIndex
    };
  }, [items, itemHeight, overscanCount, containerHeight]);
}

/**
 * 批量状态更新
 * 用于减少多次setState调用导致的重复渲染
 */
export function useBatchUpdate() {
  const updatesRef = useRef<Array<() => void>>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const batchUpdate = useCallback((update: () => void) => {
    updatesRef.current.push(update);
    
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        const updates = [...updatesRef.current];
        updatesRef.current = [];
        timeoutRef.current = undefined;
        
        // 执行批量更新
        updates.forEach(update => update());
      }, 0);
    }
  }, []);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return batchUpdate;
}

/**
 * 记忆化hook工厂
 */
export function createMemoizedHook<TArgs extends any[], TResult>(
  hook: (...args: TArgs) => TResult,
  keySelector: (...args: TArgs) => string
) {
  const cache = new Map<string, TResult>();
  
  return function useMemoizedHook(...args: TArgs): TResult {
    const key = keySelector(...args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = hook(...args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * 性能优化建议生成器
 */
export function generatePerformanceSuggestions(componentName: string, metrics: {
  renderCount: number;
  averageRenderTime: number;
  propChanges: number;
  stateChanges: number;
}): string[] {
  const suggestions: string[] = [];
  
  if (metrics.renderCount > 10) {
    suggestions.push(`组件 ${componentName} 渲染次数过多，考虑使用 React.memo`);
  }
  
  if (metrics.averageRenderTime > 10) {
    suggestions.push(`组件 ${componentName} 渲染耗时较长，检查是否有昂贵的计算`);
  }
  
  if (metrics.propChanges > metrics.renderCount * 0.5) {
    suggestions.push(`组件 ${componentName} 的props频繁变化，考虑优化父组件`);
  }
  
  if (metrics.stateChanges > 10) {
    suggestions.push(`组件 ${componentName} 状态变化频繁，考虑使用useMemo/useCallback`);
  }
  
  return suggestions;
}

/**
 * 导出性能工具
 */
export const performanceTools = {
  useRenderPerformance,
  createMemoizedSelector,
  deepEqual,
  shallowEqual,
  useDebounce,
  useThrottle,
  useVirtualList,
  useBatchUpdate,
  createMemoizedHook,
  generatePerformanceSuggestions
};

export default performanceTools;