import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'

import Modal from './Modal'
import { message,Card  } from 'antd';
import { config } from 'utils'

const VehicleValidatePriceInfo = ({ location, dispatch, vehicleValidatePriceInfo, loading, }) => {

  const {
    vehicleValidatePriceInfoList,
  } = vehicleValidatePriceInfo

  const ModalProps = {
    vehicleValidatePriceInfoList,
    location,
    onOk (data,userpin) {
      dispatch({
        type: 'vehicleValidatePriceInfo/update',
        payload: {
          data:data,
          userPin:userpin,
        }
      }).then((result) =>{
        if(result === 200){
          message.success('操作成功')
        }
      })
    },

  }
  return (
    <Page inner>
      <Card bordered={false} style={{ width: 500 }}>
        <Modal { ...ModalProps }/>
      </Card>
    </Page>
  )
}

VehicleValidatePriceInfo.propTypes = {
  recoveryVehiclePrice: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ vehicleValidatePriceInfo, loading }) => ({ vehicleValidatePriceInfo, loading }))(VehicleValidatePriceInfo)

