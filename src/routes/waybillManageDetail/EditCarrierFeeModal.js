import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import city from '../../utils/city'
import { Select } from 'antd'

const Option = Select.Option
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
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      data.waybillNo = item.orderBaseId
      data.orderBaseId = item.orderBaseId
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="送店费" hasFeedback {...formItemLayout}>
          {getFieldDecorator('storePrice', {
            initialValue: item.carrierStorePrice,
            rules: [
              {
                message: '输入合法送店费',
                required: true,
              },
            ],
          })(<InputNumber min={0} />)}
        </FormItem>
        <FormItem label="等待费" hasFeedback {...formItemLayout}>
          {getFieldDecorator('waitPrice', {
            initialValue: item.carrierWaitPrice,
            rules: [
              {
                message: '输入合法等待费',
                required: true,
              },
            ],
          })(<InputNumber min={0} />)}
        </FormItem>
        <FormItem label="放空费" hasFeedback {...formItemLayout}>
          {getFieldDecorator('emptyPrice', {
            initialValue: item.carrierEmptyPrice,
            rules: [
              {
                message: '输入合法放空费',
                required: true,
              },
            ],
          })(<InputNumber min={0} />)}
        </FormItem>

      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
