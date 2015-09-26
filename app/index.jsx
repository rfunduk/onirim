import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'

import compact from 'lodash/array/compact'

import log from './utils/log'
import oneStepUndo from './utils/one-step-undo'
import shouldPureComponentUpdate from './utils/pure-render'

import App from './components/app'

// load fake randomization hack so that shuffling
// doesn't break redux devtools time travelling
// and we get the same game every time
const fakeRandom = require( './utils/fake-random' )
// set a seed if you want a different set of shuffles
const SEED = 0

function resetFakeRandomOnNewGame( reducer ) {
  return ( state, action ) => {
    if( action.type == 'NEW_GAME' ) {
      // reinit fake random
      fakeRandom( SEED )
    }
    return reducer( state, action )
  }
}

function createReducer() {
  const game = require( './lib/reducer' )
  const combiner = compose.apply( this, compact( [
    oneStepUndo,
    __DEV__ && resetFakeRandomOnNewGame,
    combineReducers
  ] ) )
  return combiner( { game } )
}

const creator = compose.apply( null, compact( [
  applyMiddleware( log ),
] ) )( createStore )

const store = creator( createReducer() )

// hot reloading for store
if( module.hot ) {
  module.hot.accept( './lib/reducer', function() {
    store.replaceReducer( createReducer() )
  } )
}

render(
  <App store={store} />,
  document.getElementById( 'root' )
)
