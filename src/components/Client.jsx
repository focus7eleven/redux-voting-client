import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
  connect
} from 'react-redux'
import * as actionCreators from '../action_creators'
import PrepareContainer from './Prepare'
import styles from './Client.scss'
import Paper from 'material-ui/Paper';

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

    return <div className={styles.container}>
      <div>
        <Paper className={styles.targetValueContainer} zDepth={3} circle={true} >{this.props.targetValue}</Paper>
      </div>
      {/* <div className={styles.targetValue}>目标值为：{this.props.targetValue}</div> */}
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
