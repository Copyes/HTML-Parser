/**
 * generate the unique identify
 * @param {*} vnode 
 */
const identify = (vnode) => {
    if(vnode.attrs.key){
        return `${vnode.name}:${vnode.attrs.key}` 
    }
    return `${vnode.name}:${Object.keys(vnode.attrs).join(',')}|${!!vnode.text}`
}
/**
 * make a patch object
 * @param {*} action 
 * @param {*} target 
 * @param {*} node 
 */
const makePatch = (action, target, node) => {
    return {
        action,
        target,
        node
    }
}
/**
 * find the newNode's position at restIdentifier.
 * @param {*} id 
 * @param {*} restIdentifier 
 * @param {*} curIndex 
 */
const findIdentifierPos = (id, restIdentifier, curIndex) => {
    for(let i = curIndex, len = restIdentifier.length; i < len; ++i){
        if(id === restIdentifier[i]){
            return i
        }
    }
    return -1
}
/**
 * compare the attributes,return the different attribute
 * @param {*} oldNode 
 * @param {*} newNode 
 */
const compareAttrs = (oldNode, newNode) => {
    let patches = []
    let oldAttrs = oldNode.attrs
    let newAttrs = newNodes.attrs
    let keys = Object.keys(newAttrs)
    if(keys.length){
        keys.forEach(key => {
            let oldAttrValue = oldAttrs[key]
            let newAttrValue = newAttrs[key]
            if(oldAttrValue !== newAttrValue){
                patches.push({
                    key,
                    value: newAttrValue
                })
            }
        })
    }
    return patches
}
const diffSameNode = (oldNode, newNode) => {
    let patches = []
    // compare the text
    if(oldNode.text !== newNode.text){
        patches.push(makePatch('changeText', oldNode, newNode.text))
    }
    // compare the attributes
    let attrsPatches = compareAttrs(oldNode, newNode)
    if(attrsPatches.length){
        patches.push(makePatch('changeAttr', oldNode, attrsPatches))
    }

    let oldChildren = oldNode.children
    let newChildren = newNode.children

    patches = patches.concat(diff(oldChildren, newChildren, oldNode))
    
    return patches
}
/**
 * diff the vnodes
 * @param {*} oldNodes 
 * @param {*} newNodes 
 * @param {*} parentNode 
 */
export const diff = (oldNodes, newNodes, parentNode = null) => {
    let oldIdentifiers = oldNodes.map(vnode => identify(vnode))
    let newIdentifiers = newNodes.map(vnode => identify(vnode))

    let patches = []

    let restIdentifier = []
    let restNode = []

    oldIdentifiers.forEach((id, i) => {
        let oldNode = oldNodes[i]
        // if the newIdentifiers not contains the oldIdentifier,
        // the oldIdentifier must be removed, and then make a patch
        if (newIdentifiers.indexOf(id) === -1){
            patches.push(makePatch('remove', oldNode))
        } else {
            restIdentifier.push(id)
            restNode.push(oldNode)
        }
    })

    let curIndex = 0

    newIdentifiers.forEach((id, i) => {
        let newNode = newNodes[i]
        // all nodes are new, append the new node into parentNode
        if(oldIdentifiers.length === 0){
            patches.push(makePatch('append', parentNode, newNode))
            return 
        }

        curIndex = i
        let findPos = findIdentifierPos(id, restIdentifier, curIndex)
        // identfiers are the same, it means oldNode is the same as newNode
        if(id === restIdentifier[i]){
            patches = patches.concat(diffSameNode(restNode[i],newNode))
        } else if(findPos !== -1) {
            
        }
    })
}