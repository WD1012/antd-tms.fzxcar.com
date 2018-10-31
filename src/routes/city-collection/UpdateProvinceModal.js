import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Checkbox, Card, Modal, Select, Button, List } from 'antd'
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
  removeCity,
                 candidateProvinceList,
                 selectedProvinceList,
  onSelected,
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
        key: item.key,
      }
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
        <FormItem label="集合名称" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('collectionName', {
            initialValue: item.collectionName,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem style={{"marginBottom": "8px"}}>
          <Card title="待选省份" >
            <List
              grid={{gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 4,}}
              dataSource={candidateProvinceList}
              renderItem={item => (
                <List.Item>
                  <Button onClick={(e) => { onSelected(item.value) }}  className="margin-right">{item.label}</Button>
                </List.Item>
              )}
            />

          </Card>
          <Card title="已选省份">
            <List
              grid={{gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 4,}}
              dataSource={selectedProvinceList}
              renderItem={item => (
                <List.Item>
                  <Button onClick={(e) => { removeCity(item) }}>{item.cityName}</Button>
                </List.Item>
              )}
            />
          </Card>
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
  handleChange: PropTypes.func,
  removeCity: PropTypes.func,
  addToCity: PropTypes.func,
  onTransferChange: PropTypes.func,
  cityListOption: PropTypes.array,
  checkboxGroup: PropTypes.array,
  provinceListOption: PropTypes.array,
  onSelected:PropTypes.func,
  candidateProvinceList: PropTypes.array,
  selectedProvinceList: PropTypes.array,
}

export default Form.create()(modal)
