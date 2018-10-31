/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import * as transportInfoService from 'services/transportInfoService'
import * as transportRegularInfoService from 'services/transportRegularInfoService'
import * as manageCarrierLineService from '../services/carrier/carrierLineService'

import { pageModel } from './common'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'transportInfo',

  state: {
    currentItem: {},
    modalVisible: false,
    modalUpdateVisible:false,
    modalType: 'create',
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    allStates: [],
    yesNoStates: [],
    startAddressLabel: [],
    endAddressLabel: [],
    regionResultList: [],
    addrOptions:[],
    addrFilterOptions:[],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/transport-info') {
          const payload = queryString.parse(location.search) || { page: 1, pageSize: 10 }
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

      //const addrData = yield call(manageCarrierLineService.addr, {})
      //const regionResult = yield call(transportInfoService.getRegionList)
      const regionResult = yield call(manageCarrierLineService.addr, {})

      if(regionResult){
        yield put({ type: 'initFilter',
          payload: {
            addrOptions:  regionResult.data.data.map((item) =>{
              const m = {'value':item.id,'label':item.desc,'isLeaf': false};
              return m;
            }),
          }
        })
      }

      const data = yield call(transportInfoService.list, payload)

      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.data.records,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.data.total,
            },
          },
        })
      }

      const states = yield call(transportRegularInfoService.getStates)
      if (states) {
        yield put({ type: 'yesNoStates', payload: {
          yesNoStates:states.data.data,
        }})
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(transportInfoService.remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {

      const data = yield call(transportInfoService.create, payload)
      if (data) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
        return 200
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {

      const data = yield call(transportInfoService.updateRecord, payload.data,payload.id)
      if (data) {
        yield put({ type: 'hideUpdateModal' })
        //yield put({ type: 'query' })
        return 200
      } else {
        throw data
      }
    },
    * pauseStatus ({ payload }, { select, call, put }) {
      const data = yield call(transportInfoService.updateRecordState, payload)
      if (data) {
        //yield put({ type: 'query' })
        return 200
      } else {
        throw data
      }
    },
    * startStatus ({ payload }, { select, call, put }) {
      const data = yield call(transportInfoService.updateRecordState, payload)
      if (data) {
        //yield put({ type: 'query' })
        return 200
      } else {
        throw data
      }
    },
    * deleteStatus ({ payload }, { select, call, put }) {
      const data = yield call(transportInfoService.deleteRecord, payload)
      if (data) {
        //yield put({ type: 'query' })
        return 200
      } else {
        throw data
      }
    },
    * prepareShowModal ({ payload }, { select, call, put }) {

      const param = {}
      //const addrData = yield call(manageCarrierLineService.addr, param)


      const data = yield call(transportRegularInfoService.getStates)
      if (data) {
        //const regionResult = yield call(transportRegularInfoService.getRegionList)
        const regionResult = yield call(transportInfoService.getRegionList)
        yield put({ type: 'showModal',
          payload:{
            yesNoStates:data.data.data,
            addrOptions: regionResult.data.data.map((item) =>{
              const m = {'value':item.id,'label':item.desc,'isLeaf': false};
              return m;
            }),
          } })
      }
    },

    /*
    * 加载二级行政区域
    * */

    * lazilyAddr ({ payload = {} }, { call, put }) {
      const param = {"provCode":payload.value,"queryType":2}
      const data = yield call(manageCarrierLineService.addr, param)
      if(data){
        payload.loading = false;
        payload.children = data.data.data.map((item) =>{
          const m = {'value':item.id,'label':item.desc,'isLeaf': true};
          return m;})
      }
    },

    /*
    * 加载三级行政区域
    * */
  * lazilyAddr3 ({ payload = {} }, { call, put }) {

    let param = {"provCode":payload.value,"queryType":2}
    let collectionCodeMin = 900000
    let isLeaf = false
    if(payload.value < collectionCodeMin && !Number.isInteger(payload.value / 10000)){
      param = {"cityCode":payload.value,"queryType":3}
      isLeaf = true
    }

    let data
    if(payload.value > collectionCodeMin){
      isLeaf = true
      data = yield call(transportRegularInfoService.get2RegionList, payload.value)
    }else{
      data = yield call(manageCarrierLineService.addr, param)
    }

    if(data){
      payload.loading = false;
      payload.children = data.data.data.map((item) =>{
        const m = {'value':item.id,'label':item.desc,'isLeaf': isLeaf};
        return m;})
    }
  },

    * prepareShowUpdateModal ({ payload }, { select, call, put }) {
      const data = yield call(transportRegularInfoService.getStates)
      if (data) {
        yield put({ type: 'showUpdateModal', payload: {
          yesNoStates:data.data.data,
          currentItem:payload.currentItem,
        }})
      }
    },
  },

  reducers: {
    putRegionResultList (state, { payload }) {
      return { ...state, regionResultList: payload }
    },
    showModal (state, { payload }) {
      return { ...state, yesNoStates: payload.yesNoStates, modalVisible: true,addrOptions: payload.addrOptions, }
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    showUpdateModal (state, { payload }) {
      return { ...state, ...payload, modalUpdateVisible: true }
    },
    hideUpdateModal (state) {
      return { ...state, modalUpdateVisible: false }
    },
    selectStartAddressLabel (state, { payload }) {
      return { ...state, startAddressLabel: payload }
    },
    selectEndAddressLabel (state, { payload }) {
      return { ...state, endAddressLabel: payload }
    },
    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

    yesNoStates (state, { payload }) {
      return { ...state, yesNoStates: payload.yesNoStates }
    },
    initFilter (state, { payload }){
      return { ...state, addrFilterOptions: payload.addrOptions,}
    },

  },
})
