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
        this.game.limbo = [ 'RD--2' ]
        this.game.activeLimbo = 'RD--2'
        const { doors } = play( this.game, 'RK' )
        expect( doors ).toEqual( [ 'GD', 'RD--1', 'RD--2' ] )
      } )
      it( 'should sort when granted via 3 in a row', function() {
        this.game.labyrinth = [ 'RM--1', 'RS--1' ]
        const { doors } = play( this.game, 'RK' )
        expect( doors ).toEqual( [ 'GD', 'RD--1', 'RD' ] )
      } )
    } )

    it( 'should reset activeLimbo', function() {
      this.game.activeLimbo = 1
      const { activeLimbo } = play( this.game, 'RK' )
      expect( activeLimbo ).toEqual( null )
    } )

    it( 'plays into labyrinth', function() {
      const { labyrinth, hand } = play( this.game, 'RK' )
      expect( labyrinth ).toContain( 'RK' )
      expect( hand ).toNotContain( 'RK' )
    } )

    it( 'grants a door on the third of a color in a row', function() {
      this.game = play( this.game, 'RK' )
      this.game = play( this.game, 'RM' )
      const { labyrinth, hand, doors } = play( this.game, 'RS' )
      expect( labyrinth ).toEqual( [ 'RK', 'RM', 'RS' ] )
      expect( hand ).toEqual( [ 'BK' ] )
      expect( doors ).toContain( 'RD' )
    } )

    it( 'does not grant another door on the 4th in a row', function() {
      this.game.hand.push( 'RS--2' )
      this.game = play( this.game, 'RK' )
      this.game = play( this.game, 'RM' )
      this.game = play( this.game, 'RS' )
      const { labyrinth, hand, doors } = play( this.game, 'RS--2' )
      expect( labyrinth ).toEqual( [ 'RK', 'RM', 'RS', 'RS--2' ] )
      expect( doors ).toNotContain( 'RD--2' )
    } )
    it( 'back to back sets of the same colour', function() {
      this.game.hand.push( 'RS--2', 'RM--3', 'RS--4' )
      this.game = play( this.game, 'RK' )
      this.game = play( this.game, 'RM' )
      this.game = play( this.game, 'RS' )
      this.game = play( this.game, 'RS--2' )
      this.game = play( this.game, 'RM--3' )
      const { doors } = play( this.game, 'RS--4' )
      expect( doors ).toContain( 'RD--2' )
    } )
    it( 'grants back to back sets of different colours', function() {
      this.game.hand.push( 'GS--2', 'GM--3', 'GS--4' )
      this.game = play( this.game, 'RK' )
      this.game = play( this.game, 'RM' )
      this.game = play( this.game, 'RS' )
      this.game = play( this.game, 'GS--2' )
      this.game = play( this.game, 'GM--3' )
      const { doors } = play( this.game, 'GS--4' )
      expect( doors ).toContain( 'RD' )
      expect( doors ).toContain( 'GD' )
    } )
    it( 'grants on a new set after an incomplete set', function() {
      this.game.hand.push( 'GS--2', 'GM--3', 'GS--4' )
      this.game = play( this.game, 'RK' )
      this.game = play( this.game, 'RS' )
      this.game = play( this.game, 'GS--2' )
      this.game = play( this.game, 'GM--3' )
      const { doors } = play( this.game, 'GS--4' )
      expect( doors ).toNotContain( 'RD' )
      expect( doors ).toContain( 'GD' )
    } )

    it( 'should win when completing the door set', function() {
      this.game.doors = [ 1, 2, 3, 4, 5, 6, 7 ]
      this.game = play( this.game, 'RK' )
      this.game = play( this.game, 'RM' )
      const { status } = play( this.game, 'RS' )
      expect( status ).toEqual( WON )
    } )

    it( 'does not grant a door if a color sequence is broken', function() {
      this.game = play( this.game, 'RK' )
      this.game = play( this.game, 'BK' )
      this.game = play( this.game, 'RM' )
      const { labyrinth, hand, doors } = play( this.game, 'RS' )
      expect( labyrinth ).toEqual( [ 'RK', 'BK', 'RM', 'RS' ] )
      expect( hand ).toEqual( [] )
      expect( doors ).toEqual( [] )
    } )

    describe( 'with a door in limbo', function() {
      beforeEach( function() {
        this.game.limbo = [ 'BD' ]
        this.game.activeLimbo = 'BD'
      } )

      it( 'should grant the door for a matching key', function() {
        const { discarded, limbo, doors, hand } = play( this.game, 'BK' )
        expect( discarded ).toContain( 'BK' )
        expect( doors ).toContain( 'BD' )
        expect( hand ).toNotContain( 'BK' )
        expect( hand.length ).toEqual( 3 )
        expect( limbo.length ).toEqual( 0 )
      } )
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
        this.game.doors = [ 'RD' ]
        const { doors, limbo, discarded } = play( this.game, 'RD' )
        expect( doors ).toNotContain( 'RD' )
        expect( discarded ).toContain( 'RD' )
        expect( discarded ).toContain( 'NN' )
        expect( limbo ).toNotContain( 'NN' )
      } )
    } )

  } )

} )
