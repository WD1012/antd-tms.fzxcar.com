import { config } from 'utils'
import dvarequest from '../utils/dvarequest'
import dvarequestbytes from '../utils/dvarequestbytes'


const { api } = config
const { wayBill } = api



export async function authPayMentPicture (data) {


  return dvarequest(`${wayBill}/audit-payment-picture/${data.orderBaseId}/${data.result}`, {
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

export async function getPayMentPicture (orderBaseId) {


  return dvarequest(`${wayBill}/get-payment-picture/${orderBaseId}`, {
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
