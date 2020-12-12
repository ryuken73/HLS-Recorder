import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ItemCardList from '../components/ItemCardList';
import * as cardListActions from '../modules/itemCardList';

function mapStateToProps(state, ownProps) {
  console.log(state)
  return {
    cardItems: state.itemCardList.cardItems
  }
}

function mapDispatchToProps(dispatch) {
  return {CardListActions: bindActionCreators(cardListActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemCardList);