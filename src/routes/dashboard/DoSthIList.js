import React from 'react'
import PropTypes from 'prop-types'
import { Table,  } from 'antd'
import { Badge } from 'antd';
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import styles from './List.less'
const DoSthIList = ({
                 ...tableProps
              }) => {

  const columns = [
    {
      title: '提醒时间',
      dataIndex: 'remindTime',
      key: 'remindTime',
      width:50,
    }, {
      title: '事件',
      dataIndex: 'destination',
      key: 'destination',
      width:300,
      render: (text, record) => (
        <span >
          运单 <Link to={record.url}>{record.no}</Link>  ，{record.describe}
        </span>
      )
    },
  ]

  return (
    <div>

      <Table
        {...tableProps}
        columns={columns}
        simple
        size="small"
        pagination={false}
        className={styles.table}
      />
    </div>
  )
}

DoSthIList.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default DoSthIList
