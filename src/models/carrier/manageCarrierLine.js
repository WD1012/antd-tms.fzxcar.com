//承运商管理models
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { pageModel } from '../common'
import * as manageCarrierLineService from '../../services/carrier/carrierLineService'

const { prefix } = config


export default modelExtend(pageModel, {
  namespace: 'manageCarrierLine',
  state: {
    currentItem: {},
    addModalVisible: false,
    editModalVisible: false,
    modalType: 'create',
    addrOptions:[],
    carrierList:[],
    modalImportResultVisible:false,
    importResultInfo:{},

  },

  reducers: {
    showAddModalSuccess (state, { payload }) {
      return { ...state, addrOptions: payload.addrOptions,carrierList:payload.carrierList, addModalVisible: true,}
    },

    hideAddModal (state) {
      return {...state, addModalVisible: false,}
    },

    showEditModalSuccess (state, { payload }) {
      return { ...state,currentItem:payload.currentItem, editModalVisible: true,}
    },

    hideEditModal (state) {
      return {...state, editModalVisible: false,}
    },

    initFilter (state, { payload }){
      return { ...state, addrOptions: payload.addrOptions,carrierList:payload.carrierList, }
    },
    showImportResult (state, { payload }) {
      return { ...state,...payload, modalImportResultVisible: true,}
    },

    hideImportResult (state) {
      return {...state, modalImportResultVisible: false,}
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/manage-carrier-line') {
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

      const param = {}
      const addrData = yield call(manageCarrierLineService.addr, param)

      const carrierList = yield call(manageCarrierLineService.carrierList, param)

      if(addrData){
        yield put({ type: 'initFilter',
          payload: {
            addrOptions:  addrData.data.data.map((item) =>{
              const m = {'value':item.id,'label':item.desc,'isLeaf': false};
              return m;
            }),
            carrierList:carrierList.data.data .map((item) =>{
              const m = {"id":item.id,
                "label":item.carrierName,
              }
              return m
            }),
          }
        })
      }

      const data = yield call(manageCarrierLineService.list, payload)

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
    },

    /*
    * 打开添加页面
    * */

    * showAddModal ({ payload = {} }, { call, put }) {
      const param = {}
      const data = yield call(manageCarrierLineService.addr, param)

      const carrierList = yield call(manageCarrierLineService.carrierList, param)

      if (data) {
        yield put({
          type: 'showAddModalSuccess',
          payload: {
            addrOptions:  data.data.data.map((item) =>{
              const m = {'value':item.id,'label':item.desc,'isLeaf': false};
              return m;
            }),
            carrierList:carrierList.data.data .map((item) =>{
              const m = {"id":item.id,
                "label":item.carrierName,
              }
              return m
            }),
          },
        })
      }
    },

    /*
    * 打开编辑页面
    * */
    * showEditModal ({ payload = {} }, { call, put }) {

      const param = {}
      const data = yield call(manageCarrierLineService.addr, param)

      const carrierList = yield call(manageCarrierLineService.carrierList, param)

      if (data) {
        yield put({
          type: 'showEditModalSuccess',
          payload: {
            currentItem:payload
          },
        })
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
    * 添加承运商线路
    * */
    * add ({ payload = {} }, { call, put }) {
      const res = yield call(manageCarrierLineService.add, payload)
      if(res){
        yield put({ type: 'hideAddModal' })
        yield put({ type: 'query' })
        return 200
      }
    },

    * update ({ payload = {} }, { call, put }) {
      const res = yield call(manageCarrierLineService.update, payload.id,payload.data)

      if(res){
        yield put({ type: 'hideEditModal' })
        //yield put({ type: 'query' })
        return 200
      }
    },

    * del ({ payload = {} }, { call, put }) {
      const res = yield call(manageCarrierLineService.del, payload.id,payload.userPin)

      if(res){
        yield put({ type: 'hideEditModal' })
        yield put({ type: 'query' })
        return 200
      }
    },

    * onOff ({ payload = {} }, { call, put }) {
      const res = yield call(manageCarrierLineService.onOff, payload.id,payload.userPin)

      if(res){
        yield put({ type: 'hideEditModal' })
        //yield put({ type: 'query' })
        return 200
      }
    },
  },


})
