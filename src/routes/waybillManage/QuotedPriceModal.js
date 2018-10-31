import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, List, Tooltip, Tag } from 'antd'
import city from '../../utils/city'
import { Select } from 'antd'
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
  onOk,
  clickDistributionCarriers,
  clickSelectDistributionCarriers,
  tmsOrder,
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
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <List
        size="small"
        bordered
        footer={
          <div className={styles.operation}>
            {tmsOrder.modalType === 'edit' ? <a href="#" onClick={(e) => { clickSelectDistributionCarriers(e) }}>分配其他承运商</a> : null}
          </div>
        }
        dataSource={itemList}
        renderItem={item => (
          <List.Item key={item.id} actions={tmsOrder.modalType === 'edit' ? [<a href="#" onClick={(e) => { clickDistributionCarriers(e, item) }}>分配</a>] : []}>
            <List.Item.Meta
              title={<Tooltip placement="top" title={item.carrierName}>
                <Tag>{`${item.carrierName.length > 20 ? `${item.carrierName.substring(0, 20)}...` : item.carrierName}`}</Tag>
              </Tooltip>}
              description={[`运价￥${item.freightPrice}`,`，提验车费￥${item.checkPrice}`,`，保险费￥${item.insurancePrice}`,`， 税费￥${item.taxationPrice}`,`，到店费￥${item.tostorePrice}`]}
            />
          </List.Item>
        )}
      />
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  itemList: PropTypes.array,
  tmsOrder: PropTypes.object,
  onOk: PropTypes.func,
  clickDistributionCarriers: PropTypes.func,
  clickSelectDistributionCarriers: PropTypes.func,
  filter: PropTypes.object,
}

export default Form.create()(modal)
