// @flow
import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReloadConfirm from '../components/ReloadConfirm';
import * as statisticsActions from '../modules/statistics';

function mapStateToProps(state, ownProps) {
  // console.log('mapStateToProps:',state) 
  return {
    ...ownProps
  }
}

function mapDispatchToProps(dispatch) {
  return {
    StatisticsActions: bindActionCreators(statisticsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReloadConfirm);
