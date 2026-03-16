import { View, Text, Button } from '@tarojs/components'
import { useLoad, navigateTo } from '@tarojs/taro'
import { useProducts, useCart } from '../../hooks'
import ProductList from '../../components/organisms/ProductList'
import CategoryFilter from '../../components/molecules/CategoryFilter'
import SearchBar from '../../components/molecules/SearchBar'
import PriceRatingFilter from '../../components/molecules/PriceRatingFilter'
import SortSelector from '../../components/molecules/SortSelector'
import LoadMore from '../../components/molecules/LoadMore'
import CartSummary from '../../components/molecules/CartSummary'
import Icon from '../../components/atoms/Icon'
import { theme } from '../../styles/theme'
import './index.css'
import BottomNavigation from "../../components/organisms/BottomNavigation";

export default function Index() {
  const { products, loading, error, categories, filter, sortBy, pagination, setFilter, setSortBy, loadMore } = useProducts()
  const { addItem } = useCart()

  useLoad(() => {
    console.log('Product list page loaded.')
  })

  const handleAddToCart = (product: any) => {
    // 这里需要根据实际产品数据创建CartItem
    const cartItem = {
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      stock: product.stock,
    }
    addItem(cartItem)
  }

  const handleCategoryFilter = (categoryId: number) => {
    setFilter({ ...filter, categoryId: categoryId === -1 ? undefined : categoryId })
  }

  const handleSearch = (searchQuery: string) => {
    setFilter({ ...filter, search: searchQuery || undefined })
  }

  const handleClearSearch = () => {
    setFilter({ ...filter, search: undefined })
  }

  const handlePriceChange = (minPrice?: number, maxPrice?: number) => {
    setFilter({ ...filter, minPrice, maxPrice })
  }

  const handleRatingChange = (minRating?: number) => {
    setFilter({ ...filter, minRating })
  }

  const handleSortChange = (newSortBy: any) => {
    setSortBy(newSortBy)
  }


  return (
    <View style={{ minHeight: '100vh', backgroundColor: theme.colors.gray100 }}>
      {/* 顶部搜索栏 */}
      <View style={{
        padding: theme.spacing.md,
        backgroundColor: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.gray200}`,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm
      }}
      >
        <SearchBar
          placeholder='搜索商品名称'
          onSearch={handleSearch}
          onClear={handleClearSearch}
          defaultValue={filter.search || ''}
          debounceMs={500}
          showClearButton
          style={{ flex: 1 }}
        />
        <CartSummary compact />
      </View>

      {/* 分类筛选 */}
      <View style={{
        backgroundColor: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.gray200}`
      }}
      >
        <CategoryFilter
          categories={categories}
          selectedCategory={filter.categoryId}
          onSelectCategory={handleCategoryFilter}
          showCount
          scrollable
        />
      </View>

      {/* 筛选按钮和状态 */}
      <View style={{
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.gray200}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      >
        <View style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
          <Icon name='filter' size='sm' color={theme.colors.primary} />
          <Text style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray700 }}>
            筛选
          </Text>
          {(filter.minPrice || filter.maxPrice || filter.minRating) && (
            <View style={{
              backgroundColor: theme.colors.primary,
              borderRadius: '10px',
              padding: '2px 8px',
              marginLeft: theme.spacing.xs
            }}
            >
              <Text style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.white }}>
                已启用
              </Text>
            </View>
          )}
        </View>

        <View style={{ display: 'flex', gap: theme.spacing.sm }}>
          {(filter.minPrice || filter.maxPrice || filter.minRating) && (
            <Text
              style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.primary, cursor: 'pointer' }}
              onClick={() => setFilter({ ...filter, minPrice: undefined, maxPrice: undefined, minRating: undefined })}
            >
              清除筛选
            </Text>
          )}
          <Icon name='arrow-down' size='sm' color={theme.colors.gray600} />
        </View>
      </View>

      {/* 价格和评分筛选面板 */}
      <View style={{
        backgroundColor: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.gray200}`,
        maxHeight: '400px',
        overflow: 'hidden'
      }}
      >
        <PriceRatingFilter
          minPrice={filter.minPrice}
          maxPrice={filter.maxPrice}
          minRating={filter.minRating}
          onPriceChange={handlePriceChange}
          onRatingChange={handleRatingChange}
          priceRange={{ min: 0, max: 1000 }}
        />
      </View>

      {/* 排序选择器 */}
      <View style={{
        backgroundColor: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.gray200}`,
        padding: theme.spacing.sm
      }}
      >
        <SortSelector
          sortBy={sortBy}
          onSortChange={handleSortChange}
          showLabel={false}
          compact
        />
      </View>

      {/* 产品列表 */}
      <View style={{ flex: 1 }}>
        <ProductList
          products={products}
          loading={loading}
          error={error}
          onAddToCart={handleAddToCart}
          layout='grid'
          columns={2}
          emptyMessage='暂无商品，请尝试其他分类'
        />
      </View>

      {/* 底部提示和加载更多 */}
      <View style={{
        backgroundColor: theme.colors.white,
        borderTop: `1px solid ${theme.colors.gray200}`
      }}
      >
        {!loading && products.length > 0 && (
          <View style={{
            padding: theme.spacing.md,
            textAlign: 'center',
            borderBottom: `1px solid ${theme.colors.gray200}`
          }}
          >
            <Text style={{ color: theme.colors.gray600, fontSize: theme.typography.fontSize.sm }}>
              共 {pagination.total} 件商品，当前显示 {products.length} 件
            </Text>
          </View>
        )}

        <LoadMore
          loading={loading}
          hasMore={pagination.hasMore}
          onLoadMore={loadMore}
          loadingText='正在加载更多商品...'
          noMoreText='已加载所有商品'
          loadMoreText='加载更多'
        />
      </View>

      {/*/!* 底部导航按钮 *!/*/}
      {/*<View style={{*/}
      {/*  backgroundColor: theme.colors.white,*/}
      {/*  borderTop: `1px solid ${theme.colors.gray200}`,*/}
      {/*  padding: theme.spacing.md,*/}
      {/*  display: 'flex',*/}
      {/*  flexDirection: 'row',*/}
      {/*  gap: theme.spacing.md*/}
      {/*}}*/}
      {/*>*/}
      {/*  <Button*/}
      {/*    onClick={() => {*/}
      {/*      // 刷新首页，重新加载当前页面*/}
      {/*      navigateTo({ url: '/pages/index/index' })*/}
      {/*    }}*/}
      {/*    style={{*/}
      {/*      flex: 1,*/}
      {/*      backgroundColor: theme.colors.primary,*/}
      {/*      color: theme.colors.white,*/}
      {/*      borderRadius: theme.borderRadius.md,*/}
      {/*      border: 'none',*/}
      {/*      borderWidth: 0*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    首页*/}
      {/*  </Button>*/}
      {/*  <Button*/}
      {/*    onClick={() => {*/}
      {/*      // 跳转到订单历史页面*/}
      {/*      navigateTo({ url: '/pages/order/history' })*/}
      {/*    }}*/}
      {/*    style={{*/}
      {/*      flex: 1,*/}
      {/*      backgroundColor: theme.colors.white,*/}
      {/*      color: theme.colors.primary,*/}
      {/*      borderRadius: theme.borderRadius.md,*/}
      {/*      border: `1px solid ${theme.colors.primary}`,*/}
      {/*      borderWidth: 1*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    订单*/}
      {/*  </Button>*/}
      {/*</View>*/}
      <BottomNavigation activeTab={'home'}/>
    </View>
  )
}
