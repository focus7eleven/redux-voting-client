import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  connect
} from 'react-redux';
import * as actionCreators from '../action_creators';
import PrepareContainer from './Prepare'

export const Client = React.createClass({
  mixins: [PureRenderMixin],

  // Render.
  render() {
    let content
    switch (this.props.stage) {
      case 'PREPARE_STAGE':
        content = <PrepareContainer></PrepareContainer>
        break
      default : 
        content = null
        break
    }

    return <div>
      <div>目标值为{this.props.targetValue}</div>
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
