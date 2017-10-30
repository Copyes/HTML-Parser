import { Parser } from 'htmlparser2'

let html = `
<div class="content">
<div class="product">
    <img class="product-img" src="http://h0.hucdn.com/open/201741/48cb78980cc6b5d5_744x588.png" alt="">
</div>
<section style="width: 20px; height: 40px; display:block;">

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



const htmlParser = (htmlStr) => {
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

    return elements
}

console.log(htmlParser(html))

const cssParser = () => {

}
// 对外暴露的方法
export default autumnParser = (json) => {
    if(json.html){
        htmlParser(json.html)
    }else if(json.css){
        cssParser(json.css)
    }
}