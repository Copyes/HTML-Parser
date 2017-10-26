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
// 处理内联样式
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
        console.log(Object.keys(styleObj))
    }
}
// 替换块级和内联标签
const mapLabel = (node) => {
    dealInlineStyle(node)
    const blockLabel = ['section', 'article', 'nav', 'header', 'aside', 'footer','h1', 'h2', 'h3']
    const inlineLabel = ['i', 'strong']
    // 块级元素和内联元素替换
    if(blockLabel.indexOf(node.name) > -1){
        node.name = 'div'
    } else if(inlineLabel.indexOf(node.name) > -1) {
        node.name = 'span'
    }
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