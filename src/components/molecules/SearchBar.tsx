import React, { useState, useEffect } from 'react';
import { View, Input } from '@tarojs/components';
import { theme } from '../../styles/theme';
import Icon from '../atoms/Icon';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  defaultValue?: string;
  debounceMs?: number;
  showClearButton?: boolean;
  style?: React.CSSProperties;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '搜索商品...',
  onSearch,
  onClear,
  defaultValue = '',
  debounceMs = 300,
  showClearButton = true,
  style,
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== defaultValue) {
        onSearch(query);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch, defaultValue]);

  const handleInputChange = (e: any) => {
    setQuery(e.detail.value);
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: isFocused ? theme.colors.white : theme.colors.gray100,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${isFocused ? theme.colors.primary : theme.colors.gray300}`,
        padding: theme.spacing.sm,
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      <Icon 
        name="search" 
        size="sm" 
        color={isFocused ? theme.colors.primary : theme.colors.gray500}
        style={{ marginRight: theme.spacing.sm }}
      />
      
      <Input
        value={query}
        onInput={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderStyle={`color: ${theme.colors.gray500}`}
        style={{
          flex: 1,
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.gray800,
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          minWidth: 0,
        }}
        confirmType="search"
      />
      
      {showClearButton && query && (
        <View
          onClick={handleClear}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: theme.colors.gray300,
            cursor: 'pointer',
            marginLeft: theme.spacing.sm,
          }}
          hoverClass="search-clear-hover"
          hoverStyle={{ backgroundColor: theme.colors.gray400 }}
        >
          <Icon name="close" size="xs" color={theme.colors.gray600} />
        </View>
      )}
    </View>
  );
};

export default SearchBar;