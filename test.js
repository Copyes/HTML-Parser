const { Parser } = require('htmlparser2')
const postcss = require('postcss')


let css = `
.content {
    position: absolute;
    width: 750px;
    height: 970px;
}
.product {
    position: absolute;
    top: 8px;
    left: 5px;
}
.product-img {
    width: 740px;
}
.box {
    position: absolute;
    top: 0;
    left: 0;
}
.box-img {
    width: 750px;
    height: 970px;
}
.container {
    position: absolute;
    top: 600px;
    left: 10px;
    width: 740px;
    height: 400px;
}
.info {
    position: absolute;
    left: 15px;
    top: 10px;
    width: 450px;
    height: 300px;
}
.avatar {
    position: absolute;
    top: 50px;
    left: 15px;
    width: 450px;
}
.avatar-img {
    width: 50px;
    height: 50px;
    border-radius: 25px;
}
.nick {
    position: absolute;
    left: 60px;
    top: 5px;
    font-size: 30px;
}
.info-desc {
    font-size: 30px;
    color: #ff4965;
}
.qcode {
    position: absolute;
    top: 40px;
    right: 15px;
}
.qcode-desc {
    position: absolute;
    right: 15px;
    top: 0;
    font-size: 30px;
}
.qcode-img {
    width: 240px;
    height: 240px;
}
`

let html = `
<div class="content">
<div class="product">
    <img class="product-img" src="http://h0.hucdn.com/open/201741/48cb78980cc6b5d5_744x588.png" alt="">
</div>
<section style="width: 20px; height: 40px;">

</section>
<ul>
    <li></li>
</ul>
<i></i>
<h1></h1>
<div class="box">
    <img class="box-img" src="http://h0.hucdn.com/open/201738/d274241421a97f01_750x970.png" alt="">
    <div class="container">
        <div class="info">
            <p class="info-desc">快来跟我一起免费申请吧！</p>
            <div class="avatar">
                <img class="avatar-img" src="http://h0.hucdn.com/open/201741/683ae577d7cd27c8_400x400.jpg" alt="">
                <span class="nick">我是你爸爸</span>
            </div>
        </div>
        <span class="qcode-desc">扫描或长按二维码</span>
        <div class="qcode">
            <img class="qcode-img" src="http://h0.hucdn.com/open/201741/d3626feaa0e918ec_242x240.jpg" alt="">
        </div>
    </div>
</div>
</div>
`


let flexLayoutStyle = [
    'width', 
    'height',
    'padding', 
    'padding-left',
    'padding-right',
    'padding-top',
    'padding-bottom',
    'margin-left', 
    'margin-right', 
    'margin-top', 
    'margin-bottom', 
    'margin', 
    'flex-direction', 
    'flex-wrap', 
    'justify-content', 
    'align-items', 
    'align-content']

let divStyle = [
    'background-color',
    'border-width',
    'border-color',
    'background-image'
].concat(flexLayoutStyle)

let imageStyle = [
    'content-mode'
].concat(divStyle)

let spanStyle = [
    'font-size',
    'color',
    'background-color',
    'text-align',
    'strikethrough'
].concat(divStyle)

let pStyle = [
    'line-number'
].concat(spanStyle)

const defaultStyleObj = {
    'div': divStyle,
    'image': imageStyle,
    'p': pStyle,
    'span': spanStyle,
    'a': pStyle,
    'ul': divStyle
}
// 处理内联样式，主要是判断是不是在对应的标签属性集合内部
const dealInlineStyle = (node) => {
    let attrs = node.attrs
    if(attrs.style){
        let styleArrs = attrs.style.split(';').slice(0, -1)
        let styleObj = {}
        styleArrs.forEach((item) => {
            // 获取属性名称
            let itemStyle = item.trim().split(':')
            styleObj[itemStyle[0]] = itemStyle[1]
        })
        // 获取内联样式的样式名称
        Object.keys(styleObj).forEach((item) => {
            if(defaultStyleObj[node.name].indexOf(item) < 0){
                throw new Error(`${item}属性不支持哦！`)
            }
        })
        
        // let styleObjKeysSet = new Set([...styleObjKeys])
        // // 获取对应标签上面的属性
        // let elementStyleArr = defaultStyleObj[node.name]
        // let divStyleSet = new Set([...elementStyleArr])

        // // 两个数组求交集
        // let intersect = new Set([...styleObjKeysSet].filter(x => divStyleSet.has(x)))
        // console.log([...intersect])
    }
}
// 替换块级和内联标签
const mapLabel = (node) => {
    const blockLabel = ['section', 'article', 'nav', 'header', 'aside', 'footer','h1', 'h2', 'h3']
    const inlineLabel = ['i', 'strong']
    // 块级元素和内联元素替换
    if(blockLabel.indexOf(node.name) > -1){
        node.name = 'div'
    } else if(inlineLabel.indexOf(node.name) > -1) {
        node.name = 'span'
    }
    // 处理内联样式，检查是否是对应标签的样式
    dealInlineStyle(node)
    return node
}
/**
 * create node
 */
