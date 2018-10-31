import React from 'react'
import PropTypes from 'prop-types'
import { Form,  Modal,  } from 'antd'
import styles from './importResultModal.less'
import classnames from 'classnames'
const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  addrOptions,
  addrLoadData,
  carrierList,
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
      onOk(data)
    })
  }

  const bgRed = 'rgb(255, 0, 0)';
  const bgGreen = 'rgb(89, 205, 33)';
  const modalOpts = {
    ...modalProps,
    title: `导入线路结果:`+ (item.error === 0 ? "成功":"失败"),

    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}  className={classnames({ [styles.title]: true, [styles.error]: item.error > 0})}>

      <span style={{ background: 'rgb(89, 205, 33)' ,color:"rgb(255, 255, 255)" }}> 合法数据：{item.success}</span><br/><br/>
      <span style={{ background: 'rgb(255, 0, 0)' ,color:"rgb(255, 255, 255)" }}>非法数据：{item.error}</span><br/><br/>
      { item.errormess.length > 0 ? '导入失败原因：'+item.errormess:''}<br/><br/>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
}

export default Form.create()(modal)
