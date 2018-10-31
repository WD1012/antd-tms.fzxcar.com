import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import { Divider } from 'antd';
const confirm = Modal.confirm

const List = ({
  onDeleteItem, onEditItem, location, ...tableProps,onResetPassWord
}) => {
  location.query = queryString.parse(location.search)

  const {pagination} = tableProps

  const {current,pageSize} = pagination;


  const del = (record, e) =>{
    e.preventDefault()
    const realName = record.realName
    confirm({
      title: '确认删除用户：' + realName + ' ？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onDeleteItem(record.id,'admin',e)
      },
    })
  }

  const resetPassWord = (record, e) =>{
    e.preventDefault()
    const username = record.username
    confirm({
      title: '确认重置用户：' + record.realName + ' 密码？',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        onResetPassWord(username)
      },
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'passFlag',
      key: 'passFlag',
      render: (text, record, index,) => {
        return <div>{ pageSize * (current-1) + index + 1}</div>
      },
      width: 100,
    }, {
      title: '手机号',
      dataIndex: 'username',
      key: 'username',
      width: 200,
    }, {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
      width: 200,
    }, {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 200,
    }, {
      title: '操作',
      key: 'operation',
      width: 150,
      render: (text, record) => (
        <span className={styles.operation}>
          <a href="#" onClick={e => onEditItem(record, e)}>编辑</a>
          <Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />
          <a href="#" onClick={e => resetPassWord(record, e)}>重置密码</a>
          {/*
          <Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />
          <a href="#" onClick={e => del(record, e)}>删除</a>
          */}
        </span>
      ),
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        rowKey={record => record.index}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
  onResetPassWord:PropTypes.func,

}

export default List
