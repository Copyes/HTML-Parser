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
    let newAttrs = newNode.attrs
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
// diff same level node , find out what has changed
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
    // todo：／／
    // let oldChildren = oldNode.children
    // let newChildren = newNode.children

    // patches = patches.concat(diff(oldChildren, newChildren, oldNode))
    
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
    // console.log(oldIdentifiers)
    // console.log(newIdentifiers)
    let patches = []
    // the simpulate array
    let restIdentifier = []
    let restNode = []
    // the first step, find out those deleted oldNode
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
        // the target node and id
        let targetIdentifier = restIdentifier[i]
        let targetNode = restNode[i]

        curIndex = i
        let findPos = findIdentifierPos(id, restIdentifier, curIndex)
        // identfiers are the same, it means oldNode is the same as newNode
        if(id === targetIdentifier){
            patches = patches.concat(diffSameNode(targetNode, newNode))
        } else if(findPos !== -1) {
            let oldNode = oldNodes[findPos]
            let oldIdentifier = oldIdentifiers[findPos]
            patches.push(makePatch('move', targetNode, oldNode))

            restNode.splice(findPos, 1)
            restNode.splice(i, 0, oldNode)
            restIdentifier.splice(findPos, 1)
            restIdentifier.splice(i, 0, oldIdentifier)

        } else if(i < restIdentifier.length){
            // not exist insert
            patches.push(makePatch('insert', targetNode, newNode))
            restNode.splice(i, 0, newNode)
            restIdentifier.splice(i, 0, id)
        } else {
            // not exist ,append
            patches.push(makePatch('append', parentNode, newNode))
            restNode.push(newNode)
            restIdentifier.push(id)
        }
    })
    // when newNodes dealed, delete oldNodes those no use
    for(let i = curIndex + 1; i < restNode.length; ++i){
        let oldNode = restNode[i]
        patches.push(makePatch('remove', oldNode))
    }
    restNode.splice(curIndex + 1, restNode.length - curIndex)

    // update vnodes
    oldNodes.splice(0, oldNodes.length)
    restNode.forEach(item => oldNodes.push(item))

    return patches
}