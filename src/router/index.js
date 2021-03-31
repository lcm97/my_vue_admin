import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () =>
                import ('@/views/dashboard/index'),
            meta: { title: '控制台', icon: 'dashboard' }
        }]
    },
    {
        path: '/links',
        component: Layout,
        children: [{
            path: 'index',
            name: 'Links',
            component: () =>
                import ('@/views/links/index'),
            meta: { title: '链接管理', icon: 'el-icon-link' }

        }]
    },
    {
        path: '/company',
        component: Layout,
        children: [{
            path: 'index',
            name: 'Companyn',
            component: () =>
                import ('@/views/company/index'),
            meta: { title: '机构管理', icon: 'el-icon-office-building' }

        }]
    },
    {
        path: '/course',
        component: Layout,
        children: [{
                path: 'index',
                name: 'Course',
                component: () =>
                    import ('@/views/course/index'),
                meta: { title: '课程管理', icon: 'el-icon-collection' }

            }

        ]

    },
    {
        path: '/group',
        component: Layout,
        children: [{
                path: 'index',
                name: 'Group',
                component: () =>
                    import ('@/views/group/index'),
                meta: { title: '拼团管理', icon: 'el-icon-coffee-cup' }

            }

        ]

    },
    {
        path: '/user',
        component: Layout,
        children: [{
                path: 'index',
                name: 'User',
                component: () =>
                    import ('@/views/user/index'),
                meta: { title: '用户管理', icon: 'el-icon-user' }

            }

        ]

    },
    {
        path: '/welfare',
        component: Layout,
        children: [{
                path: 'index',
                name: 'Welfare',
                component: () =>
                    import ('@/views/welfare/index'),
                meta: { title: '福利管理', icon: 'el-icon-present' }

            }

        ]

    },
    {
        path: '/complaint',
        component: Layout,
        children: [{
                path: 'index',
                name: 'Complaint',
                component: () =>
                    import ('@/views/complaint/index'),
                meta: { title: '投诉管理', icon: 'el-icon-phone-outline' }

            }

        ]

    },
    {
        path: '/finance',
        component: Layout,
        name: 'Finance',
        redirect: 'noRedirect',
        meta: {
            title: '财务统计',
            icon: 'el-icon-bank-card'
        },
        children: [{
                path: 'links',
                name: 'LinksChart',
                component: () =>
                    import ('@/views/finance/links-chart'),
                meta: { title: '链接统计', icon: 'el-icon-s-data' }

            },
            {
                path: 'company',
                name: 'CompanyChart',
                component: () =>
                    import ('@/views/finance/company-chart'),
                meta: { title: '机构统计', icon: 'el-icon-s-data' }

            },
            {
                path: 'course',
                name: 'CourseChart',
                component: () =>
                    import ('@/views/finance/course-chart'),
                meta: { title: '课程统计', icon: 'el-icon-s-data' }

            },

        ]

    },
    {
        path: 'external-link',
        component: Layout,
        children: [{
            path: 'http://www.retr0.cn/',
            meta: { title: '外部链接', icon: 'link' }
        }]
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router