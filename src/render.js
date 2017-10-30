export const renderToHtml = (json) => {
    let html = ''

    if (Array.isArray(json)){
        json.forEach((node) => {
            node = mapLabel(node)
            html += renderToHtml(node)
        })

        return html
    }

    html += createNode(json)

    return html
}

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