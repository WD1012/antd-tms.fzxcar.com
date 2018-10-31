/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { logout } from 'services/app'
import * as menusService from '../services/menus'
import queryString from 'query-string'
import * as cookie from 'services/cookie'
import * as user from '../services/users'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
    changePassVisible:false,
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {

    * query ({payload,}, { call, put, select }) {
      const { locationPathname } = yield select(_ => _.app)
      const cookieUser = cookie.getCookie('token')

      if (cookieUser) {
        const user = JSON.parse(cookieUser)
        if (user) {
          let list = [
            {
              id: '1',
              icon: 'dashboard',
              name: '工作台',
              route: '/dashboard',
            },
          ]

          const {accountUuid} = JSON.parse(cookieUser)
          const menus = yield call(menusService.menulist, accountUuid)

          menus.data.data.map((item) =>{

            const m = {
              id: ''+item.rid,
              bpid: ''+(item.parentId===0?1:item.parentId),
              name: item.resourceName,
            }

            if(item.parentId ===0){
              m.icon = 'setting'
            }
            if(item.parentId >0 ){
              m.route = item.resourceUrl

              if(item.resourceType === '3'){
                m.mpid = '-1'
              }else{
                m.mpid = item.parentId
              }
            }
            list.push(m)

          })

          /*list.push({
            id: '102',
            mpid: '95',
            name: '物流枢纽',
            route: '/city-logistics-hub',
          })
          list.push({
            id: '103',
            mpid: '95',
            name: '送库费',
            route: '/deliver-store-price',
          })*/

          const list_bak = [
            {
              id: '1',
              icon: 'dashboard',
              name: '工作台',
              route: '/dashboard',
            },
            {
              id: '2',
              bpid: '1',
              name: '用户管理',
              icon: 'user',
              route: '/user',
            },
            {
              id: '8',
              bpid: '1',
              name: '地理信息管理',
              icon: 'setting',
            }, {
              id: '9',
              bpid: '1',
              name: '保险费模板',
              icon: 'setting',
            }, {
              id: '10',
              bpid: '1',
              name: '客户运价',
              icon: 'setting',
            }, {
              id: '12',
              bpid: '1',
              name: '运单管理',
              icon: 'setting',
            },
            {
              id: '81',
              bpid: '8',
              mpid: '8',
              name: '调度员区域管理',
              route: '/manage-location',
            },
            {
              id: '82',
              bpid: '8',
              mpid: '8',
              name: '城市集合管理',
              route: '/city-collection',
            }, {
              id: '91',
              bpid: '9',
              mpid: '9',
              name: '查看模板',
              route: '/insurance-list',
            }, {
              id: '101',
              bpid: '10',
              mpid: '10',
              name: '规则运价',
              route: '/transport-regular-info',
            }, {
              id: '102',
              bpid: '10',
              mpid: '10',
              name: '固定运价',
              route: '/transport-info',
            }, {
              id: '103',
              bpid: '10',
              mpid: '10',
              name: '提验车费配置',
              route: '/vehicle-validate-price-info',
            }, {
              id: '11',
              bpid: '1',
              name: '承运商管理',
              icon: 'user',
            },
            {
              id: '111',
              bpid: '11',
              mpid: '11',
              name: '承运商列表',
              route: '/manage-carrier',
            }, {
              id: '11101',
              bpid: '111',
              mpid: '-1',
              name: '承运商详情',
              route: '/manage-carrier/:id',
            }, {
              id: '114',
              bpid: '11',
              mpid: '11',
              name: '承运商承包线路',
              route: '/manage-carrier-line',
            }, {
              id: '1201',
              bpid: '12',
              mpid: '12',
              name: '运单列表',
              route: '/waybill-manage',
            }, {
              id: '1201',
              bpid: '12',
              mpid: '-1',
              name: '运单详情',
              route: '/waybill-manage/:waybillNo',
            }, {
              id: '1202',
              bpid: '12',
              mpid: '-1',
              name: '运单详情编辑',
              route: '/waybill-manage/edit/:waybillNo',
            }, {
              id: '1203',
              bpid: '12',
              mpid: '-1',
              name: '车辆详情',
              route: '/vehicle-detail/:orderBaseId/:vehicleId',
            }, {
              id: '1204',
              bpid: '12',
              mpid: '-1',
              name: '编辑车辆详情',
              route: '/vehicle-detail/edit/:orderBaseId/:vehicleId',
            }, {
              id: '104',
              bpid: '10',
              mpid: '10',
              name: '服务费配置',
              route: '/serivce-price-info',
            }, {
              id: '105',
              bpid: '10',
              mpid: '10',
              name: '救援车费用配置',
              route: '/recovery-vehicle-price',
            }, {
              id: '106',
              bpid: '10',
              mpid: '10',
              name: '批量车规则配置',
              route: '/tabke-vehicle-price',
            }, {
              id: '107',
              bpid: '10',
              mpid: '10',
              name: '二手车到店费用配置',
              route: '/used-car-driving-price',
            },

          ]

          // const { user } = yield call(query, payload)
          // const { user } = data
          if (user) {
            const permissions = {
              role: EnumRoleType.ADMIN,
            }
            let menu = list
            permissions.visit = list.map(item => item.id)
            yield put({
              type: 'updateState',
              payload: {
                user,
                permissions,
                menu,
              },
            })
            if (location.pathname === '/login') {
              yield put(routerRedux.push({
                pathname: '/user',
              }))
            }
          } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
            yield put(routerRedux.push({
              pathname: '/login',
              search: queryString.stringify({
                from: locationPathname,
              }),
            }))
          }
        } else {
          yield put(routerRedux.push({
            pathname: '/login',
            search: queryString.stringify({
              from: locationPathname,
            }),
          }))
        }
      } else {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    },

    * logout ({
                payload,
              }, { call, put, select }) {
      const { locationPathname } = yield select(_ => _.app)
      const data = yield call(logout,{})
      console.log(data)
      cookie.clearCookie('token')
      // if (data.success) {
      //   yield put({ type: 'query' })
      // } else {
      //   throw (data)
      // }
      yield put(routerRedux.push({
        pathname: '/login',
        search: queryString.stringify({
          from: locationPathname,
        }),
      }))
    },

    * changePass ({
                payload,
              }, { call, put, select }) {
      const data = yield call(user.changePassWord, payload.password)
      if(data){
        yield put({ type: 'hideChangePass' })
        return 200
      }

    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    showChangePass (state) {
      return {
        ...state,
        changePassVisible:true,
      }
    },

    hideChangePass (state) {
      return {
        ...state,
        changePassVisible:false,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
