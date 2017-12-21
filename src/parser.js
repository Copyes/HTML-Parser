import { Parser } from 'htmlparser2'

export default class HtmlParser {
  constructor(html) {
    let self = this
    let elements = []
    let nodeTree = []

    let parser = new Parser({
      onopentag(name, attrs) {
        let vnode = self.createVNode(name, attrs)
        let parent = nodeTree.length ? nodeTree[nodeTree.length - 1] : null
        // 是否存在嵌套的标签，
        if (parent) {
          vnode.parent = parent
          if (!parent.hasOwnProperty('children')) {
            parent.children = []
          }
          parent.children.push(vnode)
        } else {
          nodeTree.push(vnode)
          elements.push(vnode)
        }
      },
      onclosetag(name) {
        nodeTree.pop()
      },
      ontext(text) {
        let vnode = nodeTree[nodeTree.length - 1]
        if (vnode) {
          vnode.text = text.trim()
        }
      }
    })

    parser.parseChunk(html)
    parser.done()

    this.elements = elements
  }

  static get VNodePrototype() {
    let self = this
    return {
      parent: null,
      children: [],
      text: null,
      getElements() {
        let elements = []
        this.children.forEach(item => {
          elements.push(item)
          if (item.children.length) {
            elements = elements.concat(this.getElements(item))
          }
        })
        return elements
      },
      getElementById() {
        return self.getElementById.call(this, selector)
      },
      getElmentsByTagName() {
        return self.getElmentsByTagName.call(this, selector)
      },
      getElementsByClassName() {
        return self.getElementsByClassName.call(this, selector)
      },
      getElementsByAttributes(attrName, attrValue) {
        return self.getElementsByAttributes.call(this, attrName, attrValue)
      },
      querySelector() {
        return self.querySelector.call(this, selector)
      },
      querySelectorAll(selector) {
        return self.querySelectorAll.call(this, selector)
      }
    }
  }
  createVNode(name, attrs) {
    let nodeObj = Object.create(HtmlParser.VNodePrototype)
    nodeObj.name = name
    nodeObj.id = attrs.id
    if (attrs.class) {
      if (attrs.class.split(' ').length > 1) {
        throw new Error('你的class超过一个了，iOS会崩溃的～')
      } else {
        nodeObj.class = attrs.class ? attrs.class.split(' ') : []
      }
    }
    nodeObj.attrs = attrs
    return nodeObj
  }
  getRootElement() {
    return this.elements.filter(item => !item.parent)
  }
  getElements() {
    return this.elements
  }
  getElementById(id) {
    let elements = this.getElements().filter(item => item.id === id)
    if (elements.length) {
      return elements[0]
    }
    return null
  }
  getElmentsByTagName(tagName) {
    return this.getElements().filter(item => item.name === tagName)
  }
  getElementsByClassName(className) {
    return this.getElements().filter(item => item.class.indexOf(className) > -1)
  }
  getElementsByAttributes(attrName, attrValue) {
    return this.getElements().filter(
      item => item.attrs[attrName] && item.attrs[attrName] === attrValue
    )
  }
  querySelectorAll(selector) {
    let type = selector.substring(0, 1)
    let typeValue = selector.substring(1)
    switch (type) {
      case '#':
        return this.getElements().filter(item => item.id === typeValue)
        break
      case '.':
        return this.getElementsByClassName(typeValue)
        break
      case '[':
        let formatte = typeValue.substring(0, typeValue.length - 1)
        let [attrName, attrValue] = formatte.split('=')
        return this.getElementsByAttributes(attrName, attrValue)
        break
      default:
        return this.getElmentsByTagName(selector)
    }
  }
  querySelector(selector) {
    let result = this.querySelectorAll(selector)
    if (result) {
      return result[0]
    }
  }
}