const createNode = ({name, attrs, text, children}) => {
    const singleNode = ['br', 'hr', 'input', 'link', 'meta', 'area', 'base', 'col', 'command', 'embed', 'keygen', 'param', 'source', 'track', 'wbr']
    let html = `<${name}`
    let keys = Object.keys(attrs)
    // deal the attributes
    if (keys && keys.length > 0){
        keys.forEach((key) => {
            let value = attrs[key]

            if (value === '' || value === true){
                html += ` ${key}`
            } else {
                html += ` ${key}='${value}'`
            }
        })
    }
    // if the node is single element
    if(singleNode.indexOf(name) > -1){
        html += ' />'
        return html
    }

    html += '>'
    
    // deal the text
    if(text){
        html += text + `</${name}>`
        return html
    }

    // deal the children elements
    if(children && children.length > 0){
        html += renderToHtml(children)
    }

    html += `</${name}>`

    return html
}

const createVNode = (name, attrs) => {
    let nodeObj = Object.create({
        parent: null,
        children: [],
        text: null,
    })
    nodeObj.name = name
    nodeObj.id = attrs.id
    nodeObj.class = attrs.class ? attrs.class.split(' ') : []
    nodeObj.attrs = attrs
    return nodeObj
}

const htmlParser = (htmlStr) => {
    let self = this
    let elements = []
    let nodeTree = []

    let parser = new Parser({
        onopentag(name, attrs){
            let vnode = createVNode(name, attrs)
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

    return elements
}

const cssParser = (css) => {
    // 使用postcss处理样式
    postcss([
        // 处理单位
        postcss.plugin('plugin1', function(option){
            let baseWidth = option.baseWidth
            return function(css){
                css.walkRules(rule => {
                    rule.walkDecls(declare => {
                        if(/px/.test(declare.value)){
                            declare.value = declare.value.replace('px', `*100vw/${baseWidth}`)
                        }
                    })
                })
            }
        })({
            baseWidth: 750
        }),
        // 获取所有的标签节点对象
        postcss.plugin('plugin3', function(option){
            return function(css){
                let mapClassLabel = {}

                let objs = htmlParser(html)

                objs.forEach((obj) => {
                    if(obj.class[0]){
                        mapClassLabel[`${obj.class[0]}`] = obj.name
                    }
                })
                css.walkRules(rule => {
                    rule.walkDecls(declare => {
                        console.log(declare)
                    })
                })
            }
        })({}),
        // 映射规则
        postcss.plugin('plugin2', function(option){
            return function(css){
                css.walkRules(rule => {

                })
            }
        })({})
    ])
    .process(css, {
        from: '',
        to: ''
    })
    .then(result => {
        //console.log(result.css)
    })
    .catch(err => {
        //console.log(err)
    })
}

console.log(cssParser(css))

// 对外暴露的方法
const autumnParser = (json) => {
    if(json.html){
        htmlParser(json.html)
    }else if(json.css){
        cssParser(json.css)
    }
}
/**
 * 解析前端的html标签对应到autumn支持的标签
 * 并且在里面校验对应标签的合法性
 * @param {*} json 
 */
const renderToHtml = (json) => {
    let html = ''

    if (Array.isArray(json)){
        json.forEach((node) => {
            // 
            node = mapLabel(node)
            html += renderToHtml(node)
        })

        return html
    }

    html += createNode(json)

    return html
}



const bfsDOM = (htmlStr) => {
    let obj = {}

    function bfs(){

    }
    return obj 
}

module.exports = {
    renderToHtml,
    cssParser
}