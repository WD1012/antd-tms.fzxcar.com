import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import { Divider,Badge } from 'antd';
import AuthButton from "../../components/AuthButton/AuthButton";
const confirm = Modal.confirm
import accounting from 'utils/accounting'

const List = ({
  onDeleteItem, onEditItem, isMotion, location, ...tableProps,
                editClick,
                pauseClick,
                startClick,
                deleteClick,
}) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      Modal.warning({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }
  const editBtnClick = (record, e) => {
    e.preventDefault()
    onEditItem(record);
  }
  const pauseBtnClick = (record, e) => {
    e.preventDefault()


    confirm({
      title: '确定暂停这条记录?',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        pauseClick(record)
      },
    })
  }
  const startBtnClick = (record, e) => {
    e.preventDefault()

    confirm({
      title: '确定开启这条记录?',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        startClick(record)
      },
    })
  }
  const deleteBtnClick = (record, e) => {
    e.preventDefault()

    confirm({
      title: '确定删除这条记录?',
      okText:`确定`,
      cancelText:`取消`,
      onOk () {
        deleteClick(record)
      },
    })
  }
  const columns = [
    {
      title: '起始地',
      dataIndex: 'startProvince',
      key: 'startProvince',
      width: 300,
      render: (text, record) => {
        return `${record.startProvince}-${record.startCity}${record.startRegion?'-'+record.startRegion:''}`
      },
    }, {
      title: '目的地',
      dataIndex: 'destinationProvince',
      key: 'destinationProvince',
      width: 300,
      render: (text, record) => {
        return `${record.destinationProvince}-${record.destinationCity}${record.destinationRegion?'-'+record.destinationRegion:''}`
      },
    }, {
      title: '运输类型',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text, record) => <span>{record.transportTypeId === 1 ? '大板' : record.transportTypeId === 2?'救援':'代驾'}</span>,
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text, record) => <span><Badge status={record.status === 0 ? 'success' : 'error'} />{record.status === 0 ? '正常' : '暂停'}</span>,
    }, {
      title: '运价(单位:元)',
      dataIndex: 'fixedRate',
      key: 'fixedRate',
      width: 130,
      render: (text, record) => <span >{accounting.formatMoney(text) }</span>
    },{
      title: '优先级',
      dataIndex: 'priorityLevel',
      key: 'priorityLevel',
      width: 100,
    },{
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span className={styles.operation}>
             <AuthButton child={[ <a href="#" onClick={e => editBtnClick(record, e)}>编辑</a>,<Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />]} resourceId={'RES_2_148'} />
            {record.status === 0 ?<AuthButton child={[ <a href="#"  onClick={e => pauseBtnClick(record, e)}>暂停</a> ,<Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />]} resourceId={'RES_2_149'} />
              :<AuthButton child={[ <a href="#"  onClick={e => startBtnClick(record, e)}>启动</a> ,<Divider type="vertical" style={{background: 'rgb(211, 211, 211)' }} />]} resourceId={'RES_2_150'} />}
            <AuthButton child={ <a href="#" onClick={e => deleteBtnClick(record, e)}>删除</a>} resourceId={'RES_2_151'} />
          </span>
          )
      },
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={styles.table}
        bordered
        columns={columns}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  editClick: PropTypes.func,
  pauseClick: PropTypes.func,
  startClick: PropTypes.func,
  deleteClick: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
