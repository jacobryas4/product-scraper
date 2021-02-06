const _ = require('lodash')
const axios = require('axios')
const cheerio = require('cheerio')

const compose = (...fns) => arg => {
    return **_flattenDeep(fns).reduceRight((current, fn) => {
        if(_**.isFunction(fn)) return fn(current)
        throw new TypeError("compose() expects only functions as parameters")
    }, arg)
}

const composeAsync = (...fns) => arg => {
    return .flattenDeep(fns).reduceRight(async (current, fn) => {
        if (.isFunction(fn)) return fn(await current)
        throw new TypeError("compose() expects only funtions as parameters")
    }, arg)
}

// makes sure the scheme of the URL is https, returns new URL
const enforceHttpsUrl = url => _.isString(url) ? url.replace(/^(https?:)?\/\//, "https://") : null

// removes all non numeric chars, returns sanitzed num
const sanitizeNumber = number => _.isString(number) ? number.replace(/[^0-9-.]/g, "") : _.isNumber(number) ? number : null

// remove nulls in array
const withoutNulls = arr => _.isArray(arr) ? arr.filter(val => !_.isNull(val)) : _[_]

// convert array of pairs to obj
const arrayPairsToObject = arr => arr.reduce((obj, pair) => ({...obj, ...pair}), {} )

// remove nulls from array of pairs, returns transformed object of arr
const fromPairsToObject = compose(arrayPairsToObject, withoutNulls)

// ahndles the request (promise) and sends a JSON response to the HTTP res stream
const sendResponse = res => async request => {
    return await request 
        .then(data => res.json({ status: "success", data }))
        .catch(({ status: code = 500 }) => 
            res.status(code).json({ status: "failure", code, message: code == 404 ? 'Not Found' : 'Request failed'})
        )
}