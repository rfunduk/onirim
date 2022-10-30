import classNames from 'classnames'
import { DropTarget } from 'react-dnd'

import shouldPureComponentUpdate from '../utils/pure-render'

const spec = {
  drop(props, monitor, component) {
    return { ...monitor.getItem(), target: 'discard' }
  },
  canDrop(props, monitor) {
    const { card } = monitor.getItem()
    return props.canDiscard(card)
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

@DropTarget('card', spec, collect)
export default class Discard extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillMount() {
    // give it a little bit of randomness
    this.__rotate = Math.random() * (0.5 - -0.5) + -0.5
  }

  render() {
    const { isOver, connectDropTarget } = this.props
    const classes = classNames('pile', 'discard', { isOver })
    return connectDropTarget(
      <div className={classes} style={{ transform: `rotate(${this.__rotate}deg)` }}>
        &nbsp;{this.props.count}
      </div>
    )
  }
}
