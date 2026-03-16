import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { theme } from '../../styles/theme';
import { isWeapp, isH5 } from '../../utils/platform';
import {
  PageTransition,
  ComponentTransition,
  CardTransition,
  ButtonTransition,
  ListItemTransition,
  ImageTransition,
  usePageTransition
} from './index';

const TransitionDemo: React.FC = () => {
  const { startTransition, endTransition } = usePageTransition();
  const [activeTab, setActiveTab] = useState('page');
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const platformInfo = isWeapp() ? '微信小程序' : isH5() ? 'H5网页' : '其他平台';

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const transitionTypes = [
    { id: 'fade', name: '淡入淡出', desc: '元素透明度变化' },
    { id: 'slide-up', name: '向上滑动', desc: '从下方滑入' },
    { id: 'slide-down', name: '向下滑动', desc: '从上方滑入' },
    { id: 'slide-left', name: '向左滑动', desc: '从右侧滑入' },
    { id: 'slide-right', name: '向右滑动', desc: '从左侧滑入' },
    { id: 'scale', name: '缩放', desc: '大小变化' },
    { id: 'bounce', name: '弹跳', desc: '弹性效果' },
    { id: 'pulse', name: '脉冲', desc: '呼吸效果' },
    { id: 'shake', name: '抖动', desc: '左右摇晃' },
    { id: 'flip', name: '翻转', desc: '3D翻转效果' },
    { id: 'rotate', name: '旋转', desc: '持续旋转' }
  ];

  const componentTypes = [
    { id: 'mount', name: '加载时', desc: '组件挂载时触发' },
    { id: 'hover', name: '悬停时', desc: '鼠标悬停时触发' },
    { id: 'click', name: '点击时', desc: '点击时触发' },
    { id: 'visible', name: '可见时', desc: '进入视口时触发' }
  ];

  return (
    <ScrollView style={{ backgroundColor: theme.colors.gray50, minHeight: '100vh' }}>
      <View style={{ padding: theme.spacing.lg }}>
        <Text style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.gray800,
          marginBottom: theme.spacing.md
        }}>
          页面和组件过渡动画演示
        </Text>
        
        <Text style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray600,
          marginBottom: theme.spacing.xl
        }}>
          当前平台: {platformInfo} | {isH5() ? '支持完整动画' : '优化性能动画'}
        </Text>

        {/* 标签切换 */}
        <View style={{
          display: 'flex',
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.sm,
          marginBottom: theme.spacing.lg,
          boxShadow: theme.shadows.sm
        }}>
          {['page', 'component', 'interaction'].map((tab) => (
            <View
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: theme.spacing.sm,
                textAlign: 'center',
                backgroundColor: activeTab === tab ? theme.colors.primary : 'transparent',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer'
              }}
            >
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: activeTab === tab ? theme.colors.white : theme.colors.gray600
              }}>
                {tab === 'page' ? '页面过渡' : 
                 tab === 'component' ? '组件动画' : '交互效果'}
              </Text>
            </View>
          ))}
        </View>

        {/* 页面过渡演示 */}
        {activeTab === 'page' && (
          <View style={{
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
            boxShadow: theme.shadows.sm
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray800,
              marginBottom: theme.spacing.md
            }}>
              页面过渡效果
            </Text>
            
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginBottom: theme.spacing.lg
            }}>
              模拟页面切换时的过渡动画效果
            </Text>

            <View style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: theme.spacing.md,
              marginBottom: theme.spacing.lg
            }}>
              {transitionTypes.slice(0, 6).map((type) => (
                <View
                  key={type.id}
                  onClick={() => startTransition(type.id as any)}
                  style={{
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.gray50,
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.gray200}`,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <Text style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.gray800,
                    marginBottom: theme.spacing.xs
                  }}>
                    {type.name}
                  </Text>
                  <Text style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.gray600
                  }}>
                    {type.desc}
                  </Text>
                </View>
              ))}
            </View>

            <PageTransition
              type="fade"
              speed="normal"
              isEntering={true}
            >
              <View style={{
                padding: theme.spacing.lg,
                backgroundColor: theme.colors.gray50,
                borderRadius: theme.borderRadius.md,
                border: `1px dashed ${theme.colors.gray300}`
              }}>
                <Text style={{
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.gray800,
                  textAlign: 'center',
                  marginBottom: theme.spacing.sm
                }}>
                  当前页面内容区域
                </Text>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray600,
                  textAlign: 'center'
                }}>
                  点击上方按钮体验不同的页面过渡效果
                </Text>
              </View>
            </PageTransition>
          </View>
        )}

        {/* 组件动画演示 */}
        {activeTab === 'component' && (
          <View style={{
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
            boxShadow: theme.shadows.sm
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray800,
              marginBottom: theme.spacing.md
            }}>
              组件动画效果
            </Text>
            
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginBottom: theme.spacing.lg
            }}>
              不同触发方式的组件动画
            </Text>

            <View style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg
            }}>
              {/* 加载时动画 */}
              <View>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray700,
                  marginBottom: theme.spacing.sm
                }}>
                  加载时动画 (mount)
                </Text>
                <View style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: theme.spacing.sm
                }}>
                  {['fade', 'scale', 'slide-up', 'bounce'].map((type) => (
                    <ComponentTransition
                      key={type}
                      type={type as any}
                      trigger="mount"
                      duration={500}
                    >
                      <View style={{
                        padding: theme.spacing.md,
                        backgroundColor: theme.colors.primary,
                        borderRadius: theme.borderRadius.md,
                        minWidth: '80px'
                      }}>
                        <Text style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.white,
                          textAlign: 'center'
                        }}>
                          {type}
                        </Text>
                      </View>
                    </ComponentTransition>
                  ))}
                </View>
              </View>

              {/* 悬停动画 (仅H5) */}
              {isH5() && (
                <View>
                  <Text style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.gray700,
                    marginBottom: theme.spacing.sm
                  }}>
                    悬停动画 (hover) - 鼠标悬停体验
                  </Text>
                  <View style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: theme.spacing.sm
                  }}>
                    {['pulse', 'shake', 'scale', 'bounce'].map((type) => (
                      <ComponentTransition
                        key={type}
                        type={type as any}
                        trigger="hover"
                        duration={300}
                      >
                        <View style={{
                          padding: theme.spacing.md,
                          backgroundColor: theme.colors.success,
                          borderRadius: theme.borderRadius.md,
                          minWidth: '80px',
                          cursor: 'pointer'
                        }}>
                          <Text style={{
                            fontSize: theme.typography.fontSize.sm,
                            color: theme.colors.white,
                            textAlign: 'center'
                          }}>
                            {type}
                          </Text>
                        </View>
                      </ComponentTransition>
                    ))}
                  </View>
                </View>
              )}

              {/* 点击动画 */}
              <View>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray700,
                  marginBottom: theme.spacing.sm
                }}>
                  点击动画 (click) - 点击体验
                </Text>
                <View style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: theme.spacing.sm
                }}>
                  {['shake', 'pulse', 'scale', 'bounce'].map((type) => (
                    <ComponentTransition
                      key={type}
                      type={type as any}
                      trigger="click"
                      duration={300}
                    >
                      <View style={{
                        padding: theme.spacing.md,
                        backgroundColor: theme.colors.warning,
                        borderRadius: theme.borderRadius.md,
                        minWidth: '80px',
                        cursor: 'pointer'
                      }}>
                        <Text style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.white,
                          textAlign: 'center'
                        }}>
                          {type}
                        </Text>
                      </View>
                    </ComponentTransition>
                  ))}
                </View>
              </View>

              {/* 列表项动画 */}
              <View>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray700,
                  marginBottom: theme.spacing.sm
                }}>
                  列表项入场动画 (stagger)
                </Text>
                <View style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.sm
                }}>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <ListItemTransition key={item} index={item} staggerDelay={100}>
                      <View style={{
                        padding: theme.spacing.md,
                        backgroundColor: theme.colors.gray100,
                        borderRadius: theme.borderRadius.md,
                        borderLeft: `4px solid ${theme.colors.primary}`
                      }}>
                        <Text style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.gray800
                        }}>
                          列表项 #{item}
                        </Text>
                        <Text style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.gray600,
                          marginTop: theme.spacing.xs
                        }}>
                          延迟 {item * 100}ms 入场
                        </Text>
                      </View>
                    </ListItemTransition>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 交互效果演示 */}
        {activeTab === 'interaction' && (
          <View style={{
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
            boxShadow: theme.shadows.sm
          }}>
            <Text style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray800,
              marginBottom: theme.spacing.md
            }}>
              交互效果演示
            </Text>
            
            <Text style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray700,
              marginBottom: theme.spacing.lg
            }}>
              实际应用中的交互动画效果
            </Text>

            <View style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg
            }}>
              {/* 卡片悬停效果 */}
              <View>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray700,
                  marginBottom: theme.spacing.sm
                }}>
                  卡片悬停效果
                </Text>
                <View style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: theme.spacing.md
                }}>
                  {[1, 2, 3, 4].map((item) => (
                    <CardTransition key={item} hoverEffect={true} clickEffect={true}>
                      <View style={{
                        padding: theme.spacing.md,
                        backgroundColor: theme.colors.white,
                        borderRadius: theme.borderRadius.lg,
                        border: `1px solid ${theme.colors.gray200}`,
                        boxShadow: theme.shadows.sm
                      }}>
                        <View style={{
                          width: '100%',
                          height: '80px',
                          backgroundColor: theme.colors.gray200,
                          borderRadius: theme.borderRadius.md,
                          marginBottom: theme.spacing.sm
                        }} />
                        <Text style={{
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.gray800,
                          marginBottom: theme.spacing.xs
                        }}>
                          产品卡片 #{item}
                        </Text>
                        <Text style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.gray600
                        }}>
                          {isH5() ? '鼠标悬停或点击体验效果' : '点击体验效果'}
                        </Text>
                      </View>
                    </CardTransition>
                  ))}
                </View>
              </View>

              {/* 按钮交互效果 */}
              <View>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray700,
                  marginBottom: theme.spacing.sm
                }}>
                  按钮交互效果
                </Text>
                <View style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: theme.spacing.sm
                }}>
                  <ButtonTransition type="scale">
                    <View style={{
                      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                      backgroundColor: theme.colors.primary,
                      borderRadius: theme.borderRadius.md,
                      cursor: 'pointer'
                    }}>
                      <Text style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.white,
                        fontWeight: theme.typography.fontWeight.medium
                      }}>
                        按压缩放效果
                      </Text>
                    </View>
                  </ButtonTransition>

                  <ButtonTransition type="bounce">
                    <View style={{
                      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                      backgroundColor: theme.colors.success,
                      borderRadius: theme.borderRadius.md,
                      cursor: 'pointer'
                    }}>
                      <Text style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.white,
                        fontWeight: theme.typography.fontWeight.medium
                      }}>
                        点击弹跳效果
                      </Text>
                    </View>
                  </ButtonTransition>
                </View>
              </View>

              {/* 图片加载过渡 */}
              <View>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray700,
                  marginBottom: theme.spacing.sm
                }}>
                  图片加载过渡效果
                </Text>
                <ImageTransition loaded={imageLoaded}>
                  <View
                    style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: imageLoaded ? theme.colors.gray300 : theme.colors.gray200,
                      borderRadius: theme.borderRadius.lg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundImage: imageLoaded 
                        ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' 
                        : 'none'
                    }}
                    onClick={handleImageLoad}
                  >
                    {!imageLoaded && (
                      <Text style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.gray600
                      }}>
                        点击模拟图片加载
                      </Text>
                    )}
                    {imageLoaded && (
                      <Text style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.white,
                        fontWeight: theme.typography.fontWeight.medium
                      }}>
                        图片已加载完成
                      </Text>
                    )}
                  </View>
                </ImageTransition>
              </View>

              {/* 下拉菜单动画 */}
              <View>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray700,
                  marginBottom: theme.spacing.sm
                }}>
                  下拉菜单动画
                </Text>
                <View style={{ position: 'relative' }}>
                  <View
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      padding: theme.spacing.md,
                      backgroundColor: theme.colors.gray100,
                      borderRadius: theme.borderRadius.md,
                      border: `1px solid ${theme.colors.gray300}`,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.gray800
                    }}>
                      点击展开下拉菜单
                    </Text>
                    <Text style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.gray600
                    }}>
                      {dropdownOpen ? '▲' : '▼'}
                    </Text>
                  </View>
                  
                  {dropdownOpen && (
                    <ComponentTransition
                      type="slide-down"
                      trigger="mount"
                      duration={200}
                    >
                      <View style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: theme.colors.white,
                        borderRadius: theme.borderRadius.md,
                        border: `1px solid ${theme.colors.gray300}`,
                        boxShadow: theme.shadows.md,
                        marginTop: theme.spacing.xs,
                        zIndex: 100
                      }}>
                        {['选项一', '选项二', '选项三', '选项四'].map((option) => (
                          <View
                            key={option}
                            style={{
                              padding: theme.spacing.md,
                              borderBottom: `1px solid ${theme.colors.gray200}`,
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              console.log('选择了:', option);
                              setDropdownOpen(false);
                            }}
                          >
                            <Text style={{
                              fontSize: theme.typography.fontSize.sm,
                              color: theme.colors.gray800
                            }}>
                              {option}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </ComponentTransition>
                  )}
                </View>
              </View>

              {/* 模态框动画 */}
              <View>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.gray700,
                  marginBottom: theme.spacing.sm
                }}>
                  模态框动画
                </Text>
                <View
                  onClick={() => setShowModal(true)}
                  style={{
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.md,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <Text style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.white,
                    fontWeight: theme.typography.fontWeight.medium
                  }}>
                    打开模态框
                  </Text>
                </View>

                {showModal && (
                  <ComponentTransition
                    type="scale"
                    trigger="mount"
                    duration={300}
                  >
                    <View style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                      padding: theme.spacing.lg
                    }}>
                      <View style={{
                        backgroundColor: theme.colors.white,
                        borderRadius: theme.borderRadius.lg,
                        padding: theme.spacing.lg,
                        maxWidth: '400px',
                        width: '100%'
                      }}>
                        <Text style={{
                          fontSize: theme.typography.fontSize.lg,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.gray800,
                          marginBottom: theme.spacing.md
                        }}>
                          模态框标题
                        </Text>
                        <Text style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.gray600,
                          marginBottom: theme.spacing.lg
                        }}>
                          这是一个带有动画效果的模态框。内容可以在这里显示。
                        </Text>
                        <View style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: theme.spacing.sm
                        }}>
                          <View
                            onClick={() => setShowModal(false)}
                            style={{
                              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                              backgroundColor: theme.colors.gray200,
                              borderRadius: theme.borderRadius.md,
                              cursor: 'pointer'
                            }}
                          >
                            <Text style={{
                              fontSize: theme.typography.fontSize.sm,
                              color: theme.colors.gray800
                            }}>
                              取消
                            </Text>
                          </View>
                          <View
                            onClick={() => setShowModal(false)}
                            style={{
                              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                              backgroundColor: theme.colors.primary,
                              borderRadius: theme.borderRadius.md,
                              cursor: 'pointer'
                            }}
                          >
                            <Text style={{
                              fontSize: theme.typography.fontSize.sm,
                              color: theme.colors.white,
                              fontWeight: theme.typography.fontWeight.medium
                            }}>
                              确认
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </ComponentTransition>
                )}
              </View>
            </View>
          </View>
        )}

        {/* 平台特性说明 */}
        <View style={{
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          boxShadow: theme.shadows.sm
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray800,
            marginBottom: theme.spacing.md
          }}>
            平台特性说明
          </Text>
          
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md
          }}>
            {isWeapp() && (
              <View style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.gray50,
                borderRadius: theme.borderRadius.md
              }}>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.success,
                  fontWeight: theme.typography.fontWeight.medium,
                  marginBottom: theme.spacing.xs
                }}>
                  🎯 微信小程序优化策略
                </Text>
                <Text style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.gray600
                }}>
                  • 使用CSS transition实现基础动画，性能更佳
                  {'\n'}• 简化复杂动画，减少GPU负担
                  {'\n'}• 优化触摸反馈，提升交互体验
                  {'\n'}• 适配小程序特有的动画限制
                </Text>
              </View>
            )}
            
            {isH5() && (
              <View style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.gray50,
                borderRadius: theme.borderRadius.md
              }}>
                <Text style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.primary,
                  fontWeight: theme.typography.fontWeight.medium,
                  marginBottom: theme.spacing.xs
                }}>
                  🌐 H5网页完整特性
                </Text>
                <Text style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.gray600
                }}>
                  • 支持完整的CSS animation特性
                  {'\n'}• 鼠标悬停(hover)交互效果
                  {'\n'}• IntersectionObserver实现视口触发
                  {'\n'}• 3D变换和复杂动画效果
                  {'\n'}• 完整的可访问性支持
                </Text>
              </View>
            )}

            <View style={{
              padding: theme.spacing.md,
              backgroundColor: theme.colors.gray50,
              borderRadius: theme.borderRadius.md
            }}>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.warning,
                fontWeight: theme.typography.fontWeight.medium,
                marginBottom: theme.spacing.xs
              }}>
                ⚡ 性能与可访问性
              </Text>
              <Text style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.gray600
              }}>
                • 所有动画都支持prefers-reduced-motion
                {'\n'}• 移动端设备自动简化复杂动画
                {'\n'}• 使用will-change优化渲染性能
                {'\n'}• 避免布局抖动和重绘
                {'\n'}• 动画时长控制在300ms以内，保持响应性
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default TransitionDemo;