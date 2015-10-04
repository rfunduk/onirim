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
      const game = { ...this.game, activeLimbo: 'NN', limbo: [ 'NN' ] }
      expect( canDiscardTopFive( game ) ).toBeTruthy()
    } )
    it( 'should not discard top five with a door in limbo', function() {
      const game = { ...this.game, activeLimbo: 'RD', limbo: [ 'RD' ] }
      expect( canDiscardTopFive( game ) ).toBeFalsy()
    } )
    it( 'should not discard all with empty limbo', function() {
      expect( canDiscardTopFive( this.game ) ).toBeFalsy()
    } )
    it( 'should not discard with less than 5 cards in the deck', function() {
      const game = { ...this.game, deck: this.game.deck.slice(0, -1) }
      expect( canDiscardTopFive( game ) ).toBeFalsy()
    } )
  } )

} )
