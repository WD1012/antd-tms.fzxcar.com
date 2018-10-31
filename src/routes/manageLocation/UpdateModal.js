import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Select, Tag } from 'antd'
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

const updateModal = ({
  item,
  onOk,
  provinceListOption,
  accountListOption,
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
      // console.log(data)
      data.createUser = 'nocookie'
      data.provinceName = data.provinceNames.map((it) =>{
        if (typeof it.label === 'string') {
          return { provinceCode: it.key, provinceName: it.label }
        }
        else if (typeof it.label === 'object') {
          return { provinceCode: it.key, provinceName: it.label.join('') }
        }
      })
      data.userName = data.userNames.map((it) => {
        if (typeof it.label === 'string') {
          return { uuid: it.key, account: it.label }
        }
        else if (typeof it.label === 'object') {
          return { uuid: it.key, account: it.label.join('') }
        }
      })
      data.regionId = item.regionId
      data.status=0
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      {
        console.log(item.provinceName.map((it) => {
          return { key: it.provinceCode, label: it.provinceName }
        }))
      }
      <Form layout="horizontal">
        <FormItem label="大区名称" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('regionName', {
            initialValue: item.regionName,
            rules: [
              {
                required: true,
                message: '大区名称不能为空',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="省份" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('provinceNames', {
            initialValue: item.provinceName.map((it) => { return { key: it.provinceCode, label: it.provinceName } }),
            rules: [
              {
                required: true,
                message: '省份不能为空',
              },
            ],
          })(<Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择省份"
            labelInValue
          >{provinceListOption}</Select>)}
        </FormItem>
        <FormItem label="负责人" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('userNames', {
            initialValue: item.userName.map((it) => { return { key: it.userCode, label: it.userName } }),
            rules: [
              {
                required: true,
                message: '负责人不能为空',
              },
            ],
          })(<Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择负责人"
            labelInValue
          >{accountListOption}</Select>)}
        </FormItem>
        <FormItem label="备注" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('remark', {
            initialValue: item.remark,
            rules: [
              {
                required: true,
                message: '备注不能为空或备注超长',
                max: 200,
              },
            ],
          })(<Input />)}
        </FormItem>

      </Form>
    </Modal>
  )
}

updateModal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  provinceListOption: PropTypes.array,
  accountListOption: PropTypes.array,
}

export default Form.create()(updateModal)
