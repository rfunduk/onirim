import expect from 'expect'

import { canDraw } from '../../app/lib/rules'

describe( 'rules', function() {

  describe( 'canDraw', function() {
    beforeEach( function() {
      this.game = {
        limbo: [],
        deck: [ 'BM' ],
        hand: [ 'RM', 'RS', 'RK', 'BK' ]
      }
    } )

    describe( 'partial hand', function() {
      it( 'can draw from a non-empty deck', function() {
        expect( canDraw( this.game ) ).toBeTruthy()
      } )
      it( 'cannot draw from an empty deck', function() {
        this.game.deck = []
        expect( canDraw( this.game ) ).toBeFalsy()
      } )

      it( 'can draw when limbo is empty', function() {
        this.game.limbo = []
        expect( canDraw( this.game ) ).toBeTruthy()
      } )
      it( 'cannot draw when limbo has a nightmare', function() {
        this.game.limbo = [ 'NN' ]
        this.game.activeLimbo = 'NN'
        expect( canDraw( this.game ) ).toBeFalsy()
      } )
      it( 'can draw when limbo has an active door', function() {
        this.game.limbo = [ 'RD' ]
        this.game.activeLimbo = 'RD'
        expect( canDraw( this.game ) ).toBeTruthy()
      } )
      it( 'can draw when limbo has a non-active door', function() {
        this.game.limbo = [ 'RD' ]
        expect( canDraw( this.game ) ).toBeTruthy()
      } )

      it( 'cannot draw during a prophecy', function() {
        this.game.prophecy = [ 1, 2, 3, 4 ]
        expect( canDraw( this.game ) ).toBeFalsy()
      } )
    } )
  } )

} )
