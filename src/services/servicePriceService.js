import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { servicePrice } = api

export async function list () {
  return dvarequest(`${servicePrice}/get`, {
    method: 'get',
  })
}

export async function update (data,userPin) {
  return dvarequest(`${servicePrice}/${userPin}`,{
    method: 'put',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

