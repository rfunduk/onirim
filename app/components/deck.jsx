import classNames from 'classnames'

import shouldPureComponentUpdate from '../utils/pure-render'

export default class Deck extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillMount() {
    // give it a little bit of randomness
    this.__rotate = Math.random() * (0.7 - -0.7) + -0.7
  }

  render() {
    const { type, canDraw } = this.props
    let { onClick } = this.props

    onClick = canDraw() ? onClick : null

    const classes = classNames('pile', 'deck', {
      disabled: !canDraw()
    })

    return (
      <div className={classes} onClick={onClick} style={{ transform: `rotate(${this.__rotate}deg)` }}>
        &nbsp;{this.props.count}
      </div>
    )
  }
}
