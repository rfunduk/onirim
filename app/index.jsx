import React from 'react'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'

import { devTools, persistState } from 'redux-devtools'
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'

import compact from 'lodash/array/compact'

import log from './utils/log'
import bindRules from './utils/bind-rules'
import bindActions from './utils/bind-actions'
import shouldPureComponentUpdate from './utils/pure-render'

import { newGame } from './lib/updates'
import { devGame } from './lib/setup'
import Game from './components/game'

// load fake randomization hack so that shuffling
// doesn't break redux devtools time travelling
// and we get the same game every time
if( __DEV__ ) {
  // set a seed if you want a different set of shuffles
  const SEED = 0
  const fakeRandom = require( './utils/fake-random' )
  fakeRandom( SEED )
}

function oneStepUndo( reducer ) {
  let lastState = null
  let usedUndo = false
  return ( state, action ) => {
    if( lastState && !usedUndo && action.type == 'UNDO' ) {
      const nextState = lastState
      lastState = null
      usedUndo = true
      return { ...nextState,
               hasUndo: false }
    }
    else {
      lastState = state
      if( action.type == 'NEW_GAME' ) {
        // give a new todo when starting a new game
        usedUndo = false
        lastState = null
      }
      return { ...reducer( state, action ),
               hasUndo: lastState && !usedUndo }
    }
  }
}

function createReducer() {
  const game = require( './lib/reducer' )
  return oneStepUndo( combineReducers( { game } ) )
}

const creator = compose.apply( null, compact( [
  applyMiddleware( log ),
  __DEV__ && devTools(),
  __DEV__ && persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
] ) )( createStore )

const store = creator(
  createReducer(),
  __DEV__ ? { game: devGame() } : undefined
)

// hot reloading for store
if( module.hot ) {
  module.hot.accept( './lib/reducer', function() {
    store.replaceReducer( createReducer() )
    if( __DEV__ ) { fakeRandom( SEED ) }
  } )
}

function filterStateForDev( { game } ) {
  return {
    ...game,
    deck: game.deck.slice(0, 10) + ' (' + game.deck.length + ')',
    discarded: game.discarded.length,
    labyrinth: [ ...game.labyrinth.slice(-3), '...' ]
  }
}

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
        { __DEV__ ?
          <DebugPanel top right bottom>
            <DevTools store={this.props.store}
                      // select={filterStateForDev}
                      monitor={LogMonitor} />
          </DebugPanel> : null }
      </div>
    )
  }
}

render(
  <App store={store} />,
  document.getElementById( 'root' )
)
