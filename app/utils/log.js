export default function log( { getState } ) {
  return next => action => {
    console.groupCollapsed( action.type )
    console.log( '>> ', action )
    const result = next( action )
    console.log( '=> ', getState() )
    console.groupEnd()
    return result
  }
}
