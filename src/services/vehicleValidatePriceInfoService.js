import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { vehicleValidatePriceInfo } = api
const { vehicleValidatePriceInfoUpdate } = api

export async function list (data) {
  return dvarequest(vehicleValidatePriceInfo, {
    method: 'get',
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function update (data,userPin) {
  return dvarequest(`${vehicleValidatePriceInfoUpdate}/${userPin}`, {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
