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
      const game = { ...this.game, prophecy: this.game.prophecy.slice(0, -1) }
      expect( canResolveProphecy( game ) ).toBeTruthy()
    } )
  } )

} )
