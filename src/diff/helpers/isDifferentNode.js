export default function isDifferentNode(vNode1, vNode2) {
  const isDifferentType = typeof vNode1 !== typeof vNode2
  const isDifferentElement = vNode1.type !== vNode2.type
  return isDifferentType || isDifferentElement
}