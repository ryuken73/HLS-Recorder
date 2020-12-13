import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Controls from '../components/HLSRecorder/Controls';
import * as hlsPlayersActions from '../modules/hlsPlayers';


function mapStateToProps(state, ownProps) {
  console.log('mapStateToProps:',state, ownProps) 
  const {channelNumber} = ownProps;
  const hlsPlayer = state.hlsPlayers.players.get(channelNumber);

  return {
    ...ownProps,
    source: hlsPlayer.source
  }
}

function mapDispatchToProps(dispatch) {
  return {HLSPlayerActions: bindActionCreators(hlsPlayersActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);