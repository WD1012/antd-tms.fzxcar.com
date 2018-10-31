import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { transportInfo } = api
const { _transportInfo } = api
export async function list (data) {
  return dvarequest(`${_transportInfo}/list`, {
    method: 'post',
    mode: 'cors',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    cache: 'default',
  })
}
export async function getStates () {
  return dvarequest(`${_transportInfo}/get-states`, {
    method: 'get',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    cache: 'default',
  })
}
export async function getRegionList () {
  return dvarequest(`${transportInfo}/get-region-list`, {
    method: 'get',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    cache: 'default',
  })
}
export async function get2RegionList (param) {
  return dvarequest(`${transportInfo}/get-region-list?provCode=${param}`, {
    method: 'get',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    cache: 'default',
  })
}
export async function updateRecordState (param) {
  console.log(param)
  return dvarequest(`${_transportInfo}/set-state/${param.id}/${param.updateUser}`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    cache: 'default',
  })
}

export async function create (param) {
  return dvarequest(`${_transportInfo}/add`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    cache: 'default',
    body: JSON.stringify(param),
  })
}

export async function updateRecord (param,id) {
  return dvarequest(`${_transportInfo}/${id}/`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    cache: 'default',
    body: JSON.stringify(param),
  })
}

export async function deleteRecord (param) {
  return dvarequest(`${_transportInfo}/${param.id}/${param.updateUser}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    cache: 'default',
  })
}
export async function getRecord (param) {
  return dvarequest(`${_transportInfo}/${param.id}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    cache: 'default',
  })
}
