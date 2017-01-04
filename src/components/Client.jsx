import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
  connect
} from 'react-redux'
import * as actionCreators from '../action_creators'
import PrepareContainer from './Prepare'
import PlayingContainer from './Playing'
import AppBar from 'material-ui/AppBar'

export const Client = React.createClass({
  mixins: [PureRenderMixin],

  // Render.
  render() {
    let content
    switch (this.props.stage) {
      case 'PREPARE_STAGE':
        content = <PrepareContainer></PrepareContainer>
        break
      case 'PLAYING_STAGE':
        content = <PlayingContainer></PlayingContainer>
        break
      default : 
        content = null
        break
    }

    return <div>
      <AppBar 
        title={`目标值为 ${this.props.targetValue}`}
        showMenuIconButton={false}
      />
      {content}
    </div>;
  }
});

function mapStateToProps(state) {
  return {
    stage: state.get('stage'),
    targetValue: state.get('targetValue'),
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(Client);
