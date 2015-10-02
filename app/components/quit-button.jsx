import shouldPureComponentUpdate from '../utils/pure-render'
import classNames from 'classnames'

export default class QuitButton extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  state = { quitConfirm: false }

  componentWillUnmount() {
    clearTimeout( this.__quitConfirmTimeout )
  }

  render() {
    const { quitConfirm } = this.state
    const quitClasses = classNames( 'small', { quitConfirm: this.state.quitConfirm } )

    return (
      <button className={quitClasses}
              onClick={this.quitMaybe}>
        QUIT{quitConfirm ? '?' : ''}
      </button>
    )
  }

  quitMaybe = ( e ) => {
    e.preventDefault()

    if( this.state.quitConfirm ) {
      this.setState( { quitConfirm: false } )
      this.props.forfeit()
    }
    else {
      this.setState( { quitConfirm: true } )
      this.__quitConfirmTimeout = setTimeout(
        () => this.setState( { quitConfirm: false } ),
        5000
      )
    }
  }
}
