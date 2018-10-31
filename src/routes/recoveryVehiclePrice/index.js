import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'

import Modal from './Modal'
import { message,Card  } from 'antd';
import { config } from 'utils'

const RecoveryVehiclePrice = ({ location, dispatch, recoveryVehiclePrice, loading, }) => {

  const {
    recoveryVehiclePriceList,
  } = recoveryVehiclePrice

  const ModalProps = {
    recoveryVehiclePriceList,
    location,
    onOk (data,userpin) {
      dispatch({
        type: 'recoveryVehiclePrice/update',
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

RecoveryVehiclePrice.propTypes = {
  recoveryVehiclePrice: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ recoveryVehiclePrice, loading }) => ({ recoveryVehiclePrice, loading }))(RecoveryVehiclePrice)

