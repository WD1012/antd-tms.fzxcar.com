import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { deliverStorePrice } = api

export async function list () {
  return dvarequest(`${deliverStorePrice}/get`, {
    method: 'get',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  })
}

export async function update (data,userPin) {

  return dvarequest(`${deliverStorePrice}/${userPin}`,{
    method: 'put',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}
