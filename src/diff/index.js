import makeElements from './makeElements/index'
import isDifferentNode from './helpers/isDifferentNode'
import diffProps from './diffProps/index'
import diffTextNodes from "./diffTextNodes/index";

export default function diffElement(parent, newNode, oldNode, index = 0) {
  if(!oldNode) {
    const newElement = makeElements(newNode)
    parent.appendChild(newElement)
  } else if(!newNode) {
    const oldElement = makeElements(oldNode)
    parent.removeChild(oldElement)
  } else if(isDifferentNode(newNode, oldNode)) {
    const newElement = makeElements(newNode)
    const oldElement = makeElements(oldNode)
    parent.replaceChild(newElement, oldElement)
  } else if(typeof newNode === 'string' ) {
    diffTextNodes(parent, newNode, oldNode, index)
  } else if(newNode.type) {
    diffProps(parent.childNodes[index], newNode.props, oldNode.props)
    if(newNode.children) {
      const newNodeChildrenLength = newNode.children.length
      const oldNodeChildrenLength = oldNode.children.length
      for(let i = 0; i < oldNodeChildrenLength || i< newNodeChildrenLength; i ++) {
        diffElement(parent.childNodes[index], newNode.children[i], oldNode.children[i], i)
      }
    }
  }

}
