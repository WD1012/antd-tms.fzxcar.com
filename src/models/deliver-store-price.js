//送库费models
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { commons, config } from 'utils'
import * as deliverStorePriceService from 'services/deliverStorePriceService'
import { pageModel } from './common'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'deliverStorePrice',

  state: {
    currentItem: [],
    modalVisible: false,
    deliverStorePriceList:[],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/deliver-store-price') {
          dispatch({
            type: 'query',
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload }, { call, put }) {
      const data = yield call(deliverStorePriceService.list, payload)

      if (data) {
        yield put({
          type: 'putItem',
          payload: {
            deliverStorePriceList: data.data.data,
          },
        })
      }
    },


    * update ({ payload = {} }, { call, put }) {
      const res = yield call(deliverStorePriceService.update,payload.data,payload.userPin)
      if(res) {
        yield put({
          type: 'query',
        })
        return 200
      }
    },
  },

  reducers: {
    putItem (state, { payload }) {
      return { ...state,deliverStorePriceList: payload.deliverStorePriceList,}
    },
    updateItemState (state, { payload }) {
      return {
        ...state,
        currentItem: payload,
      }
    },
  },
})
