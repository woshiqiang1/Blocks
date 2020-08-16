import addEventListener from "./addEventListener";
import removeEventListener from "./removeEventListener";

const isDifferentFunction = (func1, func2) => func1.toString() !== func2.toString()

export default function diffEventProp(element, eventName, newCallback, oldCallback) {
  if(!oldCallback) {
    addEventListener(element, eventName, newCallback)
  } else if(!newCallback) {
    removeEventListener(element, eventName, oldCallback)
  } else if(isDifferentFunction(oldCallback, newCallback)) {
    removeEventListener(element, eventName, oldCallback)
    addEventListener(element, eventName, newCallback)
  }
}