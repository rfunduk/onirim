import mapValues from 'lodash/object/mapValues'
import * as rules from '../lib/rules'

export default function bindRules( game ) {
  return mapValues( rules, fn => fn.bind( null, game ) )
}
