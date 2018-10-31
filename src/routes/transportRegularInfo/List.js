import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button, Row } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import { Divider,Badge, } from 'antd';
import AuthButton from "../../components/AuthButton/AuthButton";
const confirm = Modal.confirm

const List = ({
  onDeleteItem, onEditItem, isMotion, location, updateRecordState, deleteRecord, editRecord, ...tableProps
}) => {
  location.query = queryString.parse(location.search)
  const stopStatusClick = (record, e) => {
    e.preventDefault()
    confirm({
      title: '确认暂停？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        updateRecordState(record)
      },
    })

  }
  const startStatusClick = (record, e) => {
    e.preventDefault()

    confirm({
      title: '确认开启？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        updateRecordState(record)
      },
    })
  }
  const deleteClick = (record, e) => {
    e.preventDefault()
    confirm({
      title: '确认删除这条记录？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        deleteRecord(record)
      },
    })

  }
  const editClick = (record, e) => {
    e.preventDefault()
    editRecord(record)
  }


  const columns = [
    {
      title: '起始地',
      dataIndex: 'startCity',
      key: 'startCity',
      width: 100,
    }, {
      title: '目的地',
      dataIndex: 'destinationCity',
      key: 'destinationCity',
      width: 100,
    }, {
      title: '运输类型',
      dataIndex: 'transportTypeName',
      key: 'transportTypeName',
      width: 100,
    },{
      title: '计费方式',
      dataIndex: 'billType',
      key: 'billType',
      width: 100,
      render: (text, record) => <span>{record.billType === 3 ? '阶梯价格' : '区间价格'}</span>,
    }, {
      title: '计费规则',
      dataIndex: 'rule',
      key: 'rule',

    }, {
      title: '优先级',
      dataIndex: 'priorityLevel',
      key: 'priorityLevel',
      width: 100,
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => <span><Badge status={text === 0 ? 'success' : 'error'} />{text === 0 ? '正常' : '暂停'}</span>,
    }, {
      title: '操作',
      key: 'operation',
      width: 200,
      render: (text, record) => (
        <span className={styles.operation}>
           <AuthButton child={[ <a href="#" onClick={e => editClick(record, e)}>编辑</a>,
           <Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />]} resourceId={'RES_2_154'} />
          {record.status === 0 ?  <AuthButton child={[ <a href="#"onClick={e => stopStatusClick(record, e)}>暂停</a>,
            <Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />]} resourceId={'RES_2_155'} /> :<AuthButton child={[  <a href="#" onClick={e => startStatusClick(record, e)}>开启</a>,
            <Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />]} resourceId={'RES_2_156'} /> }
          <AuthButton child={[  <a href="#" onClick={e => deleteClick(record, e)}>删除</a>]} resourceId={'RES_2_157'} />
        </span>
      )
      /*render: (text, record) => {

        return (
          <Button.Group>
            <Button size="small" onClick={e => editClick(record, e)}>编辑</Button>
            {record.status === 0 ? <Button size="small" onClick={e => stopStatusClick(record, e)}>暂停</Button> : <Button size="small" onClick={e => startStatusClick(record, e)}>开启</Button>}
            <Button size="small" onClick={e => deleteClick(record, e)}>删除</Button>
          </Button.Group>)
        // return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />
      },*/
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  return (
    <Table
      {...tableProps}
      className={styles.table}
      columns={columns}
      rowKey={record => record.id}
    />
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  updateRecordState: PropTypes.func,
  deleteRecord: PropTypes.func,
  editRecord: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
