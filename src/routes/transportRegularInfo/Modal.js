import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader, Select, Table, Button } from 'antd'
import city from '../../utils/city'

const FormItem = Form.Item
let isDisabled = false;
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
  handleAdd,
  saveRow,
  regionResultList,
  addrLoadData,
  deleteRow,
  onChangeUnit,
  onChangeRate,
  onBlurUnit,
  tableData,
  startCityOnChange,
  endCityOnChange,
  startCityOption,
  endCityOption,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    if(isDisabled){
      message.error('请勿频繁提交')
      return
    }

    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      isDisabled = true;
      onOk(data)

      setTimeout(function () {
        isDisabled = false;
      }, 10000);
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const children = [];
  children.push(<Select.Option key={1}>{'大板'}</Select.Option>);
  children.push(<Select.Option key={2}>{'救援'}</Select.Option>);
  children.push(<Select.Option key={3}>{'代驾'}</Select.Option>);

  const columns = [
    {
      title: '最小计费公里数  ',
      dataIndex: 'beforUnit',
      width: '40%',
      render: (text, record) => {
        let opt
        if (tableData.length === 1) { opt = '' } else if (tableData.length - 1 === record.index) {
          opt = ''
        } else {

          opt = (<div className="editable-cell">
            {
              <div className="editable-cell-input-wrapper">
                <Input  addonBefore=">"  disabled={true} value={record.beforUnit}
                       min={1} precision={0}/>
              </div>
            }
          </div>)
        }
        return (
          opt
        )
      },

    },{
    title: '最大计费公里数',
    dataIndex: 'unit',
    width: '40%',
    render: (text, record) => {
      let opt
      if (tableData.length === 1) { opt = '' } else if (tableData.length - 1 === record.index) {
        opt = ''
      } else {
        opt = (<div className="editable-cell">
          {
            <div className="editable-cell-input-wrapper">
              <Input  addonBefore="<=" value={record.billUnit}
                onChange={(...arg) => {
                       onChangeUnit(...arg, record)
                     }}
                onBlur={(...arg) => {
                  onBlurUnit(...arg, record)
                }}
                     min={1} precision={0}/>
            </div>
          }
        </div>)
      }
      return (
        opt
      )
    },

  }, {
    title: 'X元/公里',
    dataIndex: 'rate',
    width: '20%',
    render: (text, record) => {
      return (
        <div className="editable-cell-input-wrapper">
          <Input value={record.unit}
            onChange={(...arg) => {
                   onChangeRate(...arg, record)
                 }}
                 min={1} precision={0} />
        </div>
      )
    },
  }, {
    title: '操作',
    dataIndex: 'operation',
    width: '30%',
    render: (text, record) => {
      let opt
      if (tableData.length === 1) {
        opt = (<Button type="primary" onClick={handleAdd}>添加</Button>)
      } else if ((tableData.length - 1 !== record.index) && (tableData.length !== 1)) {
        opt = (<Button type="danger"
          onClick={(...arg) => {
            deleteRow(...arg, record)
          }}
        >删除</Button>)
      } else {
        opt = (<Button type="primary" onClick={handleAdd}>添加</Button>)
      }
      return (
        opt
      )
    },
  }]
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="起始地" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('startCity', {
            rules: [
              {
                required: true,
                message: '起始地不能为空',
              },
            ],
          })(<Cascader
            style={{ width: '100%' }}
            options={regionResultList}
            onChange={startCityOnChange}
            changeOnSelect
            loadData={addrLoadData}
            placeholder="起始地"
          />)}
        </FormItem>
        <FormItem label="目的地" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('destinationCity', {
            rules: [
              {
                required: true,
                message: '目的地不能为空',
              },
            ],
          })(<Cascader
            style={{ width: '100%' }}
            options={regionResultList}
            onChange={endCityOnChange}
            changeOnSelect
            loadData={addrLoadData}
            placeholder="目的地"
          />)}
        </FormItem>
        <FormItem label="计费单位" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('countUnit', {
            rules: [
              {
                required: true,
                message: '计费单位不能为空',
              },
            ],
          })(<Select>
            <Select.Option value={1}>里程(公里)</Select.Option>
          </Select>)}
        </FormItem>

        <FormItem label="计费方式" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('billType', {
            rules: [
              {
                required: true,
                message: '计费方式不能为空',
              },
            ],
          })(<Select>
            <Select.Option value={3}>阶梯价格</Select.Option>
            <Select.Option value={2}>区间价格</Select.Option>
          </Select>)}
        </FormItem>

        <FormItem label="运输类型" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('transportTypeId', {
            rules: [
              {
                required: true,
                message: '运输类型不能为空',
              },
            ],
          })(<Select>
            {children}
          </Select>)}
        </FormItem>

        <FormItem label="优先级" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('priorityLevel', {
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
      <Table bordered rowKey={record => record.index} pagination={false} dataSource={tableData} columns={columns} />
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  tableData: PropTypes.array,
  onOk: PropTypes.func,
  handleAdd: PropTypes.func,
  saveRow: PropTypes.func,
  deleteRow: PropTypes.func,
  onChangeUnit: PropTypes.func,
  onChangeRate: PropTypes.func,
  regionResultList: PropTypes.array,
  addrLoadData: PropTypes.func,
  startCityOnChange: PropTypes.func,
  endCityOnChange: PropTypes.func,
  startCityOption: PropTypes.array,
  endCityOption: PropTypes.array,
  onBlurUnit:PropTypes.func,
}

export default Form.create()(modal)
