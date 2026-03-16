import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import { theme } from '../../styles/theme';
import Icon from '../atoms/Icon';

interface PriceRatingFilterProps {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  onPriceChange?: (min?: number, max?: number) => void;
  onRatingChange?: (rating?: number) => void;
  priceRange?: { min: number; max: number };
}

const PriceRatingFilter: React.FC<PriceRatingFilterProps> = ({
  minPrice,
  maxPrice,
  minRating,
  onPriceChange,
  onRatingChange,
  priceRange = { min: 0, max: 1000 },
}) => {
  const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice?.toString() || '');
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const ratingOptions = [
    { value: 4.5, label: '4.5星及以上', stars: 4.5 },
    { value: 4.0, label: '4.0星及以上', stars: 4.0 },
    { value: 3.5, label: '3.5星及以上', stars: 3.5 },
    { value: 3.0, label: '3.0星及以上', stars: 3.0 },
  ];

  const pricePresets = [
    { label: '0-100元', min: 0, max: 100 },
    { label: '100-300元', min: 100, max: 300 },
    { label: '300-500元', min: 300, max: 500 },
    { label: '500元以上', min: 500, max: priceRange.max },
  ];

  const handleMinPriceChange = (value: string) => {
    setLocalMinPrice(value);
    const numValue = value ? parseFloat(value) : undefined;
    if (onPriceChange) {
      onPriceChange(numValue, maxPrice);
    }
  };

  const handleMaxPriceChange = (value: string) => {
    setLocalMaxPrice(value);
    const numValue = value ? parseFloat(value) : undefined;
    if (onPriceChange) {
      onPriceChange(minPrice, numValue);
    }
  };

  const handlePricePreset = (min: number, max: number) => {
    setLocalMinPrice(min.toString());
    setLocalMaxPrice(max.toString());
    if (onPriceChange) {
      onPriceChange(min, max);
    }
  };

  const handleRatingSelect = (rating: number) => {
    if (onRatingChange) {
      onRatingChange(rating === minRating ? undefined : rating);
    }
  };

  const clearPriceFilter = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    if (onPriceChange) {
      onPriceChange(undefined, undefined);
    }
  };

  const clearRatingFilter = () => {
    if (onRatingChange) {
      onRatingChange(undefined);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          if (rating >= starValue) {
            return <Icon key={i} name="star-filled" size="sm" color={theme.colors.warning} />;
          } else if (rating > starValue - 1 && rating < starValue) {
            return <Icon key={i} name="star" size="sm" color={theme.colors.warning} />;
          } else {
            return <Icon key={i} name="star" size="sm" color={theme.colors.gray300} />;
          }
        })}
      </View>
    );
  };

  return (
    <View style={{ padding: theme.spacing.md, backgroundColor: theme.colors.white }}>
      {/* 评分筛选 */}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
          <Text style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.gray800 }}>
            评分筛选
          </Text>
          {minRating && (
            <Text 
              style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.primary, cursor: 'pointer' }}
              onClick={clearRatingFilter}
            >
              清除
            </Text>
          )}
        </View>
        
        <View style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm }}>
          {ratingOptions.map(option => {
            const isSelected = minRating === option.value;
            return (
              <View
                key={option.value}
                onClick={() => handleRatingSelect(option.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.gray100,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.gray300}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                hoverClass="filter-option-hover"
                hoverStyle={{
                  transform: 'translateY(-1px)',
                  boxShadow: theme.shadows.sm,
                }}
              >
                {renderStars(option.stars)}
                <Text style={{ 
                  fontSize: theme.typography.fontSize.sm,
                  color: isSelected ? theme.colors.white : theme.colors.gray700,
                  marginLeft: theme.spacing.xs,
                }}>
                  {option.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 价格筛选 */}
      <View>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
          <Text style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.gray800 }}>
            价格范围
          </Text>
          <View style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            {(minPrice || maxPrice) && (
              <Text 
                style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.primary, cursor: 'pointer' }}
                onClick={clearPriceFilter}
              >
                清除
              </Text>
            )}
            <Icon 
              name={showPriceFilter ? 'arrow-up' : 'arrow-down'} 
              size="sm" 
              color={theme.colors.gray600}
              onClick={() => setShowPriceFilter(!showPriceFilter)}
              style={{ cursor: 'pointer' }}
            />
          </View>
        </View>

        {showPriceFilter && (
          <View style={{ marginTop: theme.spacing.md }}>
            {/* 价格预设 */}
            <View style={{ marginBottom: theme.spacing.md }}>
              <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray600, marginBottom: theme.spacing.sm }}>
                快速选择
              </Text>
              <View style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                {pricePresets.map(preset => {
                  const isSelected = minPrice === preset.min && maxPrice === preset.max;
                  return (
                    <View
                      key={preset.label}
                      onClick={() => handlePricePreset(preset.min, preset.max)}
                      style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.gray100,
                        borderRadius: theme.borderRadius.md,
                        border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.gray300}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      hoverClass="filter-option-hover"
                      hoverStyle={{
                        transform: 'translateY(-1px)',
                        boxShadow: theme.shadows.sm,
                      }}
                    >
                      <Text style={{ 
                        fontSize: theme.typography.fontSize.sm,
                        color: isSelected ? theme.colors.white : theme.colors.gray700,
                      }}>
                        {preset.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* 自定义价格输入 */}
            <View style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <View style={{ flex: 1 }}>
                <View style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  border: `1px solid ${theme.colors.gray300}`,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing.xs,
                }}>
                  <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray600, marginRight: theme.spacing.xs }}>¥</Text>
                   <Input
                    type="number"
                    value={localMinPrice?.toString() || ''}
                    onInput={(e) => handleMinPriceChange(e.detail.value)}
                    placeholder="最低价"
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.gray800,
                      backgroundColor: 'transparent',
                      minWidth: 0,
                    }}
                  />
                </View>
              </View>
              
              <Text style={{ color: theme.colors.gray500 }}>至</Text>
              
              <View style={{ flex: 1 }}>
                <View style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  border: `1px solid ${theme.colors.gray300}`,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing.xs,
                }}>
                  <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray600, marginRight: theme.spacing.xs }}>¥</Text>
                   <Input
                    type="number"
                    value={localMaxPrice?.toString() || ''}
                    onInput={(e) => handleMaxPriceChange(e.detail.value)}
                    placeholder="最高价"
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.gray800,
                      backgroundColor: 'transparent',
                      minWidth: 0,
                    }}
                  />
                </View>
              </View>
            </View>
            
            <Text style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.gray500, marginTop: theme.spacing.xs, textAlign: 'center' }}>
              价格范围: ¥{priceRange.min} - ¥{priceRange.max}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PriceRatingFilter;