import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'

import { Form, Button, Row, Col, } from 'antd'

const Filter = ({
  onAdd,
}) => {

  return (
    <div>
      <Row  gutter={24} align={"middle"}>


        <Col  xs={{span: 2}}
              sm={{span: 2}}
              xl={{ span: 6 }}
              md={{ span: 6 }}
              style={{paddingLeft:10,paddingTop:0,marginBottom:5}}>
          <Button icon={"plus"} className="margin-right"   style={{ background: 'rgb(89, 205, 33)' ,color:"rgb(255, 255, 255)" }} onClick={onAdd}>  增加</Button>
        </Col>
      </Row>

    </div>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
}

export default Form.create()(Filter)
