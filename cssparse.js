const fs = require('fs')
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
    console.log(result.css)
})
.catch(err => {
    console.log(err)
})
// fs.readFile('./src-style.css',(err, css) => {
    
// })