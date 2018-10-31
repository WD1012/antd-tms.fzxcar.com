import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Upload, Icon,message, Modal, Cascader } from 'antd'
import Lightbox from 'react-image-lightbox'
import city from '../../utils/city'
import { api } from '../../utils/config'

const { uploadUrl } = api
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
  beforeUpload,
  onUploadChange,
  previewVisible,
  updatePicsModalVisible,
  handleCancelPreview,
  handlePreview,
  onCloseRequest,
  onMovePrevRequest,
  onMoveNextRequest,
  previewImage,
  updateFileList,
  fileListActiveIndex,
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
        orderBaseId: item.orderBaseId,
      }

      if(item.status === 4 || item.status === 5){
        const mes = item.status === 4?'运单已完成':'运单已失效'
        message.warn(mes+'，数据不允许修改！')
      }else{
        onOk(data)
      }
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  let disabled = false
  let onRemove = true
  if(item.status === 4 || item.status === 5){
    disabled = true
    onRemove = false
  }

  //disabled={true}//控制是否允许上传
  //onRemove={false}//控制是否允许移除

  const fileList = updateFileList.fileList?updateFileList.fileList:[]

  const onPrevRequest = () =>{
    onMovePrevRequest(fileList)
  }

  const onNextRequest = () =>{
    onMoveNextRequest(fileList)
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="调度员备注" hasFeedback {...formItemLayout}>
          {getFieldDecorator('controlRemark', {
            initialValue: item.controlRemark,
            rules: [
              {
                required: true,
                message: '调度员备注必填',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="运输合同" hasFeedback {...formItemLayout}>
          {getFieldDecorator('fileList')(<Upload
            action={uploadUrl}
            defaultFileList={fileList.map((file) => {
              return {
                uid: file.response?file.response.data.pictureId:file.uid,
                name: file.response?file.response.data.ossPictureId:'',
                status: 'done',
                url: file.response?file.response.data.url:file.url,
                }
            })}
            listType="picture-card"
            multiple
            onPreview={handlePreview}
            onChange={onUploadChange}
            disabled={disabled}//控制是否允许上传
            onRemove={onRemove}//控制是否允许移除
          >
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
            </div>
          </Upload>)}

          {previewVisible && <Lightbox
            mainSrc={updateFileList.fileList[fileListActiveIndex].url?updateFileList.fileList[fileListActiveIndex].url:updateFileList.fileList[fileListActiveIndex].response.data.url}
            mainSrcThumbnail={updateFileList.fileList[fileListActiveIndex].url?updateFileList.fileList[fileListActiveIndex].url:updateFileList.fileList[fileListActiveIndex].response.data.url}
            nextSrc={updateFileList.fileList[(fileListActiveIndex + 1) % updateFileList.fileList.length].url?updateFileList.fileList[(fileListActiveIndex + 1) % updateFileList.fileList.length].url:updateFileList.fileList[(fileListActiveIndex + 1) % updateFileList.fileList.length].response.data.url}
            nextSrcThumbnail={updateFileList.fileList[(fileListActiveIndex + 1) % updateFileList.fileList.length].url?updateFileList.fileList[(fileListActiveIndex + 1) % updateFileList.fileList.length].url:updateFileList.fileList[(fileListActiveIndex + 1) % updateFileList.fileList.length].response.data.url}
            prevSrc={updateFileList.fileList[(fileListActiveIndex + updateFileList.fileList.length - 1) % updateFileList.fileList.length].url?updateFileList.fileList[(fileListActiveIndex + updateFileList.fileList.length - 1) % updateFileList.fileList.length].url:updateFileList.fileList[(fileListActiveIndex + updateFileList.fileList.length - 1) % updateFileList.fileList.length].response.data.url}
            prevSrcThumbnail={updateFileList.fileList[(fileListActiveIndex + updateFileList.fileList.length - 1) % updateFileList.fileList.length].url?updateFileList.fileList[(fileListActiveIndex + updateFileList.fileList.length - 1) % updateFileList.fileList.length].url:updateFileList.fileList[(fileListActiveIndex + updateFileList.fileList.length - 1) % updateFileList.fileList.length].response.data.url}
            enableZoom={false}
            nextLabel="下一张"
            prevLabel="上一张"
            onCloseRequest={onCloseRequest}
            onMovePrevRequest={onPrevRequest}
            onMoveNextRequest={onNextRequest}
          />}
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
  beforeUpload: PropTypes.func,
  onUploadChange: PropTypes.func,
  handleCancelPreview: PropTypes.func,
  handlePreview: PropTypes.func,
  onCloseRequest: PropTypes.func,
  onMovePrevRequest: PropTypes.func,
  onMoveNextRequest: PropTypes.func,
  updatePicsModalVisible: PropTypes.bool,
  previewVisible: PropTypes.bool,
  previewImage: PropTypes.string,
  updateFileList: PropTypes.object,
  fileListActiveIndex: PropTypes.number,
}

export default Form.create()(modal)
