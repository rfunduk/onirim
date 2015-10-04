import expect from 'expect'
import { play } from '../../app/lib/updates'
import { WON } from '../../app/lib/constants'

describe( 'updates', function() {

  describe( 'play', function() {
    beforeEach( function() {
      this.game = {
        discarded: [],
        deck: [ 'RD', 'RD--2', 'GD' ],
        doors: [],
        labyrinth: [],
        limbo: [],
        hand: [ 'RK', 'RM', 'RS', 'BK' ]
      }
    } )

    it( 'should not play if card not found', function() {
      expect( () => play( this.game, 'NOPE' ) ).toThrow()
    } )

    describe( 'sorting doors', function() {
      beforeEach( function() {
        this.game.doors = [ 'RD--1', 'GD' ]
      } )
      it( 'should sort when granted from limbo via key', function() {
        const game = { ...this.game, limbo: [ 'RD--2' ], activeLimbo: 'RD--2' }
        const { doors } = play( game, 'RK' )
        expect( doors ).toEqual( [ 'GD', 'RD--1', 'RD--2' ] )
      } )
      it( 'should sort when granted via 3 in a row', function() {
        const game = { ...this.game, labyrinth: [ 'RM--1', 'RS--1' ] }
        const { doors } = play( game, 'RK' )
        expect( doors ).toEqual( [ 'GD', 'RD--1', 'RD' ] )
      } )
    } )

    describe( 'playing keys', function() {
      it( 'should reset activeLimbo', function() {
        const game = { ...this.game, activeLimbo: 1 }
        const { activeLimbo } = play( game, 'RK' )
        expect( activeLimbo ).toEqual( null )
      } )

      it( 'plays into labyrinth', function() {
        const { labyrinth, hand } = play( this.game, 'RK' )
        expect( labyrinth ).toContain( 'RK' )
        expect( hand ).toNotContain( 'RK' )
      } )
    } )

    describe( 'granting doors', function() {
      it( 'grants a door on the third of a color in a row', function() {
        let game = play( this.game, 'RK' )
        game = play( game, 'RM' )
        const { labyrinth, hand, doors } = play( game, 'RS' )
        expect( labyrinth ).toEqual( [ 'RK', 'RM', 'RS' ] )
        expect( hand ).toEqual( [ 'BK' ] )
        expect( doors ).toContain( 'RD' )
      } )

      it( 'does not grant another door on the 4th in a row', function() {
        let game = { ...this.game, hand: [ ...this.game.hand, 'RS--2' ] }
        game = play( game, 'RK' )
        game = play( game, 'RM' )
        game = play( game, 'RS' )
        const { labyrinth, hand, doors } = play( game, 'RS--2' )
        expect( labyrinth ).toEqual( [ 'RK', 'RM', 'RS', 'RS--2' ] )
        expect( doors ).toNotContain( 'RD--2' )
      } )
      it( 'grants for back to back sets of the same colour', function() {
        let game = { ...this.game, hand: [ ...this.game.hand, 'RS--2', 'RM--3', 'RS--4' ] }
        game = play( game, 'RK' )
        game = play( game, 'RM' )
        game = play( game, 'RS' )
        game = play( game, 'RS--2' )
        game = play( game, 'RM--3' )
        const { doors } = play( game, 'RS--4' )
        expect( doors ).toContain( 'RD--2' )
      } )
      it( 'grants for back to back sets of different colours', function() {
        let game = { ...this.game, hand: [ ...this.game.hand, 'GS--2', 'GM--3', 'GS--4' ] }
        game = play( game, 'RK' )
        game = play( game, 'RM' )
        game = play( game, 'RS' )
        game = play( game, 'GS--2' )
        game = play( game, 'GM--3' )
        const { doors } = play( game, 'GS--4' )
        expect( doors ).toContain( 'RD' )
        expect( doors ).toContain( 'GD' )
      } )
      it( 'grants on a new set after an incomplete set', function() {
        let game = { ...this.game, hand: [ ...this.game.hand, 'GS--2', 'GM--3', 'GS--4' ] }
        game = play( game, 'RK' )
        game = play( game, 'RS' )
        game = play( game, 'GS--2' )
        game = play( game, 'GM--3' )
        const { doors } = play( game, 'GS--4' )
        expect( doors ).toNotContain( 'RD' )
        expect( doors ).toContain( 'GD' )
      } )

      it( 'does not grant a door if a color sequence is broken', function() {
        let game = play( this.game, 'RK' )
        game = play( game, 'BK' )
        game = play( game, 'RM' )
        const { labyrinth, hand, doors } = play( game, 'RS' )
        expect( labyrinth ).toEqual( [ 'RK', 'BK', 'RM', 'RS' ] )
        expect( hand ).toEqual( [] )
        expect( doors ).toEqual( [] )
      } )

      it( 'should grant the door in limbo for a matching key', function() {
        const game = { ...this.game, limbo: [ 'BD' ], activeLimbo: 'BD' }
        const { discarded, limbo, doors, hand } = play( game, 'BK' )
        expect( discarded ).toContain( 'BK' )
        expect( doors ).toContain( 'BD' )
        expect( hand ).toNotContain( 'BK' )
        expect( hand.length ).toEqual( 3 )
        expect( limbo.length ).toEqual( 0 )
      } )

      it( 'shuffles after granting a door', function() {
        const originalOrder = this.game.deck
        let game = play( this.game, 'RK' )
        game = play( game, 'RM' )
        const { labyrinth, hand, doors, deck } = play( game, 'RS' )
        expect( doors ).toContain( 'RD' )
        expect( deck ).toNotEqual( originalOrder )
      } )
    } )

    it( 'should win when completing the door set', function() {
      let game = { ...this.game, doors: [ 1, 2, 3, 4, 5, 6, 7 ] }
      game = play( game, 'RK' )
      game = play( game, 'RM' )
      const { status } = play( game, 'RS' )
      expect( status ).toEqual( WON )
    } )

    describe( 'with a nightmare in limbo', function() {
      beforeEach( function() {
        this.game.limbo = [ 'NN' ]
        this.game.activeLimbo = 'NN'
      } )

      it( 'should discard the nightmare for a key', function() {
        const { discarded, limbo, doors, hand } = play( this.game, 'BK' )
        expect( discarded ).toContain( 'BK' )
        expect( discarded ).toContain( 'NN' )
        expect( hand ).toNotContain( 'BK' )
        expect( hand.length ).toEqual( 3 )
        expect( limbo.length ).toEqual( 0 )
      } )

      it( 'should play a door against a nightmare', function() {
        const game = { ...this.game, doors: [ 'RD' ] }
        const { doors, limbo, discarded } = play( game, 'RD' )
        expect( doors ).toNotContain( 'RD' )
        expect( discarded ).toContain( 'RD' )
        expect( discarded ).toContain( 'NN' )
        expect( limbo ).toNotContain( 'NN' )
      } )
    } )

  } )

} )
