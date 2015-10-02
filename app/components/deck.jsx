import classNames from 'classnames'

import shouldPureComponentUpdate from '../utils/pure-render'

export default class Deck extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { type, canDraw } = this.props
    let { onClick } = this.props

    onClick = canDraw() ? onClick : null

    const classes = classNames( 'pile', 'deck', {
      disabled: !canDraw()
    } )

    return (
      <div className={classes} onClick={onClick}>
        &nbsp;{this.props.count}
      </div>
    )
  }
}
