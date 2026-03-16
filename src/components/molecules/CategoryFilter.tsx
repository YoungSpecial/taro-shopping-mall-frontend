import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { theme } from '../../styles/theme';
import {Category} from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: number;
  onSelectCategory: (categoryId: number) => void;
  showCount?: boolean;
  scrollable?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  showCount = true,
  scrollable = true,
}) => {
  const handleCategoryClick = (categoryId: number) => {
    onSelectCategory(categoryId);
  };

  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, string> = {
      '全部': '🏠',
      '服饰': '👕',
      '电子产品': '📱',
      '运动户外': '⚽',
      '鞋类': '👟',
    }
    return iconMap[categoryId] || '🛍️'
  }

  const renderCategoryItem = (category: Category) => {
    const isSelected = selectedCategory === category.id || (category.id === -1 && !selectedCategory);

    return (
      <View
        key={category.id}
        onClick={() => handleCategoryClick(category.id)}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          marginRight: theme.spacing.sm,
          marginBottom: theme.spacing.sm,
          backgroundColor: isSelected ? theme.colors.primary : theme.colors.gray100,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.gray300}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '80px',
        }}
        hoverClass="category-hover"
        hoverStyle={{
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.sm,
        }}
      >
        {category.name && (
          <Text style={{
            fontSize: '20px',
            marginBottom: theme.spacing.xs,
            color: isSelected ? theme.colors.white : theme.colors.gray700
          }}>
            {getCategoryIcon(category.name)}
          </Text>
        )}

        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: isSelected ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
          color: isSelected ? theme.colors.white : theme.colors.gray700,
          textAlign: 'center',
          lineHeight: 1.2,
        }}>
          {category.name}
        </Text>

        {showCount && category.count > 0 && (
          <Text style={{
            fontSize: theme.typography.fontSize.xs,
            color: isSelected ? theme.colors.white : theme.colors.gray500,
            marginTop: theme.spacing.xs,
          }}>
            {category.count}
          </Text>
        )}
      </View>
    );
  };

  const content = (
    <View style={{ display: 'flex', flexWrap: 'wrap' }}>
      {categories.map(renderCategoryItem)}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        scrollX
        style={{
          whiteSpace: 'nowrap',
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
        }}
        scrollWithAnimation
      >
        <View style={{ display: 'inline-flex', paddingLeft: theme.spacing.md, paddingRight: theme.spacing.md }}>
          {categories.map(renderCategoryItem)}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ padding: theme.spacing.md }}>
      {content}
    </View>
  );
};

export default CategoryFilter;
