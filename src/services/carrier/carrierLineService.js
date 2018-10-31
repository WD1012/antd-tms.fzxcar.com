import { request, config } from 'utils'
import dvarequest from '../../utils/dvarequest'

const { api } = config
const { manageCarrierLine } = api
const {regionInfterFace} = api

export async function list (data) {

  return dvarequest(`${manageCarrierLine}/list`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export async function addr (data) {

  return dvarequest(`${regionInfterFace}/get-region-list`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })

}

export async function carrierList () {

  return dvarequest(`${manageCarrierLine}/carrier-list`, {
    method: 'get',
  })

}

export async function add (data) {

  return dvarequest(`${manageCarrierLine}/add`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export async function update (id,data) {

  return dvarequest(`${manageCarrierLine}/${id}`, {
    method: 'put',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

export async function del (id,userPin) {

  return dvarequest(`${manageCarrierLine}/${id}/${userPin}`, {
    method: 'delete',
  })
}

export async function onOff (id,userPin) {

  return dvarequest(`${manageCarrierLine}/set-state/${id}/${userPin}`, {
    method: 'put',
  })
}
