import dvarequest from '../utils/dvarequest'
import { config } from 'utils'

const { api } = config
const { insuranceList } = api
const { insuranceCreate } = api
const { insuranceRemove } = api
export async function list (data) {
  return dvarequest(insuranceList, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function create (data) {
  return dvarequest(insuranceCreate, {
    method: 'POST',
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
export async function remove (data) {
  console.log(data)
  return dvarequest(`${insuranceRemove}/${data.id}/${data.updateUser}`, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
