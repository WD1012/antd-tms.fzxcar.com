import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Checkbox, Card, Modal, Select, Icon,List,Button } from 'antd'
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
  checkboxGroup,
  onSelected,selectedProvinceList,
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
            rules: [
              {
                required: true,
                message: '集合名称必填',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem style={{"marginBottom": "8px"}}>
          <Card title="待选省份" >
            {/*<Checkbox.Group options={checkboxGroup} onChange={checkBoxOnChange} />*/}
            <List
              grid={{gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 4,}}
              dataSource={checkboxGroup}
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
  onSearchCity: PropTypes.func,
  handleChange: PropTypes.func,
  removeCity: PropTypes.func,
  addToCity: PropTypes.func,
  onTransferChange: PropTypes.func,
  onSelectChange: PropTypes.func,
  checkBoxOnChange: PropTypes.func,
  checkboxGroup: PropTypes.array,
  targetKeys: PropTypes.array,
  provinceListOption: PropTypes.array,
  targetCheckboxs: PropTypes.array,
  onSelected:PropTypes.func,
  selectedProvinceList:PropTypes.array,
}

export default Form.create()(modal)
