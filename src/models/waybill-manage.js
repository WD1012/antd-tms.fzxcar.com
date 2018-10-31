/* global window */
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { message } from 'antd'
import fetch from 'dva/fetch'
import moment from 'moment'
import * as waybillService from 'services/waybillService'
import * as cityCollectionInfoService from 'services/cityCollectionInfoService'
import { pageModel } from './common'
import * as cookie from 'services/cookie'
import * as payAuditService from 'services/payAuditService'

moment.locale('zh-cn')


const { api } = config
const { wayBill } = api
const { prefix } = config


const date = moment()
  .format('YYYY-MM-DD')
export default modelExtend(pageModel, {
  namespace: 'waybillManage',

  state: {
    currentItem: {},
    tmsOrder: {},
    modalVisible: false,
    quotedPriceModalVisible: false,
    distributionCarriersModalVisible: false,
    modalType: 'create',
    dictOrderStatusArray: [],
    dictOrderTypeArray: [],
    dictTransportTypeArray: [],
    dictvehicleStatusArray: [],
    regionResultList: [],
    quotedPriceList: [],
    distributionCarriersList: [],
    onExport:false,
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',

    payAuditModalVisible: false,


    payautpics:[],
    referPics:[],
    referPicsModalVisible:false,
    picsActiveIndex: 0,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/waybill-manage') {
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

    * query ({ payload = {} }, {select, call, put }) {
      payload.updateUser = 'zzh'



      const onExport = yield select(({ waybillManage }) => waybillManage.onExport)

      if (onExport) {

        const local_cookie = cookie.getCookie('token')
        const local_cookie_string = local_cookie === '' ? '{}' : local_cookie
        const { accountUuid, account } = JSON.parse(local_cookie_string)

        const user = {
          accountUuid,
          account,
        }

        yield put({
          type: 'putExportOff',
        })

        fetch(`${wayBill}/expert-waybill?userCode=zzh`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            user: JSON.stringify(user),
          },
          body: JSON.stringify(payload),
          mode: 'cors',
          credentials: 'include',
          cache: 'default',
        }).then((response) => {
            return response.blob()
          }).then((blob) => {
            let url = window.URL.createObjectURL(blob)
            let a = document.createElement('a')
            a.href = url
            a.download = `运单信息_${date}.xlsx`
            document.body.appendChild(a)
            a.click()


          })
        // if (_data) {
        //   const a = document.createElement('a')
        //   a.textContent = 'download'
        //   a.download = filename
        //   a.href = `data:text/csv;charset=utf-8,${bomCode}${encodeURIComponent(this.state.csv)}`
        //   a.click()
        // }
        const data = yield call(waybillService.list, payload)
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.data.data.records,
              pagination: {
                current: Number(data.data.data.current) || 1,
                pageSize: Number(data.data.data.size) || 10,
                total: data.data.data.total,
              },
            },
          })
        }
        const regionResult = yield call(cityCollectionInfoService.regionProvinceList)
        if (regionResult) {
          yield put({
            type: 'putRegionResultList',
            payload: regionResult.data.data.map(item => ({
              value: item.id,
              label: item.desc,
              isLeaf: false,
            })),
          })
        }
        const dictOrderStatus = yield call(waybillService.getDictOrderStatus)

        if (dictOrderStatus) {
          yield put({
            type: 'putDictOrderStatus',
            payload: dictOrderStatus.data.data,
          })
        }
        const dictOrderType = yield call(waybillService.getDictOrderType)
        if (dictOrderType) {
          yield put({
            type: 'putDictOrderType',
            payload: dictOrderType.data.data,
          })
        }
        const dictTransportType = yield call(waybillService.getDictTransportType)
        if (dictTransportType) {
          yield put({
            type: 'putDictTransportType',
            payload: dictTransportType.data.data,
          })
        }
        const dictvehicleStatus = yield call(waybillService.getDictvehicleStatus)
        if (dictvehicleStatus) {
          yield put({
            type: 'putDictvehicleStatus',
            payload: dictvehicleStatus.data.data,
          })
        }
      } else {
        const data = yield call(waybillService.list, payload)
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.data.data.records,
              pagination: {
                current: Number(data.data.data.current) || 1,
                pageSize: Number(data.data.data.size) || 10,
                total: data.data.data.total,
              },
            },
          })
        }
        const regionResult = yield call(cityCollectionInfoService.regionProvinceList)
        if (regionResult) {
          yield put({
            type: 'putRegionResultList',
            payload: regionResult.data.data.map(item => ({
              value: item.id,
              label: item.desc,
              isLeaf: false,
            })),
          })
        }
        const dictOrderStatus = yield call(waybillService.getDictOrderStatus)

        if (dictOrderStatus) {
          yield put({
            type: 'putDictOrderStatus',
            payload: dictOrderStatus.data.data,
          })
        }
        const dictOrderType = yield call(waybillService.getDictOrderType)
        if (dictOrderType) {
          yield put({
            type: 'putDictOrderType',
            payload: dictOrderType.data.data,
          })
        }
        const dictTransportType = yield call(waybillService.getDictTransportType)
        if (dictTransportType) {
          yield put({
            type: 'putDictTransportType',
            payload: dictTransportType.data.data,
          })
        }
        const dictvehicleStatus = yield call(waybillService.getDictvehicleStatus)
        if (dictvehicleStatus) {
          yield put({
            type: 'putDictvehicleStatus',
            payload: dictvehicleStatus.data.data,
          })
        }
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) },
        })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * multiDelete ({ payload }, { call, put }) {
      const data = yield call(usersService.remove, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: { selectedRowKeys: [] },
        })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = {
        ...payload,
        id,
      }
      const data = yield call(update, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * load2Addr ({ payload = {} }, { select, call, put }) {
      const data = yield call(waybillService.get2RegionList, {
        provCode: payload.value,
        queryType: 2,
      })
      if (data) {
        payload.loading = false
        payload.children = data.data.data.map((item) => {
          const m = {
            value: item.id,
            label: item.desc,
            isLeaf: true,
          }
          return m
        })
      }
    },
    * showSelectQuotedPriceModal ({ payload }, { select, call, put }) {
      const tmsOrder = yield select(state => state.waybillManage.tmsOrder)
      const data = yield call(waybillService.queryOfferpriceDetailList, { tmsOrderId: tmsOrder.currentItem.orderBaseId })
      if (data) {
        yield put({
          type: 'putQuotedPriceList',
          payload: data.data.data.records,
        })
        yield put({
          type: 'showQuotedPriceModalVisible',
          payload,
        })
      }
    },
    /**
     * 弹框
     * @param payload
     * @param select
     * @param call
     * @param put
     */
    * showQuotedPriceModal ({ payload }, { select, call, put }) {
      const data = yield call(waybillService.queryOfferpriceDetailList, { tmsOrderId: payload.currentItem.orderBaseId })
      if (data) {
        yield put({
          type: 'putQuotedPriceList',
          payload: data.data.data.records,
        })
        yield put({
          type: 'showQuotedPriceModalVisible',
          payload,
        })
      }
    },
    * prepareShowdistributionCarriersModal ({ payload }, { select, call, put }) {
      const tmsOrder = yield select(state => state.waybillManage.tmsOrder)

      const data = yield call(waybillService.queryCarrierList, { tmsorderid: tmsOrder.currentItem.orderBaseId })
      if (data) {
        yield put({
          type: 'putDistributionCarriersList',
          payload: data.data.data,
        })
        yield put({
          type: 'showdistributionCarriersModal',
        })
      }
    },
    * distributionCarriers ({ payload }, { select, call, put }) {
      const data = yield call(waybillService.distributionCarriers, payload)
      if (data) {
        message.info('操作成功')
        yield put({
          type: 'cancelQuotedPriceModalVisible',
        })
        yield put({
          type: 'canceldistributionCarriersModalVisible',
        })
        yield put({
          type: 'query',
          payload: payload.filter,
        })
      }
    },
    * distributionCarriersSelector ({ payload }, { select, call, put }) {
      const tmsOrder = yield select(state => state.waybillManage.tmsOrder)
      const distributionCarriers = {
        carrierId: payload.carrierId,
        freightPrice: payload.price,
        //checkPrice:payload.checkPrice,
        insurancePrice:payload.insurancePrice,
        taxationPrice:payload.taxationPrice,


        // offerPriceInfoId: record.id,
        operatorId: 1,
        tmsOrderId: tmsOrder.currentItem.orderBaseId,
      }
      // checkPrice:payload.checkPrice,
      //toStorePrice:payload.toStorePrice,

      if(tmsOrder.currentItem.transportType === 1){
        distributionCarriers.checkPrice = payload.checkPrice
        distributionCarriers.toStorePrice = payload.toStorePrice
      }else{
        distributionCarriers.checkPrice = 0
        distributionCarriers.toStorePrice = 0
      }

      const data = yield call(waybillService.distributionCarriers, distributionCarriers)
      if (data) {
        message.info('操作成功')
        yield put({
          type: 'cancelQuotedPriceModalVisible',
        })
        yield put({
          type: 'canceldistributionCarriersModalVisible',
        })
        const locationQuery = yield select(state => state.app.locationQuery)
        yield put({
          type: 'query',
          payload: payload.filter,
        })
        // window.location.reload()
      }
    },

    * showPayAuditModal ({ payload }, { select, call, put }) {

      const result = yield call(payAuditService.getPayMentPicture, payload.orderBaseId)

      if(result){
        const pics = result.data.data.pictures.map((i) => {
          return {
            src: i.ossPictureUrl,
            thumbnail: i.ossThumbnailUrl,
            pictureType: i.pictureType,
            desc: i.desc,
            ossPictureId: i.ossPictureId,
            picturePosition: i.picturePosition,
            picturePositionName: i.picturePositionName,
            pictureTypeName: i.pictureTypeName,
            pictureId: i.pictureId,
          }
        })

        yield put({
          type: 'showPayAuditModalSuccess',
          payload:{
            currentItem:payload,
            payautpics:pics,
          }
        })
      }


    },

    * payAudit ({ payload }, { select, call, put }) {

      const data = {'orderBaseId':payload.currentItem.orderBaseId,'result':payload.result}
      const result = yield call(payAuditService.authPayMentPicture, data)

      if(result){
        yield put({
          type: 'hidePayAuditModal',
        })
        return 200
      }

    },
  },

  reducers: {

    showModal (state, { payload }) {
      return {
        ...state, ...payload,
        modalVisible: true,
      }
    },
    showdistributionCarriersModal (state, { payload }) {
      return {
        ...state, ...payload,
        distributionCarriersModalVisible: true,
      }
    },
    putQuotedPriceList (state, { payload }) {
      return {
        ...state,
        quotedPriceList: payload,
      }
    },
    putDistributionCarriersList (state, { payload }) {
      return {
        ...state,
        distributionCarriersList: payload,
      }
    },
    showQuotedPriceModalVisible (state, { payload }) {
      return {
        ...state,
        tmsOrder: payload,
        quotedPriceModalVisible: true,
      }
    },
    cancelQuotedPriceModalVisible (state, { payload }) {
      return {
        ...state,
        tmsOrder: {},
        quotedPriceModalVisible: false,
      }
    },
    canceldistributionCarriersModalVisible (state, { payload }) {
      return {
        ...state, ...payload,
        distributionCarriersModalVisible: false,
      }
    },
    putDictOrderStatus (state, { payload }) {
      return {
        ...state,
        dictOrderStatusArray: payload,
      }
    },
    putRegionResultList (state, { payload }) {
      return {
        ...state,
        regionResultList: payload,
      }
    },
    putDictOrderType (state, { payload }) {
      return {
        ...state,
        dictOrderTypeArray: payload,
      }
    },
    putDictTransportType (state, { payload }) {
      return {
        ...state,
        dictTransportTypeArray: payload,
      }
    },
    putDictvehicleStatus (state, { payload }) {
      return {
        ...state,
        dictvehicleStatusArray: payload,
      }
    },

    putExportOn (state, { payload }) {
      return {
        ...state,
        onExport: true,
      }
    },

    putExportOff (state, { payload }) {
      return {
        ...state,
        onExport: false,
      }
    },

    hideModal (state) {
      return {
        ...state,
        modalVisible: false,
      }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return {
        ...state,
        isMotion: !state.isMotion,
      }
    },

    showPayAuditModalSuccess (state, { payload }) {
      return {
        ...state,
        currentItem: payload.currentItem ,
        payAuditModalVisible: true,
        payautpics:payload.payautpics,
      }
    },

    hidePayAuditModal (state) {
      return {
        ...state,
        currentItem:{},
        payAuditModalVisible: false,
      }
    },

    startPicsImgView (state, { payload }) {
      return {
        ...state,
        referPicsModalVisible: true,
        picsActiveIndex: payload.picsActiveIndex,
      }
    },

    updateReferPicsActiveIndex (state, { payload }) {
      return {
        ...state,
        picsActiveIndex: payload.referPicsActiveIndex,
      }
    },

    closeReferPicsImgViewer (state, { payload }) {
      return {
        ...state,
        referPicsModalVisible: false,
      }
    },

  },
})
