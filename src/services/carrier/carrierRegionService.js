import { request, config } from 'utils'
import dvarequest from '../../utils/dvarequest'

const { api } = config
const { manageCarrierRegion } = api

export async function list (carrierId) {
  return dvarequest(`${manageCarrierRegion}/list/${carrierId}`, {
    method: 'post',
  })
}

export async function add (data) {
  return dvarequest(`${manageCarrierRegion}/add`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export async function update (id, data) {
  return dvarequest(`${manageCarrierRegion}/${id}`, {
    method: 'put',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export async function del (id, userPin) {
  return dvarequest(`${manageCarrierRegion}/${id}/${userPin}`, {
    method: 'delete',
  })
}

export async function getTransportType (carrierId) {
  return dvarequest(`${manageCarrierRegion}/transport-type-list/${carrierId}`, {
    method: 'get',
  })
}

