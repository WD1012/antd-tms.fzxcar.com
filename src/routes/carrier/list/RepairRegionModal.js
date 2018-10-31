//运输区域维护页面
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input,Table, Row,Col,Badge,Select, Button, Modal, } from 'antd'
import { message } from 'antd';
const confirm = Modal.confirm
const changeMap = new Map();
const Option = Select.Option;

const repairRegionModal = ({
                             item = {},
                             onOk,
                             form: {
                               getFieldDecorator,
                               validateFields,
                               getFieldsValue,
                             }, regions, onEditItem,onDelItem,addrsData,transportTypes,linkData,
                             ...modalProps
                           }) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        if(errors.origin){
          message.error('起始地必填')
        }
        if(errors.destination){
          message.error('目的地必填')
        }
        if(errors.transportType){
          message.error('运输类型必填')
        }
        if(errors.linkId){
          message.error('联系人必填')
        }
        return
      }

      const { origin,destination,linkId,transportType , }  = getFieldsValue()
      const data = {
        carrierEmployeeId:linkId,
        startingPlace:origin,
        destinationPlace :destination,
        transportType:transportType ,
        carrierId: item.id,
        createUser: 'admin',
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const editorRegion = (record) => {

    const link = changeMap.get('link'+record.id);

    if(!link){
      message.error('未做任何修改')
      return
    }

    if(link === record.linkId){
      message.error('未做任何修改')
      return
    }

    const data = {'carrierEmployeeId':link,'carrierId':item.id,'destinationPlace':'','startingPlace':'','createUser':'admin',};
    confirm({
      title: '确认修改：'+record.origin+' 至 '+record.destination+' 联系人信息 ？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onEditItem(record.id,data)
        changeMap.delete('link'+record.id)
      },
    })

  }

  const delRegion = (record) => {
    confirm({
      title: '确认删除：'+record.origin+' 至 '+record.destination+' 数据 ？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onDelItem(record.id,'admin',item.id,)
      },
    })
  }
  const onChange = (record) =>{

    const e = record.split(',')
    changeMap.set('link'+e[0], e[1])

  }

  const columns = [
    { title: '起始地', dataIndex: 'origin', key: 'name' },
    { title: '目的地', dataIndex: 'destination', key: 'tel' },
    { title: '运输类型', dataIndex: 'transportType', key: 'transportType'   ,
    render: (text) => <span>{parseInt(text) === 1 ? '大板' :parseInt(text) === 2 ?'救援':parseInt(text) === 3 ?'代驾':''}</span>},
    { title: '联系人/电话', dataIndex: 'linkId', key: 'linkId' ,
      render: (text, record) =><Select
        showSearch
        style={{ width: 200 }}
        placeholder="选择联系人"
        optionFilterProp="children"
        defaultValue={record.id + ',' +text}
        onSelect={onChange}
      >
        { linkData.map(json => (<Select.Option key={record.id + ',' + json.value  }>{json.label} </Select.Option>))}
      </Select>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => (
        <span >
           <Button type="primary" ghost  className="margin-right" onClick={e => editorRegion(record, e)}  >修改</Button>
           <Button type="danger" ghost className="margin-right"  onClick={e => delRegion(record, e)}>删除</Button>
          </span>
      ),
    },
  ];

  const titlefun = () =>{
    return '运输区域列表-' + '承运商：'+ item.carrierName
  }

  return (
    <Modal {...modalOpts}>
      <Row  gutter={24} align={"middle"}>
        <Col xs={{span: 2}}
             sm={{span: 3}}
             xl={{ span: 3 }}
             md={{ span: 3 }}
             style={{paddingLeft:10,paddingTop:5,marginBottom:15}}>
          起始地
        </Col>
        <Col xs={{span: 3}}
             sm={{span: 3}}
             xl={{ span: 5 }}
             md={{ span: 5 }}
             style={{paddingLeft:0,paddingTop:0,marginBottom:15}}>
          {getFieldDecorator('origin',{
            rules: [
              {
                required: true,
                message: '起始地必填',
              },
            ],
          })(
            <Select
              showSearch
              style={{ width: 120 }}
              placeholder="选择起始地"
              optionFilterProp="children"
            >
              { addrsData.map(json => (<Select.Option key={json.value}> {json.label} </Select.Option>))}
            </Select>

          )}
        </Col>

        <Col xs={{span: 2}}
             sm={{span: 3}}
             xl={{ span: 3 }}
             md={{ span: 3 }}
             style={{paddingLeft:10,paddingTop:5,marginBottom:15}}>
          目的地
        </Col>
        <Col xs={{span: 3}}
             sm={{span: 3}}
             xl={{ span: 5 }}
             md={{ span: 5 }}
             style={{paddingLeft:0,paddingTop:0,marginBottom:15}}>
          {getFieldDecorator('destination', { rules: [
            {
              required: true,
            },
          ] })(
            <Select
              showSearch
              style={{ width: 120 }}
              placeholder="选择目的地"
              optionFilterProp="children"
            >
              { addrsData.map(json => (<Select.Option key={json.value}> {json.label} </Select.Option>))}
            </Select>
          )}
        </Col>
      </Row>

      <Row  gutter={24} align={"middle"}>

        <Col xs={{span: 2}}
             sm={{span: 3}}
             xl={{ span: 3 }}
             md={{ span: 3 }}
             style={{paddingLeft:10,paddingTop:5,marginBottom:15}}>
          联系人
        </Col>
        <Col xs={{span: 3}}
             sm={{span: 3}}
             xl={{ span: 5 }}
             md={{ span:5 }}
             style={{paddingLeft:0,paddingTop:0,marginBottom:15}}>
          {getFieldDecorator('linkId', { rules: [
            {
              required: true,
            },
          ] })(<Select
            showSearch
            style={{ width: 120 }}
            placeholder="选择联系人"
            optionFilterProp="children"
            dropdownMatchSelectWidth={false}
          >
            { linkData.map(json => (<Select.Option key={json.value}> {json.label} </Select.Option>))}
          </Select>)}
        </Col>

        <Col xs={{span: 2}}
             sm={{span: 3}}
             xl={{ span: 3 }}
             md={{ span: 3 }}
             style={{paddingLeft:10,paddingTop:5,marginBottom:15}}>
          运输类型
        </Col>
        <Col xs={{span: 3}}
             sm={{span: 3}}
             xl={{ span: 5 }}
             md={{ span:5 }}
             style={{paddingLeft:0,paddingTop:0,marginBottom:15}}>
          {getFieldDecorator('transportType', { rules: [
            {
              required: true,
            },
          ] })(<Select
            showSearch
            style={{ width: 120 }}
            placeholder="选择运输类型"
            optionFilterProp="children"
          >
            { transportTypes.map(json => (<Select.Option key={json.value}> {json.label} </Select.Option>))}
          </Select>)}
        </Col>

        <Col xs={{span: 3}}
             sm={{span: 3}}
             xl={{ span: 4 }}
             md={{ span: 4 }}
             style={{paddingLeft:5,paddingTop:0,marginBottom:15}}>

          <Button type="primary" className="margin-right"  style={{color:"rgb(255, 255, 255)" }} onClick={handleOk} >添加</Button>
        </Col>

      </Row>

      <Table
        title={titlefun}
        dataSource={regions}
        className="components-table-demo-nested"
        bordered
        columns={columns}
        simple
        size="small"
        rowKey={record => record.id}
        pagination={false}
      />
    </Modal>
  )
}

repairRegionModal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  regions:PropTypes.array,
  onEditItem:PropTypes.func,
  addrsData:PropTypes.array,
  linkData:PropTypes.array,
  onDelItem:PropTypes.any,
}

export default Form.create()(repairRegionModal)
