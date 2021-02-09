const _ = require('lodash')
const axios = require('axios')
const cheerio = require('cheerio')

// runs passed functions in order
const compose = (...fns) => arg => {
    return **_flattenDeep(fns).reduceRight((current, fn) => {
        if(_**.isFunction(fn)) return fn(current)
        throw new TypeError("compose() expects only functions as parameters")
    }, arg)
}

// same as above, but async
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

// gets html from URL
const fetchHtmlFromUrl = async url => {
    return await axios
        .get(enforceHttpsUrl(url))
        .then(response => cheerio.load(response.data))
        .catch(error => {
            error.status = (error.response && error.response.status) || 500
            throw error
        })
}

// gets trimmed inner text of element
const fetchElemInnerText = elem => (elem.text && elem.text().trim()) || null

// gets specified attribute value from element
const fetchElemAttribute = attribute => elem => (elem.attr && elem.attr(attribute)) || null

// gets array of values from a collection of elements - returns the array or return value from calling transform() on it
const extractFromElems = extractor => transform => elems => $ => {
    const results = elems.map((i, element) => extractor($(element))).get()
    return _.isFunction(transform) ? transform(results) : results
}

// extracts number text from an element, sanitizes, and returns parsed integer
const extractNumber = compose(parseInt, sanitizeNumber, fetchElemInnerText)

// composed function that extracts url string from elem's attribute(attr) and returns URL with https
const extractUrlAttribute = attr => compose(enforceHttpsUrl, fetchElemAttribute(attr))

module.exports = {
    compose, 
    composeAsync,
    enforceHttpsUrl,
    sanitizeNumber,
    withoutNulls,
    arrayPairsToObject, 
    fromPairsToObject,
    sendResponse,
    fetchHtmlFromUrl,
    fetchElemInnerText,
    fetchElemAttribute,
    extractFromElems,
    extractNumber,
    extractUrlAttribute
}