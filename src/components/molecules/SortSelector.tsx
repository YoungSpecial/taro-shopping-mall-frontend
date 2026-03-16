import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { SortOption } from '../../types';
import { theme } from '../../styles/theme';
import Icon from '../atoms/Icon';

interface SortSelectorProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  showLabel?: boolean;
  compact?: boolean;
}

const SortSelector: React.FC<SortSelectorProps> = ({
  sortBy,
  onSortChange,
  showLabel = true,
  compact = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const sortOptions: Array<{ value: SortOption; label: string; icon: string }> = [
    { value: 'newest', label: '最新', icon: '🆕' },
    { value: 'popular', label: '热门', icon: '🔥' },
    { value: 'price_asc', label: '价格从低到高', icon: '💰↑' },
    { value: 'price_desc', label: '价格从高到低', icon: '💰↓' },
    { value: 'rating', label: '评分最高', icon: '⭐' },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : '排序';
  };

  const getCurrentSortIcon = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.icon : '↕️';
  };

  const handleSortSelect = (option: SortOption) => {
    onSortChange(option);
    setShowDropdown(false);
  };

  if (compact) {
    return (
      <View style={{ position: 'relative' }}>
        <View
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.gray300}`,
            cursor: 'pointer',
            minWidth: '100px',
          }}
          hoverClass="sort-selector-hover"
          hoverStyle={{ borderColor: theme.colors.primary }}
        >
          <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray700, marginRight: theme.spacing.xs }}>
            {getCurrentSortIcon()}
          </Text>
          <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray800, flex: 1 }}>
            {getCurrentSortLabel()}
          </Text>
          <Icon name={showDropdown ? 'arrow-up' : 'arrow-down'} size="xs" color={theme.colors.gray600} />
        </View>

        {showDropdown && (
          <View
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: theme.colors.white,
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.gray300}`,
              boxShadow: theme.shadows.md,
              zIndex: 1000,
              marginTop: theme.spacing.xs,
              overflow: 'hidden',
            }}
          >
            {sortOptions.map(option => {
              const isSelected = sortBy === option.value;
              return (
                <View
                  key={option.value}
                  onClick={() => handleSortSelect(option.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    backgroundColor: isSelected ? theme.colors.gray100 : theme.colors.white,
                    borderBottom: `1px solid ${theme.colors.gray200}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  hoverClass="sort-option-hover"
                  hoverStyle={{ backgroundColor: theme.colors.gray50 }}
                >
                  <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray700, marginRight: theme.spacing.sm, width: '24px' }}>
                    {option.icon}
                  </Text>
                  <Text style={{ 
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: isSelected ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
                    color: isSelected ? theme.colors.primary : theme.colors.gray800,
                    flex: 1,
                  }}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Icon name="check" size="xs" color={theme.colors.primary} />
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={{ padding: theme.spacing.md, backgroundColor: theme.colors.white }}>
      <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
        {showLabel && (
          <Text style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.gray800 }}>
            排序方式
          </Text>
        )}
        <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray600 }}>
          当前: {getCurrentSortLabel()}
        </Text>
      </View>

      <View style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        {sortOptions.map(option => {
          const isSelected = sortBy === option.value;
          return (
            <View
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                backgroundColor: isSelected ? theme.colors.primary : theme.colors.gray100,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.gray300}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: '1 0 calc(50% - 8px)',
                minWidth: '140px',
              }}
              hoverClass="sort-option-hover"
              hoverStyle={{
                transform: 'translateY(-1px)',
                boxShadow: theme.shadows.sm,
              }}
            >
              <Text style={{ 
                fontSize: theme.typography.fontSize.md,
                color: isSelected ? theme.colors.white : theme.colors.gray700,
                marginRight: theme.spacing.sm,
              }}>
                {option.icon}
              </Text>
              <Text style={{ 
                fontSize: theme.typography.fontSize.sm,
                fontWeight: isSelected ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
                color: isSelected ? theme.colors.white : theme.colors.gray700,
                flex: 1,
              }}>
                {option.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default SortSelector;