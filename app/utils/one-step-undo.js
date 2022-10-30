export default function oneStepUndo(reducer) {
  let lastState = null
  let usedUndo = false
  return (state, action) => {
    if (lastState && !usedUndo && action.type == 'UNDO') {
      const nextState = lastState
      lastState = null
      usedUndo = true
      return {
        ...nextState,
        hasUndo: false
      }
    }
    else {
      lastState = state

      if (action.type == 'NEW_GAME') {
        // give a new undo when starting a new game
        usedUndo = false
        lastState = null
      }

      const hasUndo = !!(
        lastState && // we have a state to undo to
        typeof lastState.hasUndo != 'undefined' && // not init
        !usedUndo // didn't just use undo
      )
      return {
        ...reducer(state, action),
        hasUndo
      }
    }
  }
}
