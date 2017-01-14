import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
  Map
} from 'immutable'
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

const AVERAGE_COUNT = 4

export const Client = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    this.props.joinGame()

    if (this.props.viewer && !this.props.result && this.props.viewer.get('value') == this.props.targetValue) {
      this.props.signalComplete(Date.now())
    }
  },
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.viewer &&  this.props.viewer && !this.props.result && nextProps.viewer.get('value') == this.props.targetValue) {
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
    if (!!this.props.result) {
      // 分配奖金
      let redpackCount = 0
      const rankList = this.props.results.map((v, k) => Map({
        assistantCount: this.props.player.delete(k).reduce((reduction, player) => player.get('elements').some(v => v.get('source') === k) ? reduction + 1 : reduction, 0),
        time: v.get('timestamp') - this.props.game.get('startTime'),
        clientId: k,
      })).toList().map(v => v.set('score', -v.get('time') + v.get('assistantCount') * 20000)).sort((a, b) => b.get('score') - a.get('score'))
      const rank = rankList.findIndex(v => v.get('clientId') === this.props.clientId)

      const x = ~~(this.props.player.size * 0.3)
      if(this.props.player.size < 3) {
        redpackCount = AVERAGE_COUNT
      } else if(rank < x) {
        redpackCount = AVERAGE_COUNT + 1
      } else if(rank >= this.props.player.size - x) {
        redpackCount = AVERAGE_COUNT - 1
      } else {
        redpackCount = AVERAGE_COUNT
      }
      const isAllComplete = this.props.player.size  === this.props.results.size
      const originalElement = this.props.viewer.get('elements').find(v => !!v.get('tip'))

      content = <div className={styles.cong}>
        <div>恭喜!</div>
        <div style={{fontSize: 20}}>{this.props.viewer.get('name')}</div>
        <div style={{fontSize: 12, color: "#d1d1d1"}}>{originalElement.get('code')} - {originalElement.get('value')}</div>
        <div style={{marginTop: 30}}>在 {~~((this.props.result.get('timestamp') - this.props.game.get('startTime')) / 1000)}秒 内完成了游戏</div>
        <div>并帮助了 {this.props.otherPlayer.reduce((reduction, player) => player.get('elements').some(v => v.get('source') === this.props.clientId) ? reduction + 1 : reduction , 0)} 人</div>
        {!isAllComplete?<div>当所有人完成后预计获得 <span style={{color: "#b71122"}}>{redpackCount}个红包!</span></div>:<div>最终获得了 <span style={{color: "#b71122"}}>{redpackCount}个红包!</span></div>}
      </div>
    }

    return <div className={styles.container}>
        <div>
          {/*
            <svg fill="#ffffff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
            <marquee className={styles.notification} behavior="scroll" direction="left">长痔疮的东哥时至运来，获得了【特典】皮肤，真是羡煞旁人！</marquee>
          */}
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
    result: state.getIn(['result', clientId]),
    results: state.getIn(['result']),
    otherPlayer: state.get('player', Map()).delete(clientId),
    player: state.get('player'),
    game: state.get('game'),
    clientId,
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(Client);