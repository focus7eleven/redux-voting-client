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

const inlineStyles = {
  chip: {
    borderRadius:30,

    labelStyle:{
      fontSize:'30px',
      lineHeight:'30px',
      padding:'15px',
    }
  },
  paper:{
    height:'300px',
    width:'600px',
    padding:'20px',
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-around',
    borderRadius:'5px',
    margin:'5px',
    divider:{
      marginLeft:0,
      marginTop:0,
    },
    chip: {
      borderRadius:30,

      labelStyle:{
        fontSize:'30px',
        lineHeight:'30px',
        padding:'15px',
      }
    }
  },
  unready:{
    boxShadow:'0 1px 6px rgba(255, 0, 0, 0.35), 0 1px 4px rgba(255, 0, 0, 0.47)'
  },
  ready:{
    boxShadow:'0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.12)'
  },
  button:{
    margin: 12,
  },
  buttonStyle:{
    height:'70px',
    overlayStyle:{
      height:'70px'
    },
    labelStyle:{
      height:'70px',
      fontSize:'40px',
      lineHeight:'70px',
    }
  },
  list:{
    padding:'12px'
  },
  listItem:{
    backgroundColor:'rgba(0,	179,	206,	.5)',
  },
  innerDivStyle:{
    fontSize:'30px',
    lineHeight:'30px',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  subheader:{
    paddingLeft:'0',
  }
};

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
    <SvgIcon {...props} fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </SvgIcon>
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
      <div style={{height:'100%',width:'100%',padding:'20px'}} className={styles.prepareStage}>
        <div className={styles.cardContainer} style={{display:'flex'}}>
        {
          this.props.player.map( (v,key) => {
            if(v.get('isReady')){
              return (
                <Paper key={key} style={_.extend({},inlineStyles.paper,inlineStyles.ready)} zDepth={1}>
                  <Chip
                  style={inlineStyles.paper.chip}
                  labelStyle={inlineStyles.paper.chip.labelStyle}
                  >
                    <Avatar color="#444" style={{height:'60px',width:'60px'}} icon={<SvgIconFace style={{width:'50px',height:'50px'}}/>} />
                    {v.get('name')}
                  </Chip>
                  <Divider style={inlineStyles.paper.divider} inset={true} />
                  <span style={{fontSize:'25px',display:'flex',alignItems:'center'}}>{lockOn()}已准备</span>
                </Paper>
              )
            }else{
              return (
                <Paper key={key} style={_.extend({},inlineStyles.paper,inlineStyles.unready)} zDepth={1}>
                  <Chip
                  style={inlineStyles.paper.chip}
                  labelStyle={inlineStyles.paper.chip.labelStyle}
                  >
                    <Avatar color="#444" style={{height:'60px',width:'60px'}} icon={<SvgIconFace style={{width:'50px',height:'50px'}}/>} />
                    {v.get('name')}
                  </Chip>
                  <Divider style={inlineStyles.paper.divider} inset={true} />
                  <span style={{fontSize:'25px',display:'flex',alignItems:'center'}}>{lockOff()}未准备</span>
                </Paper>
              )
            }
          })
        }
        </div>
        <div>
          {readyPlayer.size?<RaisedButton label="Primary" primary={true} onClick={this.props.startGame} style={inlineStyles.button} overlayStyle={inlineStyles.buttonStyle.overlayStyle} buttonStyle={inlineStyles.buttonStyle} labelStyle={inlineStyles.buttonStyle.labelStyle}/>:null}
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
      <Chip
        style={inlineStyles.chip}
        className={styles.targetValue}
        labelStyle={inlineStyles.chip.labelStyle}
      >
        <Avatar color="#444" style={{height:'55px',width:'55px'}} icon={money({style:{width:'50px',height:'50px'}})} />
        目标值为{this.props.targetValue}
      </Chip>
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
