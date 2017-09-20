export const createElement = (node) => {
    let { name, attrs, text, events, children } = node
    let el = document.createElement(name)

    // the attrs
    let attrsKey = attrs ? Object.keys(attrs) : []
    if(attrsKey && attrsKey.length){
        attrsKey.forEach(key => {
            let value = attrs[key]
            el.setAttribute(key, value)
        })
    }
    // the events
    let eventsKey = events ? Object.keys(events) : []
    if(eventsKey && eventsKey.length){
        eventsKey.forEach(key => {
            let callback = events[key]
            el.addEventListener(key, callback, false)
        })
    }
    // the text
    if(text){
        el.innerText = text
        node.$element = el
        el.$vnode = node
        return el
    }
    // the children
    if(children && children.length > 0){
        children.forEach(child => {
            let childElement = createElement(child)
            el.appendChild(childElement)
            child.$element = childElement
            childElement.$vnode = child
        })
    }

    node.$element = el
    el.$vnode = node

    return el
}