import expect from 'expect'

import { canResolveProphecy } from '../../app/lib/rules'

describe( 'rules', function() {

  describe( 'canResolveProphecy', function() {
    beforeEach( function() {
      this.game = {
        prophecy: [ 1, 2, 3, 4, 5 ],
        lastProphecySize: 5
      }
    } )

    it( 'should not resolve prophecy before a card has been discarded', function() {
      expect( canResolveProphecy( this.game ) ).toBeFalsy()
    } )
    it( 'should resolve prophecy when a card has been discarded', function() {
      this.game.prophecy.pop()
      expect( canResolveProphecy( this.game ) ).toBeTruthy()
    } )
  } )

} )
