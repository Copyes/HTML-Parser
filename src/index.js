import HtmlParser from './parser'
import { renderToHtml } from './render'

let htmlStr = document
  .getElementsByTagName('body')[0]
  .innerHTML.replace(/<\/?script[^>]*>/gi, '')
let parser = new HtmlParser(htmlStr)

console.log(parser.elements)

let html = renderToHtml(parser.elements)
console.log(html)
document.querySelector('body').innerHTML = html
