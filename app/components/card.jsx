import classNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'

import shouldPureComponentUpdate from '../utils/pure-render'

import { COLOR, SYMBOL } from '../lib/constants'

const playSpec = {
  beginDrag(props) {
    return { card: props.card, orderable: props.orderable }
  },
  canDrag(props) {
    return props.playable || props.orderable
  },
  endDrag(props, monitor, component) {
    if (monitor.didDrop()) {
      const { card, target } = monitor.getDropResult()
      // console.log( 'DROP', monitor.getDropResult(), card, {props} )
      switch (target) {
        case 'labyrinth':
        case 'limbo':
          // the distinction is handled in `play`
          props.play(card)
          break
        case 'discard':
          props.discard(card)
          break
      }
    }
  }
}

const prophecySpec = {
  canDrop(props, monitor) {
    const { card, orderable } = monitor.getItem()
    return props.orderable && orderable
  },
  hover(props, monitor) {
    const { card, orderable } = monitor.getItem()
    if (!orderable || !props.orderable) { return }

    if (card !== props.card) {
      props.reorderProphecy(card, props.card)
    }
  }
}

@DropTarget('card', prophecySpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
@DragSource('card', playSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Card extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillMount() {
    // give it a little bit of randomness
    this.__rotate = Math.random() * (1.2 - -1.2) + -1.2
  }

  render() {
    const { card, playable, disabled } = this.props
    const { play } = this.props
    const { connectDragSource, connectDropTarget, isDragging } = this.props
    let { canPlay, onClick } = this.props

    canPlay = playable && (!canPlay || canPlay(card))
    onClick = onClick || (canPlay ? () => play(card) : null)

    const classes = classNames(
      'card', `color-${card[COLOR]}`, `symbol-${card[SYMBOL]}`,
      {
        tiny: this.props.tiny,
        stacked: this.props.stacked,
        playable: playable,
        dragging: isDragging,
        disabled: playable && !canPlay,
        hovered: this.props.hovered || this.props.popUp
      }
    )

    let style = this.props.stacked ? {
      position: 'absolute',
      left: this.props.offset
    } : {}
    style.transform = `rotate(${this.__rotate}deg)`

    return connectDragSource(connectDropTarget(
      <div className={classes} style={style}></div>
    ))
  }
}
