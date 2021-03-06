import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, DatePicker, Modal, Cascader } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')
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
  regionResultOption,
  addrLoadData,
  saveSelectedOptionsFunc,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
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
        key: item.key,
      }
      data.nodeTime = data.time.format('YYYY-MM-DD HH:mm:ss')
      console.log(data)
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
        <FormItem label="时间:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('time', {
            rules: [
              {
                required: true,
                message: '选择有效时间',
              },
            ],
          })(<DatePicker
            showTime
            placeholder="选择到期时间"
            format="YYYY-MM-DD HH:mm:ss"
          />)}
        </FormItem>
        <FormItem label="地址:" hasFeedback {...formItemLayout}>
          {
            getFieldDecorator('location', {
              rules: [
                {
                  required: true,
                  message: '选择有效的地址',
                },
              ],
            })(<Cascader
              style={{ width: '100%' }}
              options={regionResultOption}
              loadData={addrLoadData}
              onChange={(value, selectedOptions) => {
                const selectedOptionsLabel = selectedOptions.map(label => label.label)
                saveSelectedOptionsFunc(selectedOptionsLabel)
              }}
              placeholder="起始地"
            />)
          }
        </FormItem>
        <FormItem label="备注:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('remark', {
            rules: [
              {
                required: true,
                message: '填写有效的备注',
              },
            ],
          })(<Input placeholder="备注" />)}
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
  addrLoadData: PropTypes.func,
  saveSelectedOptionsFunc: PropTypes.func,
  regionResultOption: PropTypes.array,
}

export default Form.create()(modal)
