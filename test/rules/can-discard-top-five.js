import expect from 'expect'

import { canDiscardTopFive } from '../../app/lib/rules'

describe( 'rules', function() {

  describe( 'canDiscardTopFive', function() {
    beforeEach( function() {
      this.game = {
        limbo: [],
        activeLimbo: null,
        deck: [ 1, 2, 3, 4, 5 ]
      }
    } )

    it( 'should discard top five with a nightmare in limbo', function() {
      this.game.limbo = [ 'NN' ]
      this.game.activeLimbo = 'NN'
      expect( canDiscardTopFive( this.game ) ).toBeTruthy()
    } )
    it( 'should not discard top five with a door in limbo', function() {
      this.game.limbo = [ 'RD' ]
      this.game.activeLimbo = 'RD'
      expect( canDiscardTopFive( this.game ) ).toBeFalsy()
    } )
    it( 'should not discard all with empty limbo', function() {
      expect( canDiscardTopFive( this.game ) ).toBeFalsy()
    } )
    it( 'should not discard with less than 5 cards in the deck', function() {
      this.game.deck.pop()
      expect( canDiscardTopFive( this.game ) ).toBeFalsy()
    } )
  } )

} )
