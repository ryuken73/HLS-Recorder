// @flow
import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../components/App';
import * as appActions from '../modules/app';


function mapStateToProps(state, ownProps) {
  // console.log('mapStateToProps:',state) 
  return {
    ...ownProps,
    sources: state.app.sources
  }
}

function mapDispatchToProps(dispatch) {
  return {AppActions: bindActionCreators(appActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

// export default class App extends React.Component<Props> {

//   render() {
//     const { children } = this.props;
//     return <>{children}</>;
//   }
// }
