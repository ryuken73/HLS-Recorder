import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ControlPanel from '../components/ControlPanel';
import * as controPanelActions from '../modules/controlPanel';

function mapStateToProps(state, ownProps) {
  console.log(state)
  return {
    saveDirectory: state.controlPanel.saveDirectory,
  }
}

function mapDispatchToProps(dispatch) {
  return {ControlPanelActions: bindActionCreators(controPanelActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);