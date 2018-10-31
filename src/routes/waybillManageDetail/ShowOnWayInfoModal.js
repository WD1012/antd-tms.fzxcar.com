import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Upload, Icon, Modal, Card } from 'antd'
import city from '../../utils/city'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = [],
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const modalOpts = {
    ...modalProps,
    onOk,
    onCancel,
  }
  const renderOnwayInfo = () => {
    if (item) {
      return item.map((value, index) => {
        return (<Card><p key={'a' + `${index}`} style={{ width: '100%', textAlign: 'left' }}
        >
         时间: {`${value.nodeTime}`}
        </p>
          <p key={'b' + `${index}`}
            style={{ width: '100%', textAlign: 'left' }}
          >
           到达城市: {`${value.provinceName}${value.cityName}`}
          </p>
          <p key={'c' + `${index}`}
            style={{ width: '100%', textAlign: 'left' }}
          >
           备注: {`${value.remark}`}
          </p></Card>)
      })
    }
  }
  return (
    <Modal {...modalOpts}
      okText="确认"
      cancelText="取消"
    >
      <Card title={null} bordered={false}>
        {renderOnwayInfo()}
      </Card>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.array,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
}

export default Form.create()(modal)
