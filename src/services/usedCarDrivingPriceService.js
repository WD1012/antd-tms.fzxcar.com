import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { usedCarDrivingPrice } = api

export async function list () {
  return dvarequest(`${usedCarDrivingPrice}/list`, {
    method: 'post',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({}),
  })
}

export async function update (data,userPin) {

  console.log(JSON.stringify(data))
  return dvarequest(`${usedCarDrivingPrice}`,{
    method: 'put',
    headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  })
}
