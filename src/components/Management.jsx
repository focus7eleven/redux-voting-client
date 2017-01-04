import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  connect
} from 'react-redux';
import * as actionCreators from '../action_creators';
import {
  Map,
} from 'immutable'
import Chip from 'material-ui/Chip';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './Management.scss'

const inlineStyles = {
  chip: {
    margin: 4,
  },
  button:{
   margin: 12,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

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
      <div>
        <Chip
          style={inlineStyles.chip}
        >
          目标值为{targetValue}
        </Chip>
        <div>
          <Table>
            <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            >
              <TableRow>
                <TableHeaderColumn>昵称</TableHeaderColumn>
                <TableHeaderColumn>联系方式</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
            displayRowCheckbox={false}
            >
            {
              readyPlayer.map( (v,key) => (
                <TableRow key={key}>
                  <TableRowColumn>{v.get('name')}</TableRowColumn>
                  <TableRowColumn>{v.get('phone')}</TableRowColumn>
                </TableRow>
              ))
            }
            </TableBody>
          </Table>
        </div>
        <div>
          {readyPlayer.size?<RaisedButton label="Primary" primary={true} style={inlineStyles.button} />:null}
        </div>
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
        return <div>
          <p>目标值为{targetValue}</p>
          <div>
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
          </div>
        </div>
      default:
        return null
    }
  },
  render() {
    return <div className="results">
      {this.renderContent()}
      <div className="management">
        <button>准备阶段</button>
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
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(Management);
