import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Checkbox, Card, Modal, Select, Cascader,List,Button } from 'antd'
import city from '../../utils/city'

const FormItem = Form.Item
const map = new Map();
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
  onSelected,selectedRegionList,
                 addrOptions,
                 addrLoadData,
                 onSelectedProvinceCity,
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
  const validatorAddr = (rule, value, callback) => {

    if (value) {
      if (value.length != 2) {
        callback('必须选择到市级地址')
      }
      callback()
    } else {
      callback('必须选择到市级地址')
    }
  }

  const onChange = (value, selectedOptions) =>{
    selectedOptions.map((item) => {
      map.set(item.value,item.label)
    })

    if(value.length === 2){

      onSelectedProvinceCity(value[1]);
    }


  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="区集合名称" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('collectionName', {
            rules: [
              {
                required: true,
                message: '区集合名称必填',
              },
            ],
          })(<Input />)}
        </FormItem>


        <FormItem label="待选省/市" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('origin',
            {
              rules: [
                {
                  required: true,
                  validator: validatorAddr,
                },
              ],
            }
          )(<Cascader
            style={{ width: '100%' }}
            options={addrOptions}
            loadData={addrLoadData}
            changeOnSelect
            onChange={onChange}
            placeholder="选择待选省/市"
          />)}
        </FormItem>

        <FormItem style={{"marginBottom": "8px"}}>
          <Card title="待选区" >
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
          <Card title="已选区">
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
  checkboxGroup: PropTypes.array,
  targetKeys: PropTypes.array,
  provinceListOption: PropTypes.array,
  targetCheckboxs: PropTypes.array,
  onSelected:PropTypes.func,

  candidateRegionList:PropTypes.array,
  addrOptions: PropTypes.array,
  addrLoadData: PropTypes.func,
  onSelectedProvinceCity: PropTypes.func,
  selectedRegionList: PropTypes.array,

}

export default Form.create()(modal)
