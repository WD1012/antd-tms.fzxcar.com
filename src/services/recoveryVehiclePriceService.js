import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { recoveryVehiclePrice } = api

export async function list () {
  return dvarequest(`${recoveryVehiclePrice}/get-rescue-price-list`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify("{}"),
  })
}

export async function update (data,userPin) {

  console.log( JSON.stringify(data))
  return dvarequest(`${recoveryVehiclePrice}/save-rescue-price-name-list/${userPin}`,{
    method: 'put',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}

