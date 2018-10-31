import pathToRegexp from 'path-to-regexp'
import * as waybillService from 'services/waybillService'
import * as cityCollectionInfoService from 'services/cityCollectionInfoService'

export default {

  namespace: 'waybillDetail',

  state: {
    currentItem: {},
    modalVisible: false,
    onWayInfoModalVisible: false,
    picsModalVisible: false,
    updatePicsModalVisible: false,
    activeIndex: 0,
    fileListActiveIndex: 0,
    updateFileListActiveIndex: 0,
    previewVisible: false,
    noPic: false,
    editable: false,
    showEditCarrierFeeModalVisible: false,
    showEditSenderManModalVisible: false,
    showEditDriverModalVisible: false,
    showEditPlatOperatorModalVisible: false,
    editStoreModalVisible: false,
    previewImage: '',
    fileList: [],
    onWayInfo: [],
    storeList: [],
    updateFileList: {},
    pics: [],
    selectedOptionsLabel: [],

    showAddOnwayInfoModalVisible:false,//编辑在途
    regionResultList: [],
    batchVehicleRows:[],

    showEditClientFeeModalVisible:false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        console.log(location)
        if (location.pathname.includes('/waybill-manage/edit/')) {
          dispatch({
            type: 'query',
            payload: { waybillNo: location.pathname.split('/')[3], editable: true },
          })
        } else if (location.pathname.includes('/waybill-manage/')) {
          dispatch({
            type: 'query',
            payload: { waybillNo: location.pathname.split('/')[2], editable: false },
          })
        }
      })
    },
  },

  effects: {
    * query ({
      payload,
    }, { call, put }) {

      const data = yield call(waybillService.getByWaybillNo, payload)

      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            currentItem: data.data.data,
          },
        })

        yield put({
          type: 'updateEditable',
          payload: { editable: payload.editable },
        })
      } else {
        throw data
      }
    },

    * showModal ({ payload }, { call, put, select }) {

      const data = yield call(waybillService.getContractPicture, payload.orderBaseId)
      /*console.log('=========')
      console.log(payload.status)
      console.log('=========')*/

      let isEditCon = true
      payload.vehicleInfo.map((item) =>{

        if(item.status > 3){
          isEditCon = false
          return
        }
      })

      if (data) {
        const editable = yield select(state => state.waybillDetail.editable)
        // if (data.data.data.pictures.length === 0 && data.data.data.controlRemark === '') {

        if (!editable || !isEditCon) {
          if(data.data.data.pictures.length === 0){
            return 404
          }
          yield put({
            type: 'showPicModalShow',
            payload: data.data.data.pictures,
          })
        } else {

          const fileList = data.data.data.pictures.map((item) => {
            const data = {
              "url":item.ossPictureUrl,
              "pictureId":item.pictureId,
              "ossPictureId":item.ossPictureId,
            }

            const response =  {
              "data":data,
            }

            const m = {
              "response":response,
            }
            return m
          })

          yield put({
            type: 'showUpdateDataModal',
            payload: {
              fileList:fileList,
            }
          })
        }
      }
    },

    * uploadFile ({ payload }, { call, put, select }) {
      const data = yield call(waybillService.uploadFile, payload)
      if (data) {
        console.log(data)
      }
    },
    * showOnWayInfoModal ({ payload }, { call, put, select }) {
      const data = yield call(waybillService.getOnwayInfo, payload)
      if (data) {
        yield put({
          type: 'onWayInfoModalShow',
          payload: data.data.data,
        })
      }
    },
    * showPicModal ({ payload }, { call, put, select }) {

      let baseData = []
      let data = yield call(waybillService.getVehiclePicture, payload)
      if (data){
        baseData.push(...data.data.data)
      }

      if(payload.picType === 1){
        payload.picType = 5
        let exceptiondata = yield call(waybillService.getVehiclePicture, payload)
        if(exceptiondata){
          baseData.push(...exceptiondata.data.data)
        }
      }

      if (baseData) {
        console.log("showPicModal",data)
        yield put({
          type: 'showPicModalShow',
          payload: baseData,
        })
      }
      return baseData
    },
    * updateUpdate ({ payload }, { call, put, select }) {
      let updateFileList = yield select(state => state.waybillDetail.updateFileList)

      const contractPictureReq = updateFileList.fileList.map((item) => {
        let m
        if(item.url){
          m = {
            "ossPictureId":item.name,
            "ossPictureUrl":item.url,
            "ossThumbnailUrl":item.url,
            "pictureId":item.uid,
          }
        }else{
          m = {
            "ossPictureId":item.response.data.file_id?item.response.data.file_id:item.response.data.ossPictureId,
            "ossPictureUrl":item.response.data.url,
            "ossThumbnailUrl":item.response.data.icon,
            "pictureId":item.response.data.pictureId?item.response.data.pictureId:'',
          }
        }
        return m
      })

      const contractReq = {
        "controlRemark":payload.controlRemark,
        "orderBaseId":payload.orderBaseId,
        "savePictures":contractPictureReq,
        userCode: 'zzh',
      }

      const data = yield call(waybillService.addContractInfo, contractReq)
      if (data) {
        yield put({
          type: 'hideUpdateModal',
        })

        yield put({
          type: 'query',
          payload:{
            waybillNo: payload.orderBaseId,
            editable: true
          }
        })

        return 200
      } else {
        throw data
      }
      /*ContractReq {
        controlRemark (string, optional): 调度员备注 ,
          orderBaseId (integer): 运单Id ,
          savePictures (Array[ContractPictureReq], optional): 图片信息
      }
      ContractPictureReq {
        ossPictureId (string, optional): 图片oss Id ,
          ossPictureUrl (string, optional): 图片oss Url ,
          ossThumbnailUrl (string, optional): 缩略图oss Url ,
          pictureId (integer, optional): 图片id
      }*/
      //const data = yield call(waybillService.addContractInfo, payload)
    },

    * deletePlatOperator ({ payload }, { call, put, select }) {
      const param = {
        orderBaseId: payload.currentItem.orderBaseId,
        personId: payload.platOperator.personId,
        userCode: 'zzh',
      }
      payload.updateUser = payload.userCode
      const data = yield call(waybillService.removePlatOperator, param)
      if (data) {
        console.log(payload)
        const _data = yield call(waybillService.getByOrderBaseId, payload.currentItem)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
        }
      }
    },
    * updateCarrierPrice ({ payload }, { call, put, select }) {
      const data = yield call(waybillService.updateCarrierPrice, payload)
      if (data) {
        payload.updateUser = payload.userCode
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
          yield put({
            type: 'cancelEditCarrierFeeModal',
          })
        }
      }
    },
    * updateClientPrice ({ payload }, { call, put, select }) {

      console.log('===============')
      console.log(payload)
      console.log('===============')

      const data = yield call(waybillService.updateClientPrice, payload)
      if (data) {
        payload.updateUser = payload.userCode
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
          yield put({
            type: 'cancelEditClientFeeModal',
          })
        }
      }
    },
    * updateSenderMan ({ payload }, { call, put, select }) {
      console.log(payload)
      const data = yield call(waybillService.updateCustomerSender, payload)
      if (data) {
        console.log(data)
        payload.updateUser = payload.userCode
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
          yield put({
            type: 'cancelEditSenderManModal',
          })
        }
      }
    },
    * updateDriver ({ payload }, { call, put, select }) {
      console.log(payload)
      const data = yield call(waybillService.updateDriver, payload)
      if (data) {
        console.log(data)
        payload.updateUser = payload.userCode
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
          yield put({
            type: 'cancelEditDriverModal',
          })
        }
      }
    },
    * updatePlatOperator ({ payload }, { call, put, select }) {
      console.log(payload)
      const data = yield call(waybillService.updatePlatOperator, payload)
      if (data) {
        console.log(data)
        payload.updateUser = payload.userCode
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
          yield put({
            type: 'cancelPlatOperatorModal',
          })
        }
      }
    },
    * create ({ payload }, { call, put, select }) {
      const controlRemark = payload.controlRemark
      const orderBaseId = yield select(state => state.waybillDetail.currentItem.orderBaseId)
      const savePictures = payload.fileList.fileList.map((item) => {
        return {
          ossPictureUrl: item.response.data.url,
          ossThumbnailUrl: item.response.data.icon,
        }
      })
      const data = yield call(waybillService.addContractInfo, {
        currentUser: 'zzh', orderBaseId, savePictures, controlRemark,
      })
      if (data) {
        yield put({
          type: 'hideModal',
        })
        yield put({
          type: 'query',
          payload: { waybillNo: orderBaseId },
        })
      }
    },
    * editStoreModal ({ payload }, { call, put, select }) {
      console.log(payload)
      const data = yield call(waybillService.getDictStore, payload)
      if (data) {
        console.log(data)
        yield put({
          type: 'showEditStoreModal',
          payload: data.data.data,
        })
      }
    },
    * noticeReleaseVehicle ({ payload }, { call, put, select }) {
      console.log(payload)
      const currentItem = yield select(state => state.waybillDetail.currentItem)
      payload.orderBaseId = currentItem.orderBaseId
      const data = yield call(waybillService.noticeReleaseVehicle, payload)
      if (data) {
        payload.waybillNo = currentItem.orderBaseId
        payload.updateUser = 'zzh'
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
        }
      }
    },

    * arrive ({ payload }, { call, put, select }) {
      console.log(payload)
      const currentItem = yield select(state => state.waybillDetail.currentItem)
      payload.orderBaseId = currentItem.orderBaseId
      const data = yield call(waybillService.arrive, payload)
      if (data) {
        payload.waybillNo = currentItem.orderBaseId
        payload.updateUser = 'zzh'
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
        }
      }
    },

    //批量放车
    * noticeReleaseVehicleBatch ({ payload }, { call, put, select }) {
      console.log(payload)
      const currentItem = yield select(state => state.waybillDetail.currentItem)
      payload.orderBaseId = currentItem.orderBaseId
      const data = yield call(waybillService.noticeReleaseVehicle, payload)
      if (data) {
        payload.waybillNo = currentItem.orderBaseId
        payload.updateUser = 'zzh'
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
        }
      }
    },

    //批量到达
    * arriveBatch ({ payload }, { call, put, select }) {
      console.log(payload)
      const currentItem = yield select(state => state.waybillDetail.currentItem)
      payload.orderBaseId = currentItem.orderBaseId
      const data = yield call(waybillService.arrive, payload)
      if (data) {
        payload.waybillNo = currentItem.orderBaseId
        payload.updateUser = 'zzh'
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
        }
      }
    },


    * noticeSendVehicle ({ payload }, { call, put, select }) {
      console.log(payload)
      const currentItem = yield select(state => state.waybillDetail.currentItem)
      payload.orderBaseId = currentItem.orderBaseId
      const data = yield call(waybillService.noticeSendVehicle, payload)
      if (data) {
        payload.waybillNo = currentItem.orderBaseId
        payload.updateUser = 'zzh'
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
        }
      }
    },

    //批量发运
    * noticeSendVehicleBatch ({ payload }, { call, put, select }) {
      console.log(payload)
      const currentItem = yield select(state => state.waybillDetail.currentItem)
      //payload.orderBaseId = currentItem.orderBaseId

      const data = yield call(waybillService.noticeSendVehicle, payload)
      if (data) {
        payload.waybillNo = currentItem.orderBaseId
        payload.updateUser = 'zzh'
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
         return 200
      } else {
        throw data
      }
      }
    },

    * updateStore ({ payload }, { call, put, select }) {
      console.log(payload)
      const data = yield call(waybillService.updateStore, payload)
      if (data) {
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
          yield put({
            type: 'cancelEditStoreModal',
          })
        }
      }
    },

    * showAddOnwayInfoModal ({ payload }, { call, put, select }) {
      const regionResult = yield call(cityCollectionInfoService.regionProvinceList)
      if (regionResult) {
        yield put({
          type: 'putRegionResult',
          payload: regionResult.data.data,
        })
        yield put({
          type: 'showAddOnwayInfoModalSuccess',
          payload:{
            batchVehicleRows:payload.vehicleRows
          }
        })
      }
    },

    * load2Address ({ payload = {} }, { call, put, select }) {
      const data = yield call(waybillService.get2RegionList, { provCode: payload.value, queryType: 2 })
      if (data) {
        payload.loading = false
        payload.children = data.data.data.map((item) => {
          const m = { value: item.id, label: item.desc, isLeaf: true }
          return m
        })
      }
    },

    * addOnWayInfo ({ payload }, { select, call, put }) {
      const currentItem = payload.currentItem
      const selectedOptionsLabel = yield select(({ waybillDetail }) => waybillDetail.selectedOptionsLabel)

      console.log(selectedOptionsLabel)
      let vehicleId = ''
      payload.vehicleRows.map((item) =>{
        vehicleId += item + ','
      })

      const req = {
        orderBaseId: currentItem.orderBaseId,
        vehicleId: vehicleId,
        provinceName: selectedOptionsLabel[0],
        provinceCode: payload.provinceCode,
        nodeTime: payload.nodeTime,
        cityName: selectedOptionsLabel[1],
        cityCode: payload.cityCode,
        remark: payload.remark,
        currentUser: payload.currentUser,
        userCode: payload.userCode,
      }
      const data = yield call(waybillService.addOnWayInfo, req)

      if (data) {
        yield put({ type: 'cancelAddOnwayInfoModal' })
        payload.waybillNo = currentItem.orderBaseId
        payload.updateUser = 'zzh'
        const _data = yield call(waybillService.getByWaybillNo, payload)
        if (_data) {
          yield put({
            type: 'querySuccess',
            payload: {
              currentItem: _data.data.data,
            },
          })
        }
        return 200
      }else {
        throw data
      }

    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { currentItem } = payload
      return {
        ...state,
        currentItem,
      }
    },
    updateFileList (state, { payload }) {
      return {
        ...state,
        fileList: payload,
      }
    },
    showEditCarrierFeeModal (state, { payload }) {
      return {
        ...state,
        showEditCarrierFeeModalVisible: true,
      }
    },
    showEditClientFeeModal (state, { payload }) {
      return {
        ...state,
        showEditClientFeeModalVisible: true,
      }
    },
    editPlatOperatorModal (state, { payload }) {
      return {
        ...state,
        showEditPlatOperatorModalVisible: true,
      }
    },
    showEditSenderManModal (state, { payload }) {
      return {
        ...state,
        showEditSenderManModalVisible: true,
      }
    },
    showEditDriverModal (state, { payload }) {
      return {
        ...state,
        showEditDriverModalVisible: true,
      }
    },
    cancelEditSenderManModal (state, { payload }) {
      return {
        ...state,
        showEditSenderManModalVisible: false,
      }
    },
    cancelEditCarrierFeeModal (state, { payload }) {
      return {
        ...state,
        showEditCarrierFeeModalVisible: false,
      }
    },
    cancelEditClientFeeModal (state, { payload }) {
      return {
        ...state,
        showEditClientFeeModalVisible: false,
      }
    },
    cancelEditDriverModal (state, { payload }) {
      return {
        ...state,
        showEditDriverModalVisible: false,
      }
    },
    cancelPlatOperatorModal (state, { payload }) {
      return {
        ...state,
        showEditPlatOperatorModalVisible: false,
      }
    },
    updateEditable (state, { payload }) {
      return {
        ...state,
        editable: payload.editable,
      }
    },
    updateUploadFileList (state, { payload }) {
      //console.log('updateFileList', state.updateFileList)
      //console.log('payload.fileList', payload.fileList)
      let t = payload.fileList.filter((item) => {
        if ('status' in item) { return item }
      })
      //console.log(t)
      return {
        ...state,
        updateFileList: payload,
      }
    },
    showUpdateDataModal (state, { payload }) {
      console.log(payload)
      return {
        ...state,
        updatePicsModalVisible: true,
        updateFileList: payload,
      }
    },
    hideUpdateModal (state, { payload }) {
      return {
        ...state,
        updatePicsModalVisible: false,
        updateFileList: payload,
      }
    },
    onUploadRemove (state, { payload }) {
      const index = state.waybillDetail.fileList.indexOf(payload)
      const newFileList = state.waybillDetail.fileList.slice()
      newFileList.splice(index, 1)
      return {
        ...state,
        fileList: newFileList,
      }
    },
    onUploadUploadRemove (state, { payload }) {
      const index = state.waybillDetail.updateFileList.indexOf(payload)
      const newFileList = state.waybillDetail.updateFileList.slice()
      newFileList.splice(index, 1)
      return {
        ...state,
        updateFileList: newFileList,
      }
    },
    showDataModal (state, { payload }) {
      console.log(payload)
      return {
        ...state,
        fileList: payload.pictures,
        modalVisible: true,
        // previewVisible: true,
      }
    },
    onWayInfoModalShow (state, { payload }) {
      return {
        ...state,
        onWayInfoModalVisible: true,
        onWayInfo: payload,
      }
    },
    onWayInfoModalOk (state, { payload }) {
      console.log(payload)
      return {
        ...state,
        onWayInfoModalVisible: false,
      }
    },
    onWayInfoModalCancel (state, { payload }) {
      console.log(payload)
      return {
        ...state,
        onWayInfoModalVisible: false,
      }
    },
    hideModal (state, { payload }) {
      return {
        ...state,
        modalVisible: false,
        fileList: [],
      }
    },
    handleCancelPreview (state, { payload }) {
      return {
        ...state,
        previewVisible: false,
      }
    },
    handleUpdatePreview (state, { payload }) {
      let index = 0


      for (let i = 0; i < state.updateFileList.fileList.length; i++) {

        console.log(state.updateFileList)

        if (payload.response && state.updateFileList.fileList[i].response &&state.updateFileList.fileList[i].response.data.url === payload.response.data.url) {
          index = i
        }else if (payload.url && state.updateFileList.fileList[i].response && state.updateFileList.fileList[i].response.data.url === payload.url){
          index = i
        }else if (payload.url && state.updateFileList.fileList[i].url && state.updateFileList.fileList[i].url === payload.url){
          index = i
        }
      }

      // const index = state.updateFileList.pictures.indexOf(payload)
      return {
        ...state,
        previewVisible: true,
        previewImage: payload.url || payload.thumbUrl,
        fileListActiveIndex: index,
      }
    },
    handlePreview (state, { payload }) {
      console.log(payload)
      return {
        ...state,
        previewVisible: true,
        previewImage: payload.url || payload.thumbUrl,
      }
    },
    closePicsImgViewer (state, { payload }) {
      return {
        ...state,
        picsModalVisible: false,
        pics: [],
      }
    },
    closeUploadPicsImgViewer (state, { payload }) {
      return {
        ...state,
        previewVisible: false,
      }
    },
    onMovePrevRequest (state, { payload }) {
      return {
        ...state,
        fileListActiveIndex: payload.fileListActiveIndex,
      }
    },
    onMoveNextRequest (state, { payload }) {
      return {
        ...state,
        fileListActiveIndex: payload.fileListActiveIndex,
      }
    },
    showPicModalShow (state, { payload }) {
      console.log("showPicModalShow",payload)
      if (payload.length > 0) {
        return {
          ...state,
          picsModalVisible: true,
          activeIndex: 0,
          pics: payload,
        }
      }
      return {
        ...state,
        picsModalVisible: false,
        noPic: true,
      }
    },
    updatePicsActiveIndex (state, { payload }) {
      return {
        ...state,
        activeIndex: payload.activeIndex,
      }
    },
    startPicsImgView (state, { payload }) {
      console.log(payload)
      return {
        ...state,
        picsModalVisible: true,
        activeIndex: payload.activeIndex,
      }
    },

    cancelEditStoreModal (state, { payload }) {
      return {
        ...state,
        ...payload,
        editStoreModalVisible: false,
      }
    },
    showEditStoreModal (state, { payload }) {
      return {
        ...state,
        storeList: payload,
        editStoreModalVisible: true,
      }
    },

    showAddOnwayInfoModalSuccess (state, { payload }) {
      return {
        ...state,
        ...payload,
        showAddOnwayInfoModalVisible: true,
      }
    },
    cancelAddOnwayInfoModal (state, { payload }) {
      return {
        ...state,
        showAddOnwayInfoModalVisible: false,
      }
    },
    saveSelectedOptionsLabel (state, { payload }) {

      return {
        ...state,
        selectedOptionsLabel: payload,
      }
    },

    putRegionResult (state, { payload }) {
      return {
        ...state,
        regionResultList: payload.map((item) => {
          return {
            value: item.id,
            label: item.desc,
            isLeaf: false,
          }
        }),
      }
    },

  },
}
