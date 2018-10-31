import { request, config } from 'utils'
import dvarequest from '../../utils/dvarequest'

const { api } = config
const { manageCarrier } = api

export async function list (data) {

  return dvarequest(`${manageCarrier}/list`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export async function add (data) {
  return dvarequest(`${manageCarrier}/add`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export async function update (id,data) {
  return dvarequest(`${manageCarrier}/${id}`,{
    method: 'put',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export async function onOff (id,userPin) {
  return dvarequest(`${manageCarrier}/set-state/${id}/${userPin}`,{
    method: 'put',
  })
}

export async function del (id,userPin) {
  return dvarequest(`${manageCarrier}/${id}/${userPin}`,{
    method: 'delete',
  })
}

export async function insuranceList (data) {
  return dvarequest(`${manageCarrier}/insurance-list`, {
    method: 'get',
  })
}


export async function detail (id) {
  return dvarequest(`${manageCarrier}/${id}`, {
    method: 'get',
  })
}

