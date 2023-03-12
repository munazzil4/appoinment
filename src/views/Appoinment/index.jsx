import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet';
import uuid from 'uuid'
import _ from 'lodash';
import { useStoreState, useStoreActions } from 'easy-peasy';
// import PropTypes from 'prop-types'
//import { Calendar } from '@fullcalendar/core';
import { notification, Modal, Form, Input, Button, InputNumber, Select, Breadcrumb, Tooltip } from 'antd';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { HomeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment'
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import './styles.css'
import { Link, useHistory } from 'react-router-dom';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const { Option } = Select;


const Appoinment = () => {
  const history = useHistory();
  const setDialog = useStoreActions((state) => state.setDialog);
  const showDialog = useStoreState((state) => state.showDialog);
  const setdeleteDialog = useStoreActions((state) => state.setdeleteDialog);
  const showdeleteDialog = useStoreState((state) => state.showdeleteDialog);
  const currentDoctor = JSON.parse(localStorage.getItem('currentDoctor')) || []
  const alleventsItem = JSON.parse(localStorage.getItem('itemsArray')) || [];
  const [eventItems, seteventItems] = useState(alleventsItem.filter((item) => {
    return Object.keys(item).some((key) => item[key].includes(currentDoctor.name));
  }));
  const [submitAppoinment, setsubmitAppoinment] = useState([]);
  const [deleteAppoinment, setdeleteAppoinment] = useState([]);
  const formRef = React.createRef();

  useEffect(() => {
    if (currentDoctor.length === 0) {
      history.push("/");
    }
  });
  const onFinish = values => {
    console.log('Success:', values);
    formRef.current.resetFields();
    handleCreateAppoinment()
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 80 }}>
        <Option value="880">+880</Option>
      </Select>
    </Form.Item>
  );

  let resultArray = [];

  if (currentDoctor.availibility !== undefined || null) {
    //configuring data to work with fullcalendar business hours
    let availibility = currentDoctor.availibility
    let keysAvailibility = Object.keys(availibility);
    for (let j = 0; j < keysAvailibility.length; j++) {
      let key = keysAvailibility[j];
      let value = availibility[key];
      delete availibility[key];
      key = key.replace("sun", 0);
      key = key.replace("mon", 1);
      key = key.replace("tue", 2);
      key = key.replace("wed", 3);
      key = key.replace("thu", 4);
      key = key.replace("fri", 5);
      key = key.replace("sat", 6);
      availibility[key] = value;
    }
    let arr = []
    for (let x in availibility) {
      let dateV = x;
      let startTime = moment((availibility[x]).slice(0, 8), ["h:mm A"]).format("HH:mm");
      let endTime = moment((availibility[x]).slice(11, 19), ["h:mm A"]).format("HH:mm");
      arr.push([dateV], startTime, endTime)
    }
    let values = _.chunk(arr, 3);
    let keys = ["daysOfWeek", "startTime", "endTime"];
    if (values) {
      for (let i = 0; i < values.length; i++) {
        let obj = {};
        for (let j = 0; j < keys.length; j++) {
          obj[keys[j]] = values[i][j];
        }
        resultArray.push(obj);
      }
    }
  }
  //console.log(resultArray)

  function onEventClick(event, element) {
    //console.log(event)
    setdeleteDialog()
    setdeleteAppoinment(event)
  }
  function handleDeleteAppoinment() {
    var items = JSON.parse(localStorage.getItem('itemsArray')) || [];
    var newItems = items.filter(item => item.id !== deleteAppoinment.event.id);
    localStorage.setItem('itemsArray', JSON.stringify(newItems));
    seteventItems(JSON.parse(localStorage.getItem('itemsArray')) || []);
    setdeleteDialog()
  }


  //console.log(submitAppoinment);

  const openNotificationWithIcon = type => {
    notification[type]({
      message: 'Error',
      description:
        'You cannot book an appoinment in the past',
    });
  };
  function handleAppoinment(start, end, jsEvent, view) {
    if (moment(start.start).isAfter()) {
      setsubmitAppoinment(start)
      setDialog()

    } else {
      openNotificationWithIcon('error')
    }
  }
  const handleDateClick = arg => {

    //console.log(arg.dateStr);
  };
  function handleCreateAppoinment() {
    let oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];
    let newItem = {
      'title': 'Appointed',
      'start': submitAppoinment.start.toISOString(),
      'end': submitAppoinment.end.toISOString(),
      'id': uuid.v4(),
      'name': currentDoctor.name
    };
    oldItems.push(newItem);
    localStorage.setItem('itemsArray', JSON.stringify(oldItems));
    //console.log(currentDoctor.name)
    seteventItems(JSON.parse(localStorage.getItem('itemsArray')).filter((item) => {
      return Object.keys(item).some((key) => item[key].includes(currentDoctor.name));
    }) || []);
    setDialog()
  };

  return (
    <div className="mainDiv">
      <Helmet>
        <title>Appoinment</title>
        <meta
          name="description"
          content="Make an appoinment"
        />
      </Helmet>
      <div className="breadCrumbView">
        <Breadcrumb>
          <Breadcrumb.Item >
            <Link to="/">
              <HomeOutlined /> Home
            </Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Application</Breadcrumb.Item>
        </Breadcrumb>,
      </div>
      <div className="appointDocDetails" style={{ marginBottom: "25px", marginTop: "10px" }}>
        <div>
          <span style={{ fontSize: "20px", fontWeight: "500" }}>Schedule of {currentDoctor.name}</span>
        </div>
        <div>
          <span>Visit duration: {currentDoctor.visitDurationInMin} mins</span>
          <span style={{ float: "right", fontSize: "20px" }}>
            <Tooltip title="Click on white row in calendar to book an appoinment. To delete , click on booked appointment">
              <QuestionCircleOutlined /> Help
              </Tooltip>
        </span>
        </div>

      </div>
      <div className="calendarDiv" >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          eventClick={onEventClick}
          dateClick={handleDateClick}
          header={{
            right: "prev,next",
            center: "title",
            left: "dayGridMonth,timeGridWeek,listWeek"
          }}
          slotDuration='00:15:00'
          slotLabelInterval='00:05:00'
          selectLongPressDelay='25'
          minTime="06:00:00"
          maxTime="24:00:00"
          contentHeight="auto"
          allDaySlot={false}
          selectable={true}
          initialView="timeGridWeek"
          defaultView={'timeGridWeek'}
          editable={true}
          businessHours={resultArray}
          events={eventItems}
          //displayEventTime={false}
          selectConstraint={resultArray}
          eventResize={false}
          eventDurationEditable={false}
          eventStartEditable={false}
          select={handleAppoinment}

        />
      </div>
      <Modal
        title="Add Information"
        visible={showDialog}
        onCancel={() => setDialog()}
        okButtonProps={{ form: 'category-editor-form', key: 'submit', htmlType: 'submit' }}
        width="50%"
        okText="Submit"
      >
        <Form
          {...layout}
          id='category-editor-form'
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ref={formRef}
          initialValues={{
            prefix: '880',
          }}
        >
          <Form.Item
            label="Name"
            name="clientName"
            placeholder="Input your name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
            <Select
              placeholder="Select your Gender"
              allowClear
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            placeholder="Input your age (1-99)"
            rules={[{ required: true, type: 'number', min: 0, max: 99, message: 'Please input your age (1-99)!' }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            placeholder="Input your phone number"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            placeholder="Input your email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Visit Reason"
            name="visitReason"
            placeholder="Enter visit reason (optional)"
            rules={[{ required: false }]}
          >
            <Input.TextArea />
          </Form.Item>

        </Form>
      </Modal>
      <Modal
        title="Delete Appoinment"
        visible={showdeleteDialog}
        okText="Yes"
        cancelText="No"
        footer={[
          <Button key="back" onClick={() => setdeleteDialog()}>
            No
          </Button>,
          <Button key="submit" type="danger" onClick={() => handleDeleteAppoinment()}>
            Yes
          </Button>,
        ]}
      >
        <span>Are you sure you want to delete this appoinment?</span>
      </Modal>
    </div>
  )
}

// Appoinment.propTypes = {
//   todo: PropTypes.object.isRequired
// }

export default Appoinment
