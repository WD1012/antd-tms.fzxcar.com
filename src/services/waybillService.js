import { config } from 'utils'
import dvarequest from '../utils/dvarequest'
import dvarequestbytes from '../utils/dvarequestbytes'


const { api } = config
const { wayBill } = api
const { carrierOfferPriceinfo } = api
const { regionInfterFace } = api
const { uploadUrl } = api

export async function list (data) {
  return dvarequest(`${wayBill}/get-waybill-list?userCode=${data.updateUser}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function expertWaybill (data) {
  return dvarequestbytes(`${wayBill}/expert-waybill?userCode=${data.updateUser}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function getByWaybillNo (data) {

  if (data.waybillNo) {
    return dvarequest(`${wayBill}/get-waybill-detail/${data.waybillNo}?userCode=zzh`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      mode: 'cors',
      credentials: 'include',
      cache: 'default',
    })
  }
  return dvarequest(`${wayBill}/get-waybill-detail/${data.orderBaseId}?userCode=zzh`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function getByOrderBaseId (data) {
  return dvarequest(`${wayBill}/get-waybill-detail/${data.orderBaseId}?userCode=${data.updateUser}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function getVehicleDetail (data) {
  console.log(data)
  return dvarequest(`${wayBill}/get-vehicle-detail/${data.orderBaseId}/${data.vehicleId}?userCode=${data.updateUser}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function getOnwayInfo (data) {
  return dvarequest(`${wayBill}/get-onway-info/${data.orderBaseId}/${data.vehicleId}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function getContractPicture (data) {
  console.log(`${wayBill}/get-contract-picture/${data}`)
  return dvarequest(`${wayBill}/get-contract-picture/${data}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function getVehiclePicture (data) {
  console.log(data)
  return dvarequest(`${wayBill}/get-vehicle-picture/${data.orderBaseId}/${data.vehicleId}/${data.picType}?userCode=${data.updateUser}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function uploadFile (data) {
  readerImage(data)
    .then((reader) => {
      const param = {
        ext: data.name.split('.')[1],
        file: reader.result,
        size: data.size,
        user_id: '1',
        device_code: 'dycd_wms',
        name: data.name,
        merge_id: '1',
        type: data.type,
      }
      let formData = new FormData()
      formData.set('ext', param.ext)
      formData.set('file', param.file)
      formData.set('size', param.size)
      formData.set('user_id', param.user_id)
      formData.set('device_code', param.device_code)
      formData.set('name', param.name)
      formData.set('merge_id', param.merge_id)
      formData.set('type', param.type)

      for (let value of formData.values()) {
        console.log(value)
      }
      // console.log(searchParams)
      return dvarequest(`${uploadUrl}/FileUpload/Oss/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formData,
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

export async function getDictOrderStatus () {
  return dvarequest(`${wayBill}/get-dict-order-status`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function queryCarrierList (data) {
  return dvarequest(`${carrierOfferPriceinfo}/query-carrier-list/${data.tmsorderid}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function getDictOrderType () {
  return dvarequest(`${wayBill}/get-dict-order-type`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function getDictTransportType () {
  return dvarequest(`${wayBill}/get-dict-transport-type`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function getDictvehicleStatus () {
  return dvarequest(`${wayBill}/get-dict-vehicle-status`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function get2RegionList (data) {
  return dvarequest(`${regionInfterFace}/get-region-list`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function removeOnwayInfo (data) {
  return dvarequest(`${wayBill}/delete-onway-info/${data.orderBaseId}/${data.vehicleId}/${data.onwayId}?userCode=${data.userCode}`, {
    method: 'delete',
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function removePlatOperator (data) {
  return dvarequest(`${wayBill}/delete-plat-operator/${data.orderBaseId}/${data.personId}?userCode=${data.userCode}`, {
    method: 'delete',
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function addOnWayInfo (data) {
  return dvarequest(`${wayBill}/add-onway-info?userCode=${data.userCode}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function addContractInfo (data) {
  console.log(data)
  return dvarequest(`${wayBill}/maintenance-contract-info?userCode=${data.currentUser}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function updateCarrierPrice (data) {
  return dvarequest(`${wayBill}/update-carrier-price?userCode=${data.currentUser}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function updateClientPrice (data) {
  return dvarequest(`${wayBill}/update-customer-price?userCode=${data.currentUser}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function updateCustomerSender (data) {
  return dvarequest(`${wayBill}/update-customer-sender?userCode=${data.currentUser}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function updateDriver (data) {
  return dvarequest(`${wayBill}/update-carrier-driver?userCode=${data.currentUser}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function updatePlatOperator (data) {
  console.log(data)
  return dvarequest(`${wayBill}/add-plat-operator?userCode=${data.currentUser}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function queryOfferpriceDetailList (data) {
  console.log(data)
  return dvarequest(`${carrierOfferPriceinfo}/query-offerprice-detail-list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function getDictStore (data) {
  console.log(data)
  return dvarequest(`${wayBill}/get-dict-store/${data.orderBaseId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function updateVin (data) {
  return dvarequest(`${wayBill}/update-vehicle-vin/${data.orderBaseId}/${data.vehicleId}/${data.vin}?userCode=${data.currentUser}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function updateVehiclePicsDesc (data) {
  return dvarequest(`${wayBill}/update-vehicle-picture-desc`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function noticeReleaseVehicle (data) {
  return dvarequest(`${wayBill}/notice-release-vehicle/${data.orderBaseId}/${data.vehicleId}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function arrive (data) {
  return dvarequest(`${wayBill}/vehicle-arrival/${data.orderBaseId}/${data.vehicleId}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    //body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function noticeSendVehicle (data) {
  return dvarequest(`${wayBill}/notice-send-vehicle/${data.orderBaseId}/${data.vehicleId}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function updateStore (data) {
  return dvarequest(`${wayBill}/lock-store`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function distributionCarriers (data) {
  return dvarequest(`${carrierOfferPriceinfo}/assign-carrier`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function readerImage (file, options) {
  options = options || {}
  return new Promise(((resolve, reject) => {
    let reader = new FileReader()

    reader.onload = function () {
      resolve(reader)
    }
    reader.onerror = reject

    if (options.accept && !new RegExp(options.accept).test(file.type)) {
      reject({
        code: 1,
        msg: 'wrong file type',
      })
    }

    // if (!file.type || /^text\//i.test(file.type)) {
    //   reader.readAsText(file)
    // } else {
    reader.readAsDataURL(file)
    // }
  }))
}


export async function  maintenanceVehiclePicture(data) {
  return dvarequest(`${wayBill}/maintenance-vehicle-picture`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
    body: JSON.stringify(data),
  })
}
//GET /api/v1/waybill-manage/get-picker-info/{orderBaseId}/{vin
export async function  getPickerInfo(data) {
  return dvarequest(`${wayBill}/get-picker-info/${data.orderBaseId}/${data.vin}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
