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
  onSearchCity,
  removeCity,
  addToCity,
  handleChange,
  provinceListOption, candidateRegionList,
  onTransferChange,
  checkboxGroup,
  selectedRegionList,
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

        <FormItem label="待选省/市" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          { item.provName  }/ {item.cityName}
        </FormItem>

        <FormItem style={{"marginBottom": "8px"}}>
          <Card title="待选城市" >
            {/*<Checkbox.Group key="choiceCity" defaultValue={updateCheckBoxDefault} options={checkboxGroup} onChange={checkBoxOnChange} />*/}
            <List
              grid={{gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 4,}}
              dataSource={candidateRegionList}
              renderItem={item => (
                <List.Item>
                  <Button onClick={(e) => { onSelected(item.value) }}  className="margin-right">{item.label}</Button>
                </List.Item>
              )}
            />

          </Card>
          <Card title="已选城市">
            <List
              grid={{gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 4,}}
              dataSource={selectedRegionList}
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
  onSearchCity: PropTypes.func,
  handleChange: PropTypes.func,
  removeCity: PropTypes.func,
  addToCity: PropTypes.func,
  onTransferChange: PropTypes.func,
  onSelectChange: PropTypes.func,
  checkBoxOnChange: PropTypes.func,
  cityListOption: PropTypes.array,
  checkboxGroup: PropTypes.array,
  targetKeys: PropTypes.array,
  provinceListOption: PropTypes.array,
  targetCheckboxs: PropTypes.array,
  updateCheckBoxDefault: PropTypes.array,
  onSelected:PropTypes.func,

  candidateRegionList:PropTypes.array,
  selectedRegionList: PropTypes.array,
}

export default Form.create()(modal)
