import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Modal,InputNumber, Select, Table } from 'antd'
import { DropOption } from 'components'

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
  tableData,
  handleAdd,
  deleteRow,
  onChangeUnit,
  onChangeRate,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
  ...modalProps
}) => {
  const handleMenuClick = (record, e) => {
    Modal.confirm({
      title: '确认删除这条记录?',
      onOk () {
        deleteRow(record)
      },
    })
  }
  const columns = [{
    title: '最低计费单位数',
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
              <Input value={record.unit} precision={0} min={0}
                onChange={(...arg) => {
                       onChangeUnit(...arg, record)
                     }}
              />
            </div>
          }
        </div>)
      }
      return (
        opt
      )
    },

  }, {
    title: '费率',
    dataIndex: 'rate',
    width: '40%',
    render: (text, record) => {
      return (
            <div className="editable-cell-input-wrapper">
              <InputNumber value={record.rate}  min={0} max={100} precision={0}
                           formatter={value => `${value}‱`}
                           parser={value => value.replace('‱', '')}
                           onChange={(...arg) => {
                             onChangeRate(...arg, record)
                           }}/>
            </div>
      )
    },
  }, {
    title: '操作',
    dataIndex: 'operation',
    width: '30%',
    render: (text, record) => {
      let opt
      if (tableData.length === 1) { opt = (<Button type="primary" onClick={handleAdd}>添加</Button>) } else if ((tableData.length - 1 !== record.index) && (tableData.length !== 1)) {
        opt = (<Button type="danger"
          onClick={deleteRow}
        >删除</Button>)
      } else opt = (<Button type="primary" onClick={handleAdd}>添加</Button>)
      return (
        opt
      )
    },
  }]
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
        <FormItem label="模板名称" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('templateName', {
            rules: [
              {
                required: true,
                message: '模板名称必填',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="计费类型" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '计费类型必选',
              },
            ],
          })(<Select >
            <Select.Option initialValue value="1">阶梯费用</Select.Option>
          </Select>)}
        </FormItem>
        <FormItem label="计费单位" hasFeedback {...formItemLayout} style={{"marginBottom": "8px"}}>
          {getFieldDecorator('billingUnit', {
            rules: [
              {
                required: true,
                message: '计费单位必选',
              },
            ],
          })(<Select >
            <Select.Option initialValue value="1">单辆车报价</Select.Option>
          </Select>)}
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
  onOk: PropTypes.func,
  deleteRow: PropTypes.func,
  onChangeUnit: PropTypes.func,
  onChangeRate: PropTypes.func,
  handleAdd: PropTypes.func,
  tableData: PropTypes.array,
}

export default Form.create()(modal)
