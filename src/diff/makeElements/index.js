import isEventProp from '../helpers/isEventProp'
import addEventListener from '../helpers/addEventListener'
import addProp from '../helpers/addProp'

// 相当于React的createElement
export default function makeElements(vNode) {
  if(typeof vNode === 'string') {
    return document.createTextNode(vNode)
  }

  const { type, props, children, } = vNode

  const element = document.createElement(type)

  if(props) {
    Object.keys(props).forEach(propName => {
      if(isEventProp(propName)) {
        addEventListener(element, propName, props[propName])
      } else {
        addProp(element, propName, props[propName])
      }
    })
  }

  if(typeof children === 'string') {
    const textNode = document.createTextNode(children)
    element.appendChild(textNode)
  } else {
    if(vNode.children) {
      const appendElement = document.appendChild.bind(element)
      vNode.children.map(makeElements).forEach(appendElement)
    }
  }

  return element

}