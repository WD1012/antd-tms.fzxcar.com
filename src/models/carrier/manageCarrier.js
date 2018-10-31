//承运商管理models
import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { config } from 'utils'
import { pageModel } from '../common'
import * as manageCarrierService from '../../services/carrier/carrierService'
import * as manageCarrierLineService from '../../services/carrier/carrierLineService'
import * as carrierEmployeeService from '../../services/carrier/carrierEmployeeService'
import * as carrierRegionService from '../../services/carrier/carrierRegionService'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'manageCarrier',
  state: {
    currentItem: {},
    preAgainSubmit:false,
    modalVisible: false,
    modalEditVisible:false,
    modalRepairPersonVisible:false,
    modalRepairRegionVisible:false,
    selectedRowKeys: [],
    childData:[],
    personData:[],
    regionData:[],
    addrsData:[],
    linkData:[],
    insurances:[],
    commitAddRegion:{},
    commitAddPerson:{},
    transportTypes:[],
  },

  reducers: {

    initInsurances(state, { payload }) {
      return { ...state,  insurances: payload.insurances,}
    },

    initaddrsData(state, { payload }) {
      return { ...state,  addrsData: payload.addrsData,}
    },

    showModal (state, { payload }) {
      return { ...state,  modalVisible: true,preAgainSubmit:true,}
    },

    hideModal (state) {
      return {...state, modalVisible: false,}
    },

    setPreAgainSubmit(state, { payload }) {
      return { ...state, preAgainSubmit:false,}
    },

    showEditModal (state, { payload }) {
      return { ...state, ...payload, modalEditVisible: true,preAgainSubmit:true,}
    },

    hideEditModal (state) {
      return { ...state,  modalEditVisible: false,}
    },

    loadChildSuccess (state, { payload }) {
      return { ...state, childData:payload.childData, }
    },

    showRepairPersonModalSuccess (state, { payload }) {
      return { ...state, ...payload, modalRepairPersonVisible: true,}
    },

    hideRepairPersonModal (state) {
      return { ...state,  modalRepairPersonVisible: false,}
    },

    showRepairRegionModalSuccess (state, { payload }) {
      return { ...state, ...payload, modalRepairRegionVisible: true,}
    },

    hideRepairRegionModal (state) {
      return { ...state,  modalRepairRegionVisible: false,}
    },

    queryPersonSuccess (state, { payload }) {
      return { ...state, ...payload,}
    },

    queryRegionSuccess (state, { payload }) {
      return { ...state, ...payload,}
    },

    initAddr (state, { payload }){
      return { ...state, addrsData: payload.addrsData, }
    },

    initLink (state, { payload }){
      return { ...state, linkData: payload.linkData, }
    },

    addReginSuccess (state, { payload }){
      return { ...state, commitAddRegion: payload.commitAddRegion, }
    },

    addPersonSuccess (state, { payload }){
      return { ...state, commitAddPerson: payload.commitAddPerson, }
    },


  },

  subscriptions: {
    setup ({ dispatch, history }) {

      history.listen((location) => {
        if (location.pathname === '/manage-carrier') {
          const payload = queryString.parse(location.search)
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put,select }) {

      const insuranceList = yield call(manageCarrierService.insuranceList, payload)

      if(insuranceList){
        yield put({
          type: 'initInsurances',
          payload: {
            insurances:insuranceList.data.data .map((item) =>{
              const m = {"id":item.id,
                "templateName":item.templateName,
              }
              return m
            })
          }
        })
      }

      const addrsData = yield select(({ manageCarrier }) => manageCarrier.addrsData)

      if(addrsData.length === 0){

        const param = {}
        const addrData = yield call(manageCarrierLineService.addr, param)
        yield put({
          type: 'initaddrsData',
          payload: {
            addrsData:  addrData.data.data.map((item) =>{
              const m = {'value':item.id,'label':item.desc,'isLeaf': false};
              return m;
            }),
          }
        })
      }

      const data = yield call(manageCarrierService.list, payload)

      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.data.records.map((item) =>{
              const m = {"id":item.id,
                "carrierName":item.carrierName,
                "carrierShortName":item.carrierShortName,
                "legalPerson":item.legalPerson,
                "transportTypes":item.transportTypes ,
                "taxRate":item.taxRate,
                "registeredCapital":item.registeredCapital,
                "insuranceId":item.insuranceId,
                "businessLicenceLife":item.businessLicenceLife,
                "contractLife":item.contractLife,
                "transportLicenceLife":item.transportLicenceLife,
                "legalTel":item.legalTel,
                "legalCombination":item.legalPerson + "/" + item.legalTel,
                "linkMan":item.linkMan ,
                "linkTel":item.linkTel ,
                "linkCombination":item.linkMan + "/" + item.linkTel,
                "templateName":item.templateName,
                "status":item.status,
                "remark":item.remark,
                "id":item.id,

              }
              return m
            }),
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.data.total,
            },
          },
        })
      }
    },

    * add ({ payload = {} }, { call, put,select }) {

      /*const preAgainSubmit = yield select(({ manageCarrier }) => manageCarrier.preAgainSubmit)

      if(!preAgainSubmit){
        return 400
      }*/
      yield put({ type: 'setPreAgainSubmit' })
      const data = yield call(manageCarrierService.add, payload)

      if(data){
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
        return 200
      }else{
        const error = new Error('请求异常')
        throw error
      }

    },

    * update ({ payload = {} }, { call, put ,select }) {

      /*const preAgainSubmit = yield select(({ manageCarrier }) => manageCarrier.preAgainSubmit)

      if(!preAgainSubmit){
        return 400
      }*/
      yield put({ type: 'setPreAgainSubmit' })

      const data = yield call(manageCarrierService.update, payload.id,payload)

      if(data){
        yield put({ type: 'hideEditModal' })
        //yield put({ type: 'query' })
        return 200
      }else{
        const error = new Error('请求异常')
        throw error
      }

    },

    * onOff ({ payload = {} }, { call, put , select,}) {

      const data = yield call(manageCarrierService.onOff, payload.id,payload.userPin)

      if(data){
        const page = yield select(state => state.manageCarrier.pagination.current)
        const pageSize = yield select(state => state.manageCarrier.pagination.pageSize)

        //yield put({ type: 'query', payload: { page,pageSize } })
        return 200
      }else{
        const error = new Error('请求异常')
        throw error
      }

    },

    * del ({ payload = {} }, { call, put , }) {

      const data = yield call(manageCarrierService.del, payload.id,payload.userPin)
      if(data){
        //yield put({ type: 'query' })
        return 200
      }else{
        const error = new Error('请求异常')
        throw error
      }

    },

    * loadChild ({ payload = {} }, { call, put }) {

      const childData = [];
      for (let i = 0; i < 3; ++i) {
        childData.push({
          key: i,
          date: '辽宁',
          name: '山东',
          upgradeNum: '张一/18789809876',
          status:0
        });
      }

      yield put({
        type: 'loadChildSuccess',
        payload: {
          childData:childData,
        }
      })
    },

    //打开维护人员
    * showRepairPersonModal ({ payload = {} }, { call, put }) {

      const employees = yield call(carrierEmployeeService.list, payload.id)

      if(employees){
        yield put({
          type: 'showRepairPersonModalSuccess',
          payload: {
            currentItem:payload,
            commitAddPerson:{},
            personData:employees.data.data.map((item) =>{
              const m = {"id":item.id,
                "name":item.employeeName,
                "tel":item.linkTel,
                "isMaster":item.isMain,
              }
              return m
            }),
          }
        })
      }

    },

    //打开维护区域
    * showRepairRegionModal ({ payload = {} }, { call, put }) {
      const employees = yield call(carrierEmployeeService.list, payload.id)

      const regionData = yield call(carrierRegionService.list, payload.id)
      const transportType = yield call(carrierRegionService.getTransportType, payload.id)

      const transportTypes = transportType.data.data.map((item) =>{

        let label
        if(item.transportType == 1){
          label = '大板'
        }if(item.transportType == 2){
          label = '救援'
        }if(item.transportType == 3){
          label = '代驾'
        }

        const m = {
          value:item.transportType,
          label:label
        }
        return m

      })
      if(regionData){
        yield put({
          type: 'showRepairRegionModalSuccess',
          payload: {
            currentItem:payload,
            regionData:regionData.data.data.map((item) =>{
              const m = {'id':item.id,'origin':item.startingPlace,'destination': item.destinationPlace,'linkId': item.carrierEmployeeId,'transportType': item.transportType};
              return m;
            }),
            linkData:  employees.data.data.map((item) =>{
              const m = {'value':item.id,'label':item.employeeName + '/' + item.linkTel,'isLeaf': false};
              return m;
            }),
            transportTypes:transportTypes
          }
        })
      }
    },

    * queryRegion ({ payload = {} }, { call, put }) {

      const regionData = yield call(carrierRegionService.list, payload.id)
      if(regionData){
        yield put({
          type: 'queryRegionSuccess',
          payload: {
            regionData:regionData.data.data.map((item) =>{
              const m = {'id':item.id,'origin':item.startingPlace,'destination': item.destinationPlace,'linkId': item.carrierEmployeeId,'transportType': item.transportType};
              return m;
            }),
          }
        })
      }

    },

    * queryPerson ({ payload = {} }, { call, put }) {

      const employees = yield call(carrierEmployeeService.list, payload.id)
      if(employees){
        yield put({
          type: 'queryPersonSuccess',
          payload: {
            personData:employees.data.data.map((item) =>{
              const m = {"id":item.id,
                "name":item.employeeName,
                "tel":item.linkTel,
                "isMaster":item.isMain,
              }
              return m
            }),
          }
        })
      }

    },

    //添加人员信息
    * addPerson ({ payload = {} }, { call, put,select }) {

      const commitAddPerson = yield select(({ manageCarrier }) => manageCarrier.commitAddPerson)

      if(commitAddPerson){
        if(payload.employeeName === commitAddPerson.employeeName
          && payload.linkTel === commitAddPerson.linkTel){
          return 400
        }
      }

      const data = yield call(carrierEmployeeService.add, payload)

      if(data){
        yield put({
          type: 'queryPerson',
          payload: {
            id:payload.carrierId
          },
        })

        yield put({
          type: 'addPersonSuccess',
          payload:{
            commitAddPerson:payload
          } ,
        })

        //yield put({ type: 'query' })

        return 200
      }

    },

    //修改人员信息
    * editPerson ({ payload = {} }, { call, put }) {
      const data = yield call(carrierEmployeeService.update, payload.id,payload.data)

      if(data){
        yield put({
          type: 'queryPerson',
          payload: {
            id:payload.data.carrierId
          },
        })
        //yield put({ type: 'query' })
        return 200
      }
    },

    //删除人员信息
    * delPerson ({ payload = {} }, { call, put }) {
      const data = yield call(carrierEmployeeService.del, payload.id,payload.userPin)

      if(data){
        yield put({
          type: 'queryPerson',
          payload: {
            id:payload.carrierId
          },
        })
       // yield put({ type: 'query' })
        return 200
      }
    },

    //设置人员为主信息
    * setMasterPerson ({ payload = {} }, { call, put }) {
      const data = yield call(carrierEmployeeService.setMaster,payload.carrierId, payload.id,)

      if(data){
        yield put({
          type: 'queryPerson',
          payload: {
            id:payload.carrierId
          },
        })
        //yield put({ type: 'query' })
        return 200
      }
    },

    * addRegion ({ payload = {} }, { call, put,select }) {

      /*const commitAddRegion = yield select(({ manageCarrier }) => manageCarrier.commitAddRegion)
      if(commitAddRegion){

        /!*if(payload.startingPlace === commitAddRegion.startingPlace
        && payload.destinationPlace === commitAddRegion.destinationPlace
        && payload.carrierEmployeeId === commitAddRegion.carrierEmployeeId){
          return 400
        }*!/

      }*/
      const data = yield call(carrierRegionService.add, payload)

      if(data){

        yield put({
          type: 'queryRegion',
          payload: {
            id:payload.carrierId
          },
        })

        yield put({
          type: 'addReginSuccess',
          payload:{
            commitAddRegion:payload
          } ,
        })

        return 200
      }

    },

    //修改区域联系人
    * editRegion ({ payload = {} }, { call, put }) {

      const data = yield call(carrierRegionService.update, payload.id,payload.data)

      if(data){
        yield put({
          type: 'queryRegion',
          payload: {
            id:payload.data.carrierId
          },
        })
        return 200
      }

    },

    //修改区域联系人
    * delRegion ({ payload = {} }, { call, put }) {

      const data = yield call(carrierRegionService.del, payload.id,payload.userPin)

      if(data){
        yield put({
          type: 'queryRegion',
          payload: {
            id:payload.carrierId
          },
        })
        return 200
      }
    },
  },


})
