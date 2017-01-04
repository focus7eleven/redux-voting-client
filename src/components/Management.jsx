import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {
  connect
} from 'react-redux'
import * as actionCreators from '../action_creators'
import {
  Map,
} from 'immutable'
import {
  List,
  ListItem
} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import styles from './Management.scss'

export const Management = React.createClass({
  mixins: [PureRenderMixin],

  // Render.
  renderContent() {
    const {
      stage,
      targetValue,
      clientId,
    } = this.props
    const readyPlayer = this.props.player.toList().filter(v => v.get('isReady'))

    switch (stage) {
      case 'PREPARE_STAGE':
        return <div>
          <p>目标值为{targetValue}</p>          
          <div>
            参与人员：
            {readyPlayer.map((player, key) => {
              return <div key={key}>{player.get('name')}</div>
            })}
          </div>
          {readyPlayer.size?<button style={{color: 'black'}} onClick={this.props.startGame}>开始</button>:null}
        </div>
      case 'PLAYING_STAGE':
        return <div className={styles.playingStage}>
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
      default:
        return null
    }
  },
  render() {
    return <div className="results">
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
