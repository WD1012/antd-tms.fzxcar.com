//承运商管理models
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { pageModel } from '../common'
import * as manageCarrierService from 'services/carrier/carrierService'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'manageCarrierAdd',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  reducers: {
    showModal (state, { payload }) {
      return { ...state, provincListOption: payload, modalVisible: true,}
    },

    hideModal (state) {
      return {...state, modalVisible: false,}
    },
  },

  subscriptions: {

    setup ({ dispatch, history }) {
      history.listen((location) => {

        if (location.pathname === '/manage-carrier-add') {
          const payload = queryString.parse(location.search) || {
            page: 1,
            pageSize: 10,
          }
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(manageCarrierService.list, payload)
      console.log(data)

      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.records,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.total,
            },
          },
        })
      }
    },

  },


})
