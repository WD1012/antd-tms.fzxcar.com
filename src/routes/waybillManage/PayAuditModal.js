import React from 'react'
import PropTypes from 'prop-types'
import { Form, Card, Row, Upload, Modal, List, Tooltip, Tag } from 'antd'
import city from '../../utils/city'
import { Select } from 'antd'

import styles from './PayAuditModal.less'
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
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  filter, payautpics,
  referPicsModalVisible,
  referPics,
  referPicsActiveIndex,
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
    <Modal {...modalOpts} >

      <Upload
        defaultFileList={payautpics.map((file) => {
          return {
            uid: file.pictureId,
            status: 'done',
            url: file.src,
          }
        })}
        listType="picture-card"
        multiple
        disabled={false}//控制是否允许上传
        className={styles.delete}
      >
      </Upload>

      {referPicsModalVisible && <Lightbox
        mainSrc={referPics[referPicsActiveIndex].src}
        mainSrcThumbnail={referPics[referPicsActiveIndex].thumbnail}
        imageTitle={referPics[referPicsActiveIndex].desc}
        nextSrc={referPics[(referPicsActiveIndex + 1) % referPics.length].src}
        nextSrcThumbnail={referPics[(referPicsActiveIndex + 1) % referPics.length].thumbnail}
        prevSrc={referPics[(referPicsActiveIndex + referPics.length - 1) % referPics.length].src}
        prevSrcThumbnail={referPics[(referPicsActiveIndex + referPics.length - 1) % referPics.length].thumbnail}
        enableZoom={false}
        nextLabel="下一张"
        prevLabel="上一张"
        onCloseRequest={() => {
          dispatch({
            type: 'waybillManage/closeReferPicsImgViewer',
          })
        }}
        onMovePrevRequest={() => {
          dispatch({
            type: 'waybillManage/updateReferPicsActiveIndex',
            payload: {
              referPicsActiveIndex: (referPicsActiveIndex + referPics.length - 1) % referPics.length,
            },
          })
        }
        }
        onMoveNextRequest={() => {
          dispatch({
            type: 'waybillManage/updateReferPicsActiveIndex',
            payload: {
              referPicsActiveIndex: (referPicsActiveIndex + 1) % referPics.length,
            },
          })
        }
        }
      />}

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
  payautpics:PropTypes.array,
  referPics:PropTypes.array,
  referPicsModalVisible:PropTypes.bool,
  referPicsActiveIndex:PropTypes.any,
}

export default Form.create()(modal)
