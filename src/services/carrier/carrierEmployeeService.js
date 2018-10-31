import { request, config } from 'utils'
import dvarequest from '../../utils/dvarequest'

const { api } = config
const { manageCarrierEmployee } = api

export async function list (carrierId) {
  return dvarequest(`${manageCarrierEmployee}/list/${carrierId}`, {
    method: 'post',
  })
}

export async function add (data) {
  return dvarequest(`${manageCarrierEmployee}/add`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export async function update (id, data) {
  return dvarequest(`${manageCarrierEmployee}/${id}`, {
    method: 'put',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export async function del (id, userPin) {
  return dvarequest(`${manageCarrierEmployee}/${id}/${userPin}`, {
    method: 'delete',
  })
}

export async function setMaster (carrierId,id,) {
  return dvarequest(`${manageCarrierEmployee}/set-contact/${carrierId}/${id}`, {
    method: 'post',
  })
}


