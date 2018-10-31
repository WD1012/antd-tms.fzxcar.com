import { request, config } from 'utils'
import dvarequest from '../utils/dvarequest'

const { api } = config
const { dashboard } = api

export async function dosthList (data) {
  //GET /api/v1/workbench/todo-finance-detail
  return dvarequest(`${dashboard}/todo-finance-detail?isFinace=${data.isFinace}&type=${data.type}`, {
    method: 'get',
  })
}

export async function needFinanceList (data) {
  //GET /api/v1/workbench/todo-finance-detail
  return dvarequest(`${dashboard}/todo-finance-detail?isFinace=${data.isFinace}&type=${data.type}`, {
    method: 'get',
  })
}

export async function needNonFinanceList () {

  /*const data = [];
  for (let i = 0; i < 5; ++i) {
    data.push({
      time: '2018-10-11 10:19',
      id: 'GU20180111102000'+i,
      message: '非金融物流  有车辆2233出现质损，请提醒客户确认车辆异常情况。',
      type:0,
      routeUrl:'/abc/123',
      vin:'vin111111',
    });
  }

  return data*/
  return dvarequest(`${dashboard}/need-non-finance`, {
    method: 'get',
  })
}

/*
* 预警
* */
export async function earlyList (data) {

 /* const data = [];
  for (let i = 0; i < 15; ++i) {
    data.push({
      time: '2018-10-11 10:19',
      id: 'GU20180111102000'+i,
      message: '有车辆1还未更新在途信息,请承运商尽快更新在途信息!',
      type:0,
      routeUrl:'/abc/123',
      vin:'vin111111',
    });
  }

  return data*/
 //GET /api/v1/workbench/early-finance-detail
  return dvarequest(`${dashboard}/early-finance-detail?isFinace=${data.isFinace}&type=${data.type}`, {
    method: 'get',
  })
}
//GET /api/v1/workbench/taxonomy-finance
export async function dosthConut (data) {
  //GET /api/v1/workbench/todo-finance-detail
  return dvarequest(`${dashboard}/taxonomy-finance?isFinace=${data.isFinace}`, {
    method: 'get',
  })
}

//GET /api/v1/workbench/early-finance
export async function warningConut (data) {
  //GET /api/v1/workbench/todo-finance-detail
  return dvarequest(`${dashboard}/early-finance?isFinace=${data.isFinace}`, {
    method: 'get',
  })
}
