import { request, config ,dvarequest} from 'utils'

const { api } = config
const {  userLogout, } = api

export async function logout (param) {

  return dvarequest(`${userLogout}`,
    {
      method: 'get',
    })
}

