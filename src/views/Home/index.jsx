import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { List, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
// import PropTypes from 'prop-types'

import './styles.css'
import avatarImage from '../../assets/avatar.png'
import { Link } from 'react-router-dom';


const Home = () => {
  const doctorsList = useStoreState(state => state.items)
  const submitAppoinment = useStoreActions(actions => actions.submitAppoinment)
  const fetchDoctors = useStoreActions(actions => actions.fetchDoctors)

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  // console.log(doctorsList)
  // console.log(selectedDoctor)



  return (
    <div className="mainDiv">
      <Helmet>
        <title>Home</title>
        <meta
          name="description"
          content="Welcome to Doctor Appoinment"
        />
      </Helmet>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 2,
        }}
        dataSource={doctorsList}
        footer={
          <div>
             Appoinment
      </div>
        }
        renderItem={item => (
          <List.Item
            key={item.name}
            extra={
              <img
                alt="logo"
                src={avatarImage}
              />
            }
          >
            <span className="doctorName">{item.name}</span> <br />
            <span>{item.org}</span> <br /> <br />
            Visiting Duration: {item.visitDurationInMin} <br /> <br /> <br />
            <div style={{marginBottom:"10px"}}></div>
            <Link to="/appoinment">
              <Button
                icon={<RightOutlined />}
                type="primary"
                onClick={() => { submitAppoinment(item) }}
              >
                Make an Appoinment
              </Button>
            </Link>
          </List.Item>
        )}
      />,

    </div>
  )
}

// Home.propTypes = {
//   todo: PropTypes.object.isRequired
// }

export default Home
