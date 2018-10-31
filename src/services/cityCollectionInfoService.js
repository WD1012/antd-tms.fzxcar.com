import dvarequest from '../utils/dvarequest'
import { config } from 'utils'

const { api } = config
const { cityCollectionInfo } = api
const { regionInfterFace } = api

export async function list (data) {

  return dvarequest(`${cityCollectionInfo}/get-city-collectionInfo`, {
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
export async function regionProvinceList () {
  return dvarequest(`${regionInfterFace}/get-region-list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({}),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function regionCityList (data) {
  return dvarequest(`${regionInfterFace}/get-region-list`, {
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
export async function create (data) {
  return dvarequest(`${cityCollectionInfo}/add-city-collectionInfo`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function createProvince (data) {
  return dvarequest(`${cityCollectionInfo}/add-prov-collectionInfo`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function createRegion (data) {
  return dvarequest(`${cityCollectionInfo}/add-county-collectionInfo`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}


export async function update (data,id) {
  return dvarequest(`${cityCollectionInfo}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'put',
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function getCityCollectionInfo (data) {
  return dvarequest(`${cityCollectionInfo}/${data.id}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function deleteCollectionInfo (data) {
  return dvarequest(`${cityCollectionInfo}/${data}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}
export async function getProvinceCollectionInfo (data) {
  return dvarequest(`${cityCollectionInfo}/get-prov-one/${data.id}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function updateProvince (data,id) {
  return dvarequest(`${cityCollectionInfo}/edit-prov/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'put',
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function getRegionCollectionInfo (data) {
  return dvarequest(`${cityCollectionInfo}/get-county-one/${data.id}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

export async function updateRegion (data,id) {
  return dvarequest(`${cityCollectionInfo}/edit-county/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'put',
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  })
}

