import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { users } = api

export async function list (params) {
  return dvarequest(`${users}/list`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(params),
  })
}

export async function roles () {
  return dvarequest(`${users}/role-list`, {
    method: 'get',
  })
}

export async function remove (params) {
  return request({
    url: users,
    method: 'delete',
    data: params,
  })
}


export async function create (params) {
  return dvarequest(`${users}/add`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(params),
  })
}

export async function update (account,params) {

  return dvarequest(`${users}/${account}`, {
    method: 'put',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(params),
  })
}

export async function del (id,userPin) {
  return dvarequest(`${users}/${id}/${userPin}`, {
    method: 'delete',
  })
}

export async function changePassWord (params) {
  return dvarequest(`${users}/update-password/${params}`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  })
}

export async function resetPassWord (params) {
  return dvarequest(`${users}/reset-password/${params}`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  })
}

