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
  provinceListOption,
  checkBoxOnChange,
  onTransferChange,
  checkboxGroup,
  updateCheckBoxDefault,
  onSelectChange,
  cityListOption,
  targetCheckboxs,
  targetKeys,
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
        <FormItem label="待选省" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('prov', {
          })(<Select
            labelInValue
            placeholder="选择省份"
            filterOption={false}
            onChange={onSearchCity}
            style={{
                width: '100%',
            }}
          >{provinceListOption}</Select>)}
        </FormItem>
        <FormItem style={{"marginBottom": "8px"}}>
          <Card title="待选城市" >
            {/*<Checkbox.Group key="choiceCity" defaultValue={updateCheckBoxDefault} options={checkboxGroup} onChange={checkBoxOnChange} />*/}
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
          <Card title="已选城市">
            {/* <Checkbox.Group options={item.collecitonDetail.map((i) => { */}
            {/* return { label: i.cityName, value: i.cityCode } */}
            {/* })} */}
            {/* onChange={removeCity} */}
            {/* > */}
            <List
              grid={{gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 4,}}
              dataSource={item.collecitonDetail}
              renderItem={item => (
                <List.Item>
                  <Button onClick={(e) => { removeCity(item.cityCode) }}>{item.cityName}</Button>
                </List.Item>
              )}
            />
          </Card>
        </FormItem>
        {/* <FormItem>
          <Transfer
            dataSource={cityListOption}
            targetKeys={targetKeys}
            onChange={onTransferChange}
            onSelectChange={onSelectChange}
            titles={['待选城市', '已选城市']}
            operations={['选中', '移除']}
            render={_item => _item.title}
          />
        </FormItem> */}
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
}

export default Form.create()(modal)
