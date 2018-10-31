import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { transportRegularInfo } = api
export async function list (data) {
  return dvarequest(`${transportRegularInfo}/list`, {
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
  return dvarequest(`${transportRegularInfo}/get-states`, {
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
export async function getAllStates () {
  return dvarequest(`${transportRegularInfo}/get-all-states`, {
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
  return dvarequest(`${transportRegularInfo}/get-region-list`, {
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
  return dvarequest(`${transportRegularInfo}/get-region-list?provCode=${param}`, {
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
  return dvarequest(`${transportRegularInfo}/set-state/${param.id}/${param.updateUser}`, {
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
export async function deleteRecord (param) {
  return dvarequest(`${transportRegularInfo}/${param.id}/${param.updateUser}`, {
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
  return dvarequest(`${transportRegularInfo}/${param.id}`, {
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
export async function create (param) {
  return dvarequest(`${transportRegularInfo}/add`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(param),
    credentials: 'include',
    cache: 'default',
  })
}

export async function update (param,id) {
  return dvarequest(`${transportRegularInfo}/${id}`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(param),
    credentials: 'include',
    cache: 'default',
  })
}

export async function getAll2RegionTree () {
  return dvarequest(`${transportRegularInfo}/get-region-tree`, {
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
