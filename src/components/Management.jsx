import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
  connect
} from 'react-redux'
import * as actionCreators from '../action_creators'
import {
  Map,
  fromJS,
} from 'immutable'
import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {
  List,
  ListItem
} from 'material-ui/List'
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader'
import SvgIcon from 'material-ui/SvgIcon'
import styles from './Management.scss'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import SvgIconFace from 'material-ui/svg-icons/action/face';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import TimerMixin from 'react-timer-mixin'
import _ from 'lodash'
import FontIcon from 'material-ui/FontIcon';
import Ticker from './Ticker'

const offline = (props)=>{
  return (
    <SvgIcon {...props} fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </SvgIcon>
  )
}

const online = (props)=>{
  return (
    <SvgIcon {...props} fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </SvgIcon>
  )
}

const lockOn = (props) => {
  return (<SvgIcon {...props} fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
</SvgIcon>)
}

const lockOff = (props) => {
  return (<SvgIcon {...props} fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
  </SvgIcon>)
}

const money = (props) => {
  return (
    <SvgIcon {...props} fill="#6069e5" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
      <path d="M0 0h24v24H0z" fill="#6069e5"/>
    </SvgIcon>
  )
}

const done = (props) => {
  return (
    <svg {...props} fill="#6069e5" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
    </svg>
  )
}

export const Management = React.createClass({
  mixins: [PureRenderMixin],
  getInitialState() {
    return {
      countDown: 0,
    }
  },

  getDefaultProps(){
    return {
      tipList: fromJS([{
        name: "Kdot1",
        tip: "test",
      },{
        name: "Kdot2",
        tip: "test",
      },{
        name: "Kdot3",
        tip: "test",
      },{
        name: "Kdot4",
        tip: "test",
      },{
        name: "Kdot5",
        tip: "test",
      },{
        name: "Kdot6",
        tip: "test",
      },{
        name: "Kdot7",
        tip: "test",
      },{
        name: "Kdot8",
        tip: "test",
      },{
        name: "Kdot9",
        tip: "test",
      },{
        name: "Kdot10",
        tip: "test",
      },{
        name: "Kdot11",
        tip: "test",
      },{
        name: "Kdot12",
        tip: "test",
      },{
        name: "Kdot13",
        tip: "test",
      },{
        name: "Kdot14",
        tip: "test",
      },{
        name: "Kdot15",
        tip: "test",
      }])
    }
  },

  componentWillReceiveProps(nextProps) {
    if ((this.props.stage === 'PREPARE_STAGE' || !this.props.stage) && nextProps.stage === 'PLAYING_STAGE') {
      this._startCountDown(nextProps)
    }
  },
  _startCountDown(props) {
    const game = props.game
    const initialCountDown = ~~(game.get('startTime') / 1000) + game.get('totalTime') - ~~(Date.now() / 1000)
    this.setState({
      countDown: initialCountDown,
    })
    TimerMixin.setInterval(() => {
      this.setState({
        countDown: Math.max(this.state.countDown - 1, 0),
      })
    }, 1000)
  },

  handleStartGame(){
    this.props.startGame();
  },

  // Render.
  renderPrepareStage(){
    const {
      stage,
      targetValue,
      clientId,
    } = this.props
    const readyPlayer = this.props.player.toList().filter(v => v.get('isReady'))
    return(
      <div className={styles.content}>
      {
        this.props.player.toList().map( (item,key) => {
          return (
            <div className={styles.box} key={key}>
              <Chip
                style={{height:'25px'}}
                labelStyle={{fontSize:'14px',lineHeight:'25px',textOverflow:'ellipsis'}}
              >
              <Avatar color="#444" style={{width:'25px',height:'25px'}}  icon={<SvgIconFace style={{height:'20px',width:'20px'}}/>} />
              {
                item.get('name')
              }
              </Chip>
              <span className={styles.state}>
              {
                item.get('isReady')?<span className={styles.item} style={{color:'#6069e5'}}>{done()}已准备</span>:<span className={styles.item} style={{color:'#cccccc'}}>准备中...</span>
              }
              </span>
            </div>
          )
        })
      }
      </div>
    )
  },

  renderPlayingStage(){
    const {
      stage,
      targetValue,
      clientId,
      tipList,
    } = this.props
    const readyPlayer = this.props.player.toList().filter(v => v.get('isReady'))
    return (
      <div className={styles.tipContent}>
        {/* <div className={styles.shadeCover}></div> */}
        <div className={styles.tipContainer}>
          {
            tipList.map((item,index)=>{
              return (
                <div style={{animationDelay: index*(tipList.size/15)+'s'}} key={index} className={styles.tip}>
                  <Chip
                    style={{height:'25px'}}
                    labelStyle={{fontSize:'14px',lineHeight:'25px',textOverflow:'ellipsis'}}
                  >
                  <Avatar color="#444" style={{width:'25px',height:'25px'}}  icon={<SvgIconFace style={{height:'20px',width:'20px'}}/>} />
                    {item.get('name')}
                  </Chip>
                  <span className={styles.tipDetail}>{item.get('tip')}</span>
                </div>
              )
            })
          }
        </div>
        {/* <div className={styles.shadeCoverBottom}></div> */}
      </div>
    )
  },

  renderContent() {
    const {
      stage,
      targetValue,
      clientId,
    } = this.props
    const readyPlayer = this.props.player.toList().filter(v => v.get('isReady'))
    switch (stage) {
      case 'PREPARE_STAGE':
        return this.renderPrepareStage()
      case 'PLAYING_STAGE':
        return this.renderPlayingStage()
      default:
        return null
    }
  },
  render() {
    console.log(this.props.stage);
    return <div className={styles.management}>
      <div className={styles.prepareStage}>
        <div className={styles.logo}>做一个有思想有远见的人</div>
        <div className={styles.targetValue}>
          <div className={styles.targetValueLabel}>目标值为:</div>
          <div className={styles.targetValueBox}>
            <div className={styles.targetValueCard}>2</div>
            <div className={styles.targetValueCard}>4</div>
          </div>
        </div>
        <div className={styles.prepareStageContainer}>
          {this.renderContent()}
          <div className={styles.footer} onTouchStart={this.handleStartGame} onClick={this.handleStartGame}>
            开始
          </div>
        </div>
        {/*<div className="management">
          <button>准备阶段</button>
        </div>*/}
      </div>
    </div>;
  }
});

function mapStateToProps(state) {
  return {
    stage: state.get('stage'),
    targetValue: state.get('targetValue'),
    player: state.get('player') || Map(),
    clientId: state.get('clientId'),
    game: state.get('game'),
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(Management);
