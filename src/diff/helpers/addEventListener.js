import extractEventName from './extractEventName'

export default function addEventListener(element, propName, callback) {
  const eventName = extractEventName(propName)
  element.addEventListener(eventName, callback)
}