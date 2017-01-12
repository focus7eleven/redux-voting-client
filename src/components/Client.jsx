import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
  connect
} from 'react-redux'
import * as actionCreators from '../action_creators'
import PrepareContainer from './Prepare'
import styles from './Client.scss'
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import PlayingContainer from './Playing'
import AppBar from 'material-ui/AppBar'
import {List, ListItem} from 'material-ui/List'

export const Client = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    this.props.joinGame()

    if (this.props.viewer && !this.props.isComplete && this.props.viewer.get('value') == this.props.targetValue) {
      this.props.signalComplete(Date.now())
    }
  },
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.viewer &&  this.props.viewer && !this.props.isComplete && nextProps.viewer.get('value') == this.props.targetValue) {
      this.props.signalComplete(Date.now())
    }
  },

  // Render.
  render() {
    if (!this.props.viewer) return null

    let content
    switch (this.props.stage) {
      case 'PREPARE_STAGE':
        content = <PrepareContainer></PrepareContainer>
        break
      case 'PLAYING_STAGE':
        content = <PlayingContainer viewer={this.props.viewer}></PlayingContainer>
        break
      default :
        content = null
        break
    }

    // Complete this game.
    if (this.props.viewer.get('value') == this.props.targetValue) {
      console.log(this.props)
      content = <div>
        <div>恭喜!</div>
        <List>
          <ListItem primaryText="1. hahahh 在30秒内完成了游戏，并帮助了3人。"/>
        </List>
      </div>
    }

    return <div className={styles.container}>
      <div>
        <svg fill="#ffffff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        <marquee className={styles.notification} behavior="scroll" direction="left">长痔疮的东哥时至运来，获得了【特典】皮肤，真是羡煞旁人！</marquee>
      </div>

      <div>
        <Paper className={styles.targetValueContainer} zDepth={3} circle={true}>
          <span>{this.props.targetValue}</span>
          <span>目标</span>
        </Paper>
        {
          this.props.stage == 'PLAYING_STAGE' ?
          <Paper className={styles.targetValueContainer} zDepth={3} circle={true}>
            <span>{this.props.viewer.get('value')}</span>
            <span>当前</span>
          </Paper>
          :
          null
        }
      </div>
      
      {content}
    </div>;
  }
});

function mapStateToProps(state) {
  const clientId = state.get('clientId')

  return {
    viewer: state.getIn(['player', clientId]),
    stage: state.get('stage'),
    targetValue: state.get('targetValue'),
    isComplete: !!state.getIn(['result', clientId]),
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(Client);
