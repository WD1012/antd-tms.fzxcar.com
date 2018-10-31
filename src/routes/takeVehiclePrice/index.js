import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'

import Modal from './Modal'
import { message,Card  } from 'antd';
import { config } from 'utils'

const TakeVehiclePrice = ({ location, dispatch, takeVehiclePrice, loading, }) => {

  const {
    takeVehiclePriceList,
  } = takeVehiclePrice

  const ModalProps = {
    takeVehiclePriceList,
    location,
    onOk (data,userpin) {
      console.log(data)
      dispatch({
        type: 'takeVehiclePrice/update',
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

TakeVehiclePrice.propTypes = {
  recoveryVehiclePrice: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ takeVehiclePrice, loading }) => ({ takeVehiclePrice, loading }))(TakeVehiclePrice)

