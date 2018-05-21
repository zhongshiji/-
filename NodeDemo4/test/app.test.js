/**
 * 
 * @authors Er_shenger (Just Because)
 * @date    2018-05-11 13:58:12
 * @version $Id$
 */

const app = require('../app')
const should = require('should')

describe('test/app.test.js', function () {
	it('should equal 0 when n === 0', function () {
		app.fibonacci(0).should.equal(0)
	})

	it('should equal 1 when n === 1', function () {
		app.fibonacci(1).should.equal(1)
	})

	it('should equal 55 when n === 10', function () {
		app.fibonacci(10).should.equal(55)
	})

	it('should throw when n > 10', function () {
		(function () {
			app.fibonacci(11)
		}).should.throw('n should <= 10')
	})

	it('should throw when n < 0', function () {
		(function () {
			app.fibonacci(-1)
		}).should.throw('n should >= 0')
	})

	it('should throw when n isnt Number', function () {
		(function () {
			app.fibonacci('呵呵')
		}).should.throw('n should be a Number')
	})
})