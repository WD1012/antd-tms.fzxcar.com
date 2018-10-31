import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Divider } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'
import AuthButton from '../../components/AuthButton/AuthButton'

const confirm = Modal.confirm

const List = ({
  onDeleteItem, onEditItem, isMotion, location, ...tableProps
}) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '区域',
      dataIndex: 'regionName',
      key: 'regionName',
    }, {
      title: '所含省份',
      dataIndex: 'provinceName',
      key: 'provinceName',
      render: (text, record) => {
        let provinceNames = ''
        for (let item of record.provinceName) {
          provinceNames += `${item.provinceName},`
        }
        return provinceNames.substring(0, provinceNames.length - 1)
      },
    }, {
      title: '负责人',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => {
        let userNames = ''
        for (let item of record.userName) {
          userNames += `${item.userName},`
        }
        return userNames.substring(0, userNames.length - 1)
      },
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        // return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />
        return (<div className={styles.operation}>
          <AuthButton child={<a href="#" onClick={(e) => { onEditItem(e, record) }}>编辑</a>} resourceId="RES_2_170" />
          {/* <Divider type="vertical" /> */}
          {/* <a href="#" onClick={(e) => { onDeleteItem(e, record) }}>删除</a> */}
        </div>)
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = (body) => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <Table
      {...tableProps}
      className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
      bordered
      columns={columns}
      simple
      size="small"
      rowKey={record => record.regionId}
      getBodyWrapper={getBodyWrapper}
    />
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
