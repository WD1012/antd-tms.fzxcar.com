import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'
const { api } = config
const { menus } = api

export async function menulist (accountUuid) {

  return dvarequest(`${menus}/account-menu-list/${accountUuid}`, {
    method: 'get',
  })

}
