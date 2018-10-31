import { config, dvarequest } from 'utils'

const { api } = config
const { userLogin } = api

export async function login (data) {
  return dvarequest('http://10.3.10.92:8071/usf-serv-rest-0.0.1-SNAPSHOT/api/v1/user/login',
    {
      method: 'post',
      body: JSON.stringify(data),
    })
}

export async function _login (data) {
  console.log(JSON.stringify(data))
  return dvarequest(`${userLogin}`,
    {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(data),
    })
}

export async function logout (data) {
  return dvarequest('http://10.3.10.92:8071/usf-serv-rest-0.0.1-SNAPSHOT/api/v1/user/login',
    {
      method: 'post',
      body: JSON.stringify(data),
    })
}
