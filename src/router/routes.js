// 菜单
import MenuIndex from '@/components/menu/menuIndex.vue'

let router = [
  // 专辑审核
  {
    path: '/ad',
    component: MenuIndex,
    redirect: '/ad',
    meta: {
      title: '广告管理', // 菜单标题
      icon: 'el-icon-folder', // 图标
      hasSubMenu: false, // 是否包含子菜单，false 没有子菜单；true 有子菜单
    },
    children: [
      {
        path: '/ad',
        name: 'ad',
        meta: {
          title: '广告管理', // 菜单标题,
          hasSubMenu: false, // 是否包含子菜单，false 没有子菜单；true 有子菜单
        },
        component: () => import('../views/adPage.vue'),
      }
    ]
  },
  // 音频审核
  {
    path: '/video',
    component: MenuIndex,
    redirect: '/video',
    meta: {
      title: '贴片视频管理', // 菜单标题
      icon: 'el-icon-headset', // 图标
      hasSubMenu: false, // 是否包含子菜单，false 没有子菜单；true 有子菜单
    },
    children: [
      {
        path: '/video',
        name: 'video',
        meta: {
          title: '贴片视频管理', // 菜单标题,
          hasSubMenu: false, // 是否包含子菜单，false 没有子菜单；true 有子菜单
        },
        component: () => import('../views/videoPage.vue'),
      }
    ]
  }
]
export const projectRoute = [
  ...router
]