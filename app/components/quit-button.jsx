import classNames from 'classnames'

import shouldPureComponentUpdate from '../utils/pure-render'

export default class QuitButton extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  state = { quitConfirm: false }

  componentWillUnmount() {
    clearTimeout(this.__quitConfirmTimeout)
  }

  render() {
    const { quitConfirm } = this.state
    const classes = classNames('button', 'small-button', {
      'quit-confirm-button': quitConfirm
    })

    return (
      <button className={classes} onClick={this.quitMaybe}>
        QUIT{quitConfirm ? '?' : ''}
      </button>
    )
  }

  quitMaybe = (e) => {
    e.preventDefault()

    if (this.state.quitConfirm) {
      this.setState({ quitConfirm: false })
      this.props.forfeit()
    }
    else {
      this.setState({ quitConfirm: true })
      this.__quitConfirmTimeout = setTimeout(
        () => this.setState({ quitConfirm: false }),
        5000
      )
    }
  }
}
