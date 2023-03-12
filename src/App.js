import React from 'react'
import model from './store/model'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { StoreProvider, createStore } from 'easy-peasy'
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import HomePage from './views/Home'
import Appoinment from './views/Appoinment'
import NotFoundPage from './views/NotFoundPage'
import Header from './views/Header'
import Footer from './views/Footer'

import 'antd/dist/antd.css';

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

const store = createStore(model)

const App = () => (
  <StoreProvider store={store}>

    <Helmet
      titleTemplate="%s - Doctor Appoinment"
      defaultTitle="Doctor Appoinment"
    >
      <meta name="description" content="This is app for appointing doctors online" />
    </Helmet>
    <BrowserRouter>
      <Header />
      <AppWrapper>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/appoinment" component={Appoinment} />
          <Route path="" component={NotFoundPage} />
        </Switch>
      </AppWrapper>
      <Footer />
    </BrowserRouter>
  </StoreProvider>
)

export default App
