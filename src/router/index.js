import Vue from 'vue'
import VueRouter from 'vue-router'
import { routerTokenAuth } from '@/api/login-net'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/page'
  },
  {
    path: '/page',
    component: () => import('@/views/page/Page.vue'),
    children: [
      {
        path: '',
        redirect: 'home'
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/page/home/Home.vue'),
      },
      {
        path: 'come',
        name: 'come',
        meta: {
          keepAlive: false
        },
        component: () => import('@/views/page/come/Come.vue'),
      },
      {
        path: 'channel',
        name: 'channel',
        component: () => import('@/views/page/channel/Channel.vue'),
      },
      {
        path: 'notice',
        name: 'notice',
        component: () => import('@/views/page/notice/Notice.vue'),
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/page/user/User.vue'),
      },
    ]
  },
  {
    path: '/setting',
    component: () => import('@/views/editor/Setting.vue')
  },
  {
    path: '/login-user',
    name: 'login-user',
    component: () => import('@/views/login/LoginUser.vue')
  },
  {
    path: '/login-input-password',
    name: 'login-input-password',
    component: () => import('@/views/login/LoginInputPassword.vue')
  },
  {
    path: '/register-user',
    name: 'register-user',
    component: () => import('@/views/login/RegisterUser.vue')
  },
  {
    path: '/register-set-password',
    name: 'register-set-password',
    component: () => import('@/views/login/RegisterSetPassword.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/detail/Detail.vue')
  },
  {
    path: '/tieba',
    name: 'tieba',
    meta: {
      keepAlive: false
    },
    component: () => import('@/views/tieba/Tieba.vue')
  },
  {
    path: '/create',
    name: 'create-tieba',
    component: () => import('@/views/tieba/CreateTieba.vue')
  },
  {
    path: '/auth',
    name: 'apply-auth',
    component: () => import('@/views/tieba/ApplyAuth.vue')
  },
  {
    path: '/tieba-msg',
    name: 'tieba-msg',
    component: () => import('../views/tieba/TiebaMsg.vue')
  },
  {
    path:'/reply',
    name:'reply',
    component:()=>import('../views/page/notice/NoticeReply.vue')
  },
  {
    path:'/outher',
    name:'outher',
    component:()=>import('../views/page/notice/NoticeOuther.vue')
  },
  {
    path:'/user-detail',
    name:'user-detail',
    component:()=>import('../views/page/user/UserDetail.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (['/page/user', '/page/notice'].includes(to.path)) {
    setTimeout(async () => {
      const res = await routerTokenAuth()
      if (res && res.status !== 200) {
        localStorage.removeItem('token')
        router.replace({ name: "login-user" });
        return
      }
    })
  }
  next()
})

export default router
