import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Select, Modal, List } from 'antd'
import city from '../../utils/city'
import styles from './List.less'

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
  itemList,
  onOkDistributionCarriers,
                 currentItem,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  filter,
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
      data.filter = filter

      onOkDistributionCarriers(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="其他承运商" hasFeedback {...formItemLayout}>
          {getFieldDecorator('carrierId', {
            rules: [
              {
                message: '请选择承运商',
                required: true,
              },
            ],
          })(<Select style={{ width: 200 }} showSearch dropdownMatchSelectWidth={false} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>{itemList}</Select>)}
        </FormItem>


        {currentItem.currentItem && currentItem.currentItem.transportType === 1 &&  <FormItem label="提验车费" hasFeedback {...formItemLayout}>
          {getFieldDecorator('checkPrice', {
            rules: [
              {
                message: '请输入提验车费',
                required: true,
              },
            ],
          })(<InputNumber
            formatter={value => `￥${value}`}
            parser={value => value.replace('￥', '')}
            style={{ width: 200 }} min={0} precision={2}/>)}元
        </FormItem> }


        <FormItem label="保险费" hasFeedback {...formItemLayout}>
          {getFieldDecorator('insurancePrice', {
            rules: [
              {
                message: '请输入保险费',
                required: true,
              },
            ],
          })(<InputNumber
            formatter={value => `￥${value}`}
            parser={value => value.replace('￥', '')}
            style={{ width: 200 }} min={0} precision={2}/>)}元
        </FormItem>

        <FormItem label="税费" hasFeedback {...formItemLayout}>
          {getFieldDecorator('taxationPrice', {
            rules: [
              {
                message: '请输入税费',
                required: true,
              },
            ],
          })(<InputNumber
            formatter={value => `￥${value}`}
            parser={value => value.replace('￥', '')}
            style={{ width: 200 }} min={0} precision={2}/>)}元
        </FormItem>

        {currentItem.currentItem && currentItem.currentItem.transportType === 1 && <FormItem label="到店费" hasFeedback {...formItemLayout}>
          {getFieldDecorator('toStorePrice', {
            rules: [
              {
                message: '请输入到店费',
                required: true,
              },
            ],
          })(<InputNumber
            formatter={value => `￥${value}`}
            parser={value => value.replace('￥', '')}
            style={{ width: 200 }} min={0} precision={2}/>)}元
        </FormItem>}

        <FormItem label="运价" hasFeedback {...formItemLayout}>
          {getFieldDecorator('price', {
            rules: [
              {
                message: '请输入运价  ',
                required: true,
              },
            ],
          })(<InputNumber
            formatter={value => `￥${value}`}
            parser={value => value.replace('￥', '')}
            style={{ width: 200 }} min={0} precision={2}/>)}元
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  itemList: PropTypes.array,
  filter: PropTypes.object,
  onOkDistributionCarriers: PropTypes.func,
  currentItem:PropTypes.object,
}

export default Form.create()(modal)
