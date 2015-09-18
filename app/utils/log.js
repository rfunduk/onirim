export default function log( { getState } ) {
  return next => action => {
    console.group( action.type )
    console.log( '>> ', action )
    const result = next( action )
    console.log( '=> ', getState() )
    console.groupEnd()
    return result
  }
}
