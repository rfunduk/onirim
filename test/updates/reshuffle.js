import expect from 'expect'
import isEqual from 'lodash/lang/isEqual'
import { reshuffle } from '../../app/lib/updates'

describe( 'updates', function() {

  describe( 'reshuffle', function() {
    beforeEach( function() {
      this.game = {
        limbo: [],
        activeLimbo: null,
        deck: [ 1, 2, 3, 4, 5 ]
      }
    } )

    it( 'should reset activeLimbo', function() {
      const game = { ...this.game, activeLimbo: 1 }
      const { activeLimbo } = reshuffle( game )
      expect( activeLimbo ).toEqual( null )
    } )

    it( 'should reshuffle a deck', function() {
      const game = reshuffle( this.game )
      expect( game.deck ).toNotEqual( this.game.deck )
      expect( game.limbo.length ).toEqual( 0 )
    } )

    it( 'should reshuffle limbo back into the deck', function() {
      const game = { ...this.game, limbo: [ 5, 6, 7, 8 ] }
      const shuffledGame = reshuffle( game )
      expect( shuffledGame.limbo.length ).toEqual( 0 )
      expect( shuffledGame.deck.length ).toEqual( game.limbo.length + game.deck.length )
    } )

  } )

} )
