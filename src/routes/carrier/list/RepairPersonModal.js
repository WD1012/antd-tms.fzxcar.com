//业务人员维护页面
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input,Table, Row,Col,Badge,Checkbox, Button, Modal, } from 'antd'
import { message } from 'antd';
const confirm = Modal.confirm
const changeMap = new Map();
let isDisabled = false;
const repairPersonModal = ({
                        item = {},
                        onOk,
                        form: {
                          getFieldDecorator,
                          validateFields,
                          getFieldsValue,
                          setFieldsValue,
                          setFieldDecorator
                        }, persons, onEditItem,onDelItem,onSetMasterItem,
                        ...modalProps
                      }) => {
  const handleOk = () => {
    if(isDisabled){
      message.error('请勿频繁提交')
      return
    }

    validateFields((errors) => {
      if (errors) {

        if(errors.name){
          message.error('姓名必填')
        }
        if(errors.tel){
          message.error('电话必填且为合法手机号')
        }
        return
      }
      let { name,tel,isMaster, }  = getFieldsValue()

      const data = {
        employeeName:name,
        linkTel:tel,
        carrierId: item.id,
        createUser: 'admin',
        isMain:isMaster?'0':1
      }
      isDisabled = true;

      const fields = getFieldsValue()
      fields.name = undefined
      fields.tel  = undefined
      setFieldsValue(fields)

      onOk(data)

      setTimeout(function () {
        isDisabled = false;
      }, 3000);

    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }


  const editorPerson = (record) => {
    const nameKey = 'name'+record.id
    const telKey = 'tel'+record.id

    if(!changeMap.has(nameKey) && !changeMap.has(telKey)){
      message.error('未做任何修改')
      return
    }

    const name = changeMap.get(nameKey)?changeMap.get(nameKey):record.name;
    const tel = changeMap.get(telKey)?changeMap.get(telKey):record.tel;

    if(name === record.name && tel === record.tel){
      message.error('未做任何修改')
      return
    }

    if(telVerify(tel)){
      message.error('电话必填且为合法手机号')
      return
    }

    const data = {'employeeName':name,'linkTel':tel,'carrierId':item.id,'isMain':record.isMaster,'createUser':'admin'};

    confirm({
      title:'确认修改联系人：'+record.name+' 信息？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onEditItem(record.id,data)
        changeMap.delete(nameKey)
        changeMap.delete(telKey)
      },
    })

  }

  const del = (record) => {
    confirm({
      title: '确认删除联系人：'+record.name+ ' 数据？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onDelItem(record.id,'admin',item.id)
      },
    })
  }

  const setMaserPerson = (record) => {

    confirm({
      title: '确认设联系人：'+record.name+'为主联系人？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onSetMasterItem(record.id,'admin',item.id)
      },
    })

  }

  const telVerify = (tel) =>{
    if (!/^1(3|5|7|8|9)[0-9]{9}$/.test(tel)) {
      return true
    }
    return false
  }

  const onChange = (event) =>{
    changeMap.set(event.target.id, event.target.value)
  }

  const columns = [
    { title: '', key: 'isMaster',dataIndex: 'isMaster', render: (text, record) => <span><Badge status={text === 0 ? 'success' : 'error'} />{text === 0 ? '主' : '非主'}</span> },
    { title: '姓名', dataIndex: 'name', key: 'name', render: (text, record) => <Input id={'name'+record.id} defaultValue={text} onChange={onChange}  style={{ width: 100 }}/> },
    { title: '联系电话', dataIndex: 'tel', key: 'tel', render: (text, record) => <Input id={'tel'+record.id} defaultValue={text}  onChange={onChange}  style={{ width: 100 }}/> },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => (
        <span >
           <Button type="primary" ghost  className="margin-right" onClick={e => editorPerson(record, e)}  >修改</Button>
           <Button type="danger" ghost className="margin-right" onClick={e => del(record, e)} >删除</Button>
           <Button type="dashed"  disabled={record.isMaster ===0} onClick={e => setMaserPerson(record, e)} >设为主联系人</Button>
          </span>
      ),
    },
  ];

  const titlefun = () =>{
    return '业务联系人列表-承运商：'+ item.carrierName
  }

  return (
    <Modal {...modalOpts}>
      <Row  gutter={24} align={"middle"}>
        <Col xs={{span: 2}}
             sm={{span: 3}}
             xl={{ span: 2 }}
             md={{ span: 2 }}
             style={{paddingLeft:10,paddingTop:5,marginBottom:15}}>
          姓名
        </Col>
        <Col xs={{span: 3}}
             sm={{span: 3}}
             xl={{ span: 5 }}
             md={{ span: 5 }}
             style={{paddingLeft:0,paddingTop:0,marginBottom:15}}>
          {getFieldDecorator('name',{
            rules: [
              {
                required: true,
                message: '姓名必填',
              },
            ],
          })(<Input placeholder="输入姓名" />)}
        </Col>

        <Col xs={{span: 2}}
             sm={{span: 3}}
             xl={{ span: 2 }}
             md={{ span: 2 }}
             style={{paddingLeft:10,paddingTop:5,marginBottom:15}}>
          电话
        </Col>
        <Col xs={{span: 3}}
             sm={{span: 3}}
             xl={{ span: 6 }}
             md={{ span: 6 }}
             style={{paddingLeft:0,paddingTop:0,marginBottom:15}}>
          {getFieldDecorator('tel', { rules: [
            {
              required: true,
              pattern: /^1[34578]\d{9}$/,
            },
          ] })(<Input placeholder="输入电话" />)}
        </Col>

        <Col xs={{span: 5}}
             sm={{span: 5}}
             xl={{ span: 5 }}
             md={{ span: 5 }}
             style={{paddingLeft:10,paddingTop:5,marginBottom:15}}>
          {getFieldDecorator('isMaster', )( <Checkbox>主联系人</Checkbox>)}
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
        dataSource={persons}
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

repairPersonModal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  persons:PropTypes.array,
  onEditItem:PropTypes.func,
  onDelItem:PropTypes.func,
  onSetMasterItem:PropTypes.func,
}

export default Form.create()(repairPersonModal)
