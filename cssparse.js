const fs = require('fs')
const postcss = require('postcss')

// 处理属性
const mapAttributes = () => {
    
}

fs.readFile('./src-style.css',(err, css) => {
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
        from: './src-style.css',
        to: './dist-style.css'
    })
    .then(result => {
        fs.writeFile('./dist-style.css', result.css)
    })
    .catch(err => {
        console.log(err)
    })
})