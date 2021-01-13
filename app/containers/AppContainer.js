// @flow
import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../components/App';
import * as appActions from '../modules/app';
import * as hlsRecorderActions from '../modules/hlsRecorders';

console.log('calling AppContainer')
function mapStateToProps(state, ownProps) {
  // console.log('mapStateToProps:',state) 
  const {sources} = state.app;
  return {
    ...ownProps,
    sources
  }
}

function mapDispatchToProps(dispatch) {
  return {
    AppActions: bindActionCreators(appActions, dispatch),
    HLSRecorderActions: bindActionCreators(hlsRecorderActions, dispatch)  
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
