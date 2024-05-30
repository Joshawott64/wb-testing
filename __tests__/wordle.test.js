import { jest } from '@jest/globals'

// create mock module
const mockIsWord = jest.fn(() => true)
jest.unstable_mockModule('../src/words.js', () => {
    return {
        getWord: jest.fn(() => 'APPLE'),
        isWord: mockIsWord
    }
})

// import Wordle class
const { Wordle, buildLetter } = await import('../src/wordle.js')

// test buildLetter function
describe('building a letter object', () => {
    test('returns a letter object', () => {
        expect(buildLetter('A', 'PRESENT')).toEqual({ letter: 'A', status: 'PRESENT' })
    })
})

// test Wordle constructor
describe('constructing a new Wordle game', () => {
    test('set maxGuesses to 6 if no argument is passed', () => {
        expect(new Wordle().maxGuesses).toEqual(6)
    })
    test('set maxGuesses to the argument passed', () => {
        expect(new Wordle(10).maxGuesses).toEqual(10)
    })
    test('set guesses to an array of length maxGuesses', () => {
        expect(new Wordle().guesses.length).toEqual(6)
    })
    test('set currGuess to 0', () => {
        expect(new Wordle().currGuess).toEqual(0)
    })
    test('set word to a word from getWord', () => {
        expect(new Wordle().word).toEqual('APPLE')
    })
})

// test Wordle.buildGuessFromWord method
describe('building a guess from a word', () => {
    test('sets the status of a correct letter to CORRECT', () => {
        expect(new Wordle().buildGuessFromWord('A____')[0]).toEqual({ letter: 'A', status: 'CORRECT' })
    })
    test('sets the status of a present letter to PRESENT', () => {
        expect(new Wordle().buildGuessFromWord('E____')[0]).toEqual({ letter: 'E', status: 'PRESENT' })
    })
    test('sets the status of an absent letter to ABSENT', () => {
        expect(new Wordle().buildGuessFromWord('Z___')[0]).toEqual({ letter: 'Z', status: 'ABSENT' })
    })
})

// test Wordle.appendGuess method
describe('append a guess to the guesses array and increment the current guess', () => {
    test('throw an error if no more guesses are allowed', () => {
        const testWordle = new Wordle(1)
        testWordle.appendGuess('GUESS')
        expect(() => testWordle.appendGuess('GUESS')).toThrow()
    })
    test('throw an error if the guess is not of length 5', () => {
        const testWordle = new Wordle()
        expect(() => testWordle.appendGuess('TEST')).toThrow()
    })
    test('throw an error if the guess is not a word', () => {
        const testWordle = new Wordle()
        mockIsWord.mockReturnValueOnce(false)
        expect(() => testWordle.appendGuess('GUESS')).toThrow()
    })
    test('increments the current guess', () => {
        const testWordle = new Wordle()
        testWordle.appendGuess('GUESS')
        expect(testWordle.currGuess).toEqual(1)
    })
})

// test Wordle.isSolved method
describe('check if the latest guess is the correct word', () => {
    test('return true the latest guess is the correct word', () => {
        const testWordle = new Wordle()
        expect(testWordle.appendGuess('APPLE').isSolved()).toEqual(true)
    })
    test('return false if the latest guess is not the correct word', () => {
        const testWordle = new Wordle()
        expect(testWordle.appendGuess('GRAPE').isSolved()).toEqual(false)
    })
}) 

// test Wordle.shouldEndGame method
describe('check if the game should end', () => {
    test('return true if the latest guess is the correct word', () => {
        const testWordle = new Wordle()
        testWordle.appendGuess('APPLE')
        expect(testWordle.shouldEndGame()).toEqual(true)
    })
    test('return true if there are no guesses left', () => {
        const testWordle = new Wordle(1)
        testWordle.appendGuess('GRAPE')
        expect(testWordle.shouldEndGame()).toEqual(true)
    })
    test('return false if no guess has been made', () => {
        const testWordle = new Wordle()
        expect(testWordle.shouldEndGame()).toEqual(false)
    })
    test('return false if there are guesses left and the word has not been guessed', () => {
        const testWordle = new Wordle()
        testWordle.appendGuess('GRAPE')
        expect(testWordle.shouldEndGame()).toEqual(false)
    })
})