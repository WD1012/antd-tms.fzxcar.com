import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { cityCenterInfo } = api
export async function list (data) {
  return dvarequest(`${cityCenterInfo}/list`, {
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

export async function save (data) {
  return dvarequest(`${cityCenterInfo}/save`, {
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

export async function remove (data) {
  return dvarequest(`${cityCenterInfo}/${data.id}`, {
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

