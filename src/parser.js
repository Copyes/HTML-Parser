import { Parser } from 'htmlparser2'

export default class HtmlParser {
    constructor(html){
        let self = this
        let elements = []
        let nodeTree = []

        let parser = new Parser({
            onopentag(name, attrs){
                let vnode = self.createVNode(name, attrs)
                let parent = nodeTree.length ? nodeTree[nodeTree.length - 1] : null

                if(parent){
                    vnode.parent = parent
                    if(!parent.hasOwnProperty('children')){
                        parent.children = []
                    }
                    parent.children.push(vnode)
                }

                nodeTree.push(vnode)
                elements.push(vnode)
            },
            onclosetag(name){
                nodeTree.pop()
            },
            ontext(text){
                let vnode = nodeTree[nodeTree.length - 1]
                if(vnode){
                    vnode.text = text.trim()
                }
            }
        })

        parser.parseChunk(html)
        parser.done()

        this.elements = elements
        console.log(elements)
    }

    static get VNodePrototype(){
        let self = this
        return {
            parent: null,
            children: [],
            text: null,
            getElements(){
                let elements = []
                this.children.forEach(item => {
                    elements.push(item)
                    if(item.children.length){
                        elements = elements.concat(this.getElements(item))
                    }
                })
                return elements
            },
            getElementById(){
                return self.getElementById.call(this, selector)
            },
            getElmentsByTagName(){
                return self.getElmentsByTagName.call(this, selector)
            },
            getElementsByClassName(){
                return self.getElementsByClassName.call(this, selector)
            },
            getElementsByAttributes(attrName, attrValue){
                return self.getElementsByAttributes.call(this, attrName, attrValue)
            },
            querySelector(){
                return self.querySelector.call(this, selector)
            },
            querySelectorAll(selector){
                return self.querySelectorAll.call(this, selector)
            }
        }
    }
    createVNode(name, attrs){
        let nodeObj = Object.create(HtmlParser.VNodePrototype)
        nodeObj.name = name
        nodeObj.id = attrs.id
        nodeObj.class = attrs.class ? attrs.class.split(' ') : []
        nodeObj.attrs = attrs

        return nodeObj
    }
    getElements(){
        return this.elements
    }
    getElementById(){
        
    }
}

new HtmlParser('<p id="test" style="width:100px;">aaaaaa</p>')