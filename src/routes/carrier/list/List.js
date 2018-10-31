import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal,Badge, } from 'antd'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import styles from './List.less'
import { Divider } from 'antd';
import AuthButton from "../../../components/AuthButton/AuthButton";
const confirm = Modal.confirm

const List = ({
  onDeleteItem,onOffItem, onEditItem, location,childData,loadChild,childTable,onRepairPersonItem,onRepairRegionItem,...tableProps
}) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      onRepairPersonItem(record)
    } else if (e.key === '3') {
      onRepairRegionItem(record)
    }
  }

  const onOffComfim = (record, e) => {
    e.preventDefault()
    let l ;
    if(record.status === 0){
      l = '关闭';
    }else{
      l = '开启';
    }
    confirm({
      title: '确认'+l+'承运商？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onOffItem(record.id,'admin')
      },
    })
  }

  const deleteComfim = (id,e) => {
    e.preventDefault()
    confirm({
      title: '同时删除对应的联系人及区域，确认删除承运商？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onDeleteItem(id,'admin')
      },
    })
  }

  const convert = (text) => {
    let m = ''
    if(text){
      text.map((item)=>{
        if(item === '1'){
          m = m + '大板 '
        }
        if(item === '2'){
          m = m + '救援 '
        }
        if(item === '3'){
          m = m + '代驾 '
        }
      })
    }
    return m
  }

  const columns = [
    {
      title: '承运商名称',
      dataIndex: 'carrierName',
      key: 'carrierName',
      width: 300,
      fixed: 'left',
      render: (text, record) => <Link to={`manage-carrier/${record.id}`}>{text}</Link>,
    }, {
      title: '承运商简称',
      dataIndex: 'carrierShortName',
      key: 'carrierShortName',
      width: 150,
      fixed: 'left',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => <span><Badge status={text === 0 ? 'success' : 'error'} />{text === 0 ? '正常' : '暂停'}</span>,
    },{
      title: '运输类型',
      dataIndex: 'transportTypes',
      key: 'transportTypes',
      width: 150,
      render: (text) => <span>{convert(text)}</span>,
    },{
      title: '法人/联系方式',
      dataIndex: 'legalCombination',
      key: 'legalCombination',
      width: 200,
    }, {
      title: '主要业务联系人/联系方式',
      dataIndex: 'linkCombination',
      key: 'linkCombination',
      width: 200,
    }, {
      title: '保险费',
      dataIndex: 'templateName',
      key: 'templateName',
      width: 150,
    },{
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 300,
    },{
      title: '操作',
      key: 'operation',
      width: 200,
      fixed: 'right',
      render: (text, record) => (
        <span className={styles.operation}>
          <AuthButton child={[ <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑承运商' }, { key: '2', name: '维护联系人' },{ key: '3', name: '维护运输区域' },]} />
          ,<Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />]} resourceId={'RES_2_163'} />
          <AuthButton child={[   <a href="#" onClick={e => onOffComfim(record, e)}>{record.status === 0 ?'暂停':'开启'}</a>,
          <Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />]} resourceId={'RES_2_168'} />
        <AuthButton child={[  <a href="#" onClick={e => deleteComfim(record.id, e)}>删除</a>]} resourceId={'RES_2_164'} />
        </span>
      )
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }


  const childColumns = [
    { title: '起始地', dataIndex: 'date', key: 'date' },
    { title: '目的地', dataIndex: 'name', key: 'name' },
    { title: '状态', key: 'status',dataIndex: 'status', render: (text, record) => <span><Badge status={text === 0 ? 'success' : 'error'} />{text === 0 ? '正常' : '关闭'}</span> },
    { title: '业务员/联系电话', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: () => (
        <span >
            <a href="#"  className="margin-right">编辑</a>
            <a href="#"  >删除</a>
          </span>
      ),
    },
  ];

  const expandedRowRender = (expanded,record) => {

    if(typeof expanded === 'boolean'){
      if(expanded){
        loadChild(record)
      }
    }

    return (
      <Table
        {...childTable}
        columns={childColumns}
        pagination={false}

      />
    );
  };
 // expandedRowRender={ e=>expandedRowRender(record,e) }
  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 1750,}}
        className={styles.table}
        columns={columns}
        rowKey={record => record.id}
      />
    </div>

    //expandedRowRender 扩展行 配合 onExpand 避免 暴力加载问题
    //expandedRowRender={ expandedRowRender }
    //onExpand={expandedRowRender}
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onOffItem:PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
  childData:PropTypes.array,
  loadChild:PropTypes.func,
  childTable:PropTypes.object,
  onRepairPersonItem:PropTypes.func,
  onRepairRegionItem:PropTypes.func,
}

export default List
