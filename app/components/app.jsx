import { Provider, connect } from 'react-redux'

import shouldPureComponentUpdate from '../utils/pure-render'
import bindRules from '../utils/bind-rules'
import bindActions from '../utils/bind-actions'

import Game from './game'

@connect( _ => _ )
export default class App extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { game, dispatch, store } = this.props
    const hasUndo = game.history.past.length > 0
    return (
      <div className='app-wrapper'>
        <Provider store={store}>
          <Game game={game.present} hasUndo={hasUndo}
                actions={bindActions( dispatch )}
                rules={bindRules( game.present )} />
        </Provider>
      </div>
    )
  }
}
