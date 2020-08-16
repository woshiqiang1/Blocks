import addProp from "../helpers/addProp";
import removeProp from "../helpers/removeProp";
import isEventProp from "../helpers/isEventProp";
import diffEventProp from "../helpers/diffEventProp";

function diffProp(element, propName, newValue, oldValue) {
  if(!oldValue) {
    addProp(element, propName, newValue)
  } else if(!newValue) {
    removeProp(element, propName)
  } else if(oldValue !== newValue) {
    addProp(element, propName, newValue)
  }

}

export default function diffProps(element, newProps, oldProps) {
  const allProps = Object.assign({}, newProps, oldProps)
  Object.keys(allProps).forEach(propName => {
    if(isEventProp(propName)) {
      diffEventProp(element, propName, newProps[propName], oldProps[propName])
    } else {
      diffProp(element, propName, newProps[propName], oldProps[propName])
    }
  })

}