import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
  connect
} from 'react-redux'
import * as actionCreators from '../action_creators'
import {
  Map,
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
import SvgIconFace from 'material-ui/svg-icons/action/face';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import _ from 'lodash'
import FontIcon from 'material-ui/FontIcon';


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

  // Render.

  renderPrepareStage(){
    const {
      stage,
      targetValue,
      clientId,
    } = this.props
    const readyPlayer = this.props.player.toList().filter(v => v.get('isReady'))
    return(
      <div className={styles.prepareStage}>
        <div className={styles.targetValue}>
          <div className={styles.targetValueLabel}>目标值为:</div>
          <div className={styles.targetValueBox}>
            <div className={styles.targetValueCard}>2</div>
            <div className={styles.targetValueCard}>4</div>
          </div>
        </div>
        <div className={styles.prepareStageContainer}>
          <div className={styles.content}>
          {
            this.props.player.toList().map( item => {
              return (
                <div className={styles.box}>
                  <Chip
                    style={{height:'50px',borderRadius:'50px'}}
                    labelStyle={{fontSize:'20px',lineHeight:'50px',textOverflow:'ellipsis'}}
                  >
                  <Avatar color="#444" style={{width:'50px',height:'50px'}}  icon={<SvgIconFace style={{height:'40px',width:'40px'}}/>} />
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
          <div className={styles.footer}>

          </div>
          </div>
      </div>
    )
  },

  renderPlayingStage(){
    const {
      stage,
      targetValue,
      clientId,
    } = this.props
    const readyPlayer = this.props.player.toList().filter(v => v.get('isReady'))
    return (
      <div className={styles.playingStage}>
        <List className={styles.tipsList}>
          <Subheader>线索表</Subheader>
          <ListItem
            primaryText="Profile photo"
            secondaryText="Change your Google+ profile photo"
          />
          <ListItem
            primaryText="Profile photo"
            secondaryText="Change your Google+ profile photo"
          />
          <ListItem
            primaryText="Profile photo"
            secondaryText="Change your Google+ profile photo"
          />
          <ListItem
            primaryText="Profile photo"
            secondaryText="Change your Google+ profile photo"
          />
          <ListItem
            primaryText="Profile photo"
            secondaryText="Change your Google+ profile photo"
          />
        </List>

        {/*<div>
          {readyPlayer.map((player, key) => {
            return <div key={key}>
              {player.get('name')}:
              <div>
                {
                  player.get('elements').map((ele, key) => <span key={key} style={ele.get('source') === clientId?{color: 'red'}:{}}>
                    {ele.get('value')}
                  </span>)
                }
              </div>
            </div>
          })}
        </div>*/}
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

    return <div className={styles.management}>
      {this.renderContent()}
      {/*<div className="management">
        <button>准备阶段</button>
      </div>*/}
    </div>;
  }
});

function mapStateToProps(state) {
  return {
    stage: state.get('stage'),
    targetValue: state.get('targetValue'),
    player: state.get('player') || Map(),
    clientId: state.get('clientId'),
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(Management);
