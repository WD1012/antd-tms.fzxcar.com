import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { takeVehiclePrice } = api

export async function list () {
  return dvarequest(`${takeVehiclePrice}/list`, {
    method: 'get',
  })
}

export async function update (data,userPin) {

  console.log(JSON.stringify(data))
  return dvarequest(`${takeVehiclePrice}/${userPin}`,{
    method: 'put',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}
