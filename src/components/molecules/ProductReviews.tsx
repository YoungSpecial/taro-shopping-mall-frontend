import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Review } from '../../types';
import { ApiService } from '../../services/api';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import { theme } from '../../styles/theme';
import { LoadingSpinner } from '../loading';

interface ProductReviewsProps {
  productId: string;
  productRating: number;
  reviewCount: number;
  maxReviews?: number;
  showHeader?: boolean;
  showLoadMore?: boolean;
  onReviewClick?: (review: Review) => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productRating,
  reviewCount,
  maxReviews = 3,
  showHeader = true,
  showLoadMore = true,
  onReviewClick
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [averageRating, setAverageRating] = useState(productRating);

  const loadReviews = async (pageNum = 1) => {
    try {
      setLoading(true);
      const result = await ApiService.getProductReviews(productId, pageNum, maxReviews);
      
      if (pageNum === 1) {
        setReviews(result.reviews);
      } else {
        setReviews(prev => [...prev, ...result.reviews]);
      }
      
      setAverageRating(result.averageRating);
      setHasMore(result.page < result.totalPages);
      setError(null);
    } catch (err) {
      setError('加载评价失败，请稍后重试');
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadReviews(nextPage);
    }
  };

  const handleReviewClick = (review: Review) => {
    if (onReviewClick) {
      onReviewClick(review);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}周前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const renderRatingStars = (rating: number) => {
    return (
      <View style={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <Icon 
            key={i}
            name={i < Math.floor(rating) ? 'star-filled' : 'star'}
            size="sm" 
            color={i < rating ? theme.colors.warning : theme.colors.gray300}
          />
        ))}
        <Text style={{
          marginLeft: theme.spacing.xs,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray600
        }}>
          {rating.toFixed(1)}
        </Text>
      </View>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <View style={{
        backgroundColor: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.gray200}`
      }}>
        {showHeader && (
          <View style={{
            padding: theme.spacing.lg,
            borderBottom: `1px solid ${theme.colors.gray200}`
          }}>
            <View style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: theme.spacing.sm
            }}>
              <LoadingSpinner.SkeletonText
                lines={1}
                width="120px"
                variant="title"
              />
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <LoadingSpinner.SkeletonRect width="40px" height="24px" />
                <LoadingSpinner.SkeletonCircle size={20} />
              </View>
            </View>
            
            <View style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}>
              <LoadingSpinner.SkeletonRect width="100%" height="6px" />
              <LoadingSpinner.SkeletonText lines={1} width="60px" variant="caption" />
            </View>
          </View>
        )}

        <View style={{
          padding: theme.spacing.lg
        }}>
          {[...Array(3)].map((_, index) => (
            <View
              key={index}
              style={{
                paddingBottom: theme.spacing.lg,
                marginBottom: theme.spacing.lg,
                borderBottom: `1px solid ${theme.colors.gray100}`
              }}
            >
              <View style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: theme.spacing.sm
              }}>
                <View style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <LoadingSpinner.SkeletonCircle size={40} />
                  <View>
                    <LoadingSpinner.SkeletonText lines={1} width="80px" variant="body" />
                    <View style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                      <LoadingSpinner.SkeletonRect width="100px" height="16px" />
                    </View>
                  </View>
                </View>
                
                <LoadingSpinner.SkeletonText lines={1} width="60px" variant="caption" />
              </View>

              <LoadingSpinner.SkeletonText lines={2} width="90%" variant="body" />
              
              <View style={{
                marginTop: theme.spacing.sm,
                display: 'flex',
                flexWrap: 'wrap',
                gap: theme.spacing.sm
              }}>
                <LoadingSpinner.SkeletonRect width="80px" height="80px" />
                <LoadingSpinner.SkeletonRect width="80px" height="80px" />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <View style={{
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.gray200}`
      }}>
        <Icon name="error" size="md" color={theme.colors.danger} />
        <Text style={{
          marginTop: theme.spacing.sm,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray600,
          textAlign: 'center'
        }}>
          {error}
        </Text>
        <Button
          style={{ marginTop: theme.spacing.md }}
          onPress={() => loadReviews()}
          variant="outline"
          size="small"
        >
          重试
        </Button>
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={{
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.gray200}`
      }}>
        {showHeader && (
          <Text style={{
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            marginBottom: theme.spacing.md
          }}>
            商品评价 ({reviewCount})
          </Text>
        )}
        <View style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing.xl
        }}>
          <Icon name="info" size="xl" color={theme.colors.gray400} />
          <Text style={{
            marginTop: theme.spacing.md,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray600,
            textAlign: 'center'
          }}>
            暂无评价，快来成为第一个评价的人吧！
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{
      backgroundColor: theme.colors.white,
      borderBottom: `1px solid ${theme.colors.gray200}`
    }}>
      {showHeader && (
        <View style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.gray200}`
        }}>
          <View style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.sm
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray800
            }}>
              商品评价 ({reviewCount})
            </Text>
            <View style={{ display: 'flex', alignItems: 'center' }}>
              <Text style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.warning,
                marginRight: theme.spacing.xs
              }}>
                {averageRating.toFixed(1)}
              </Text>
              {renderRatingStars(averageRating)}
            </View>
          </View>
          
          <View style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
          }}>
            <View style={{
              flex: 1,
              height: '6px',
              backgroundColor: theme.colors.gray200,
              borderRadius: theme.borderRadius.sm,
              overflow: 'hidden'
            }}>
              <View style={{
                width: `${(averageRating / 5) * 100}%`,
                height: '100%',
                backgroundColor: theme.colors.warning
              }} />
            </View>
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray600,
              minWidth: '60px'
            }}>
              {averageRating.toFixed(1)} / 5.0
            </Text>
          </View>
        </View>
      )}

      <View style={{
        padding: theme.spacing.lg
      }}>
        {reviews.map((review) => (
          <View
            key={review.id}
            onClick={() => handleReviewClick(review)}
            style={{
              paddingBottom: theme.spacing.lg,
              marginBottom: theme.spacing.lg,
              borderBottom: `1px solid ${theme.colors.gray100}`,
              cursor: onReviewClick ? 'pointer' : 'default',
              ...(onReviewClick && {
                ':hover': {
                  backgroundColor: theme.colors.gray50
                }
              })
            }}
          >
            <View style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: theme.spacing.sm
            }}>
              <View style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                {review.userAvatar ? (
                  <Image
                    src={review.userAvatar}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px'
                    }}
                  />
                ) : (
                  <View style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '20px',
                    backgroundColor: theme.colors.gray300,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.white,
                      fontWeight: theme.typography.fontWeight.medium
                    }}>
                      {review.userName.charAt(0)}
                    </Text>
                  </View>
                )}
                <View>
                  <Text style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.gray800
                  }}>
                    {review.userName}
                  </Text>
                  <View style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                    {renderRatingStars(review.rating)}
                    {review.verifiedPurchase && (
                      <View style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        backgroundColor: theme.colors.gray100,
                        borderRadius: theme.borderRadius.sm
                      }}>
                        <Text style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.success,
                          fontWeight: theme.typography.fontWeight.medium
                        }}>
                          已购
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.gray500
              }}>
                {formatDate(review.createdAt)}
              </Text>
            </View>

            {review.title && (
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.gray800,
                marginBottom: theme.spacing.xs
              }}>
                {review.title}
              </Text>
            )}

            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              lineHeight: '1.6',
              marginBottom: theme.spacing.sm
            }}>
              {review.comment}
            </Text>

            {review.images && review.images.length > 0 && (
              <View style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.sm
              }}>
                {review.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: theme.borderRadius.sm,
                      objectFit: 'cover'
                    }}
                  />
                ))}
              </View>
            )}

            <View style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <View style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                <Icon name="heart" size="xs" color={theme.colors.gray500} />
                <Text style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.gray600
                }}>
                  {review.helpfulCount} 人觉得有用
                </Text>
              </View>
              
              <View style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <View style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs,
                  cursor: 'pointer'
                }}>
                  <Icon name="heart" size="xs" color={theme.colors.gray500} />
                  <Text style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.gray600
                  }}>
                    有用
                  </Text>
                </View>
                <View style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs,
                  cursor: 'pointer'
                }}>
                  <Icon name="warning" size="xs" color={theme.colors.gray500} />
                  <Text style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.gray600
                  }}>
                    举报
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {showLoadMore && hasMore && (
          <View style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onPress={handleLoadMore}
              variant="outline"
              size="small"
              loading={loading}
              disabled={loading}
            >
              {loading ? '加载中...' : '加载更多评价'}
            </Button>
          </View>
        )}

        {!hasMore && reviews.length > 0 && (
          <Text style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray500,
            textAlign: 'center',
            padding: theme.spacing.md
          }}>
            没有更多评价了
          </Text>
        )}
      </View>
    </View>
  );
};

export default ProductReviews;