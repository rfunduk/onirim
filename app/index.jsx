import { render } from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import undoable from 'redux-undo'

import compact from 'lodash/array/compact'

import log from './utils/log'

import App from './components/app'

// load fake randomization hack so that shuffling
// doesn't break redux devtools time travelling
// and we get the same game every time
import { resetFakeRandom, resetFakeRandomMiddleware } from './utils/fake-random'
if( __DEV__ ) { resetFakeRandom() }

function createReducer() {
  const game = require( './lib/reducer' )
  return combineReducers( {
    game: undoable( game, {
      limit: 1,
      initTypes: [ 'NEW_GAME' ]
    } )
  } )
}

let middleware = [ log ]
if( __DEV__ ) { middleware = [ ...middleware, resetFakeRandomMiddleware ] }

const store = createStore(
  createReducer(),
  applyMiddleware( ...middleware )
)

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
