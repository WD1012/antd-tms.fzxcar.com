import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { manageLocation } = api
const { regionInfterFace } = api
const { account } = api
const { addAccount } = api
const { getManageLocation } = api

export async function list (data) {
  console.log(JSON.stringify(data))
  return dvarequest(manageLocation, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function provincList () {
  // const data = { queryType: 1 }
  return dvarequest(`${regionInfterFace}/get-region-list`, {
    method: 'post', // TODO modify POST
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function accountList () {
  return dvarequest(account, {
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
export async function remove (data) {
  return dvarequest(`${manageLocation}/${data.regionId}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function update (data) {
  return dvarequest(`${manageLocation}/${data.regionId}`, {
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
export async function addAccountRequest (data) {
  return dvarequest(addAccount, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function getById (data) {
  return dvarequest(`${manageLocation}/${data}`, {
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
