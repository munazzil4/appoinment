import React from 'react'
import { Helmet } from 'react-helmet';
// import { useStoreActions } from 'easy-peasy'
// import PropTypes from 'prop-types'

import './styles.css'

const NotFoundPage = () => {

  return (
    <div className="mainDiv">
      <Helmet>
        <title>404</title>
        <meta
          name="description"
          content="This is a 404 page"
        />
      </Helmet>
      Welcome NotFoundPage
    </div>
  )
}

// NotFoundPage.propTypes = {
//   todo: PropTypes.object.isRequired
// }

export default NotFoundPage
