import React from 'react'

import { Provider, connect } from 'react-redux'

import shouldPureComponentUpdate from '../utils/pure-render'
import bindRules from '../utils/bind-rules'
import bindActions from '../utils/bind-actions'

import Game from './game'

@connect( _ => _ )
export default class App extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { game, hasUndo } = this.props
    const { dispatch } = this.props
    return (
      <div className='app-wrapper'>
        <Provider store={this.props.store}>
          <Game game={game} hasUndo={hasUndo}
                actions={bindActions( dispatch )}
                rules={bindRules( game )} />
        </Provider>
      </div>
    )
  }
}
