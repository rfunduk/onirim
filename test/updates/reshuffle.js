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
      this.game.activeLimbo = 1
      const { activeLimbo } = reshuffle( this.game )
      expect( activeLimbo ).toEqual( null )
    } )

    it( 'should reshuffle a deck', function() {
      let r = reshuffle( this.game )
      expect( r.deck ).toNotEqual( this.game.deck )
      expect( r.limbo.length ).toEqual( 0 )
    } )

    it( 'should reshuffle limbo back into the deck', function() {
      this.game.limbo = [ 5, 6, 7, 8 ]
      let r = reshuffle( this.game )
      expect( r.limbo.length ).toEqual( 0 )
      expect( r.deck.length ).toEqual( this.game.limbo.length + this.game.deck.length )
    } )

  } )

} )
