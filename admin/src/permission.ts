import router from './router'
import { useUserStore } from '@/stores/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to, _from, next) => {
  NProgress.start()

  const userStore = useUserStore()

  if (userStore.token) {
    if (to.path === '/login') {
      next({ path: '/dashboard', replace: true })
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${encodeURIComponent(to.path)}`)
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
