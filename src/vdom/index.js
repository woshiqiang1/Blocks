/**
 * generates a virtual dom, it is a plane object
 *
 * @param type: string | function  (Element type)
 * @param props: object
 * @param children: string | vdom | array
 * */

export default (type, props, ...children) => {
  if(typeof type !== 'string') {
    return type(props)
  }

  // 把二维数组，拍平至一维
  children.forEach((vNode, index) => {
    if(Array.isArray(vNode)) {
      const listOfvNode = vNode
      children.splice(index, 1)

      listOfvNode.forEach((internalVnode, internalIndex) => {
        const nextPosition = index + internalIndex
        children.splice(nextPosition, 0, internalVnode)
      })
    }
  })

  return { type, props: props || {}, children, }
}
