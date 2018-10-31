import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, InputNumber, Select, Modal, Cascader } from 'antd'
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
                 item = {},
                 onOk,
                 statusOptions,
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
        createUser:'admin',
        status:item.status,
      }

      onOk(data,item.id)
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="起始地" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {item.startProvince}-{item.startCity}{item.startRegion?'-'+item.startRegion:''}
        </FormItem>
        <FormItem label="目的地" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {item.destinationProvince}-{item.destinationCity}{item.destinationRegion?'-'+item.destinationRegion:''}
        </FormItem>
        <FormItem label="运输类型" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {item.transportTypeId === 1 ? '大板' : item.transportTypeId === 2?'救援':'代驾'}
        </FormItem>
        <FormItem label="运价" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('fixedRate', {
            initialValue: item.fixedRate,
            rules: [
              {
                required: true,
                type: 'number',
                message: '运价必填，且为整数',
              },
            ],
          })(<InputNumber min={0} max={99999999} precision={0} />)}元
        </FormItem>
        <FormItem label="状态" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {item.status === 0 ?'正常':'暂停'}
        </FormItem>

        <FormItem label="优先级" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('priorityLevel', {
            initialValue: item.priorityLevel,
            rules: [
              {
                required: true,
                type: 'number',
                message: '优先级不能为空且为0-100有效数字',
              },
            ],
          })(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0-100有效数字,0 代表最高优先级"/>)}
        </FormItem>

      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  statusOptions: PropTypes.array,
  startAddressLabel: PropTypes.array,
  endAddressLabel: PropTypes.array,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
