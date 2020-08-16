import extractEventName from "./extractEventName";

export default function removeEventListener(element, propName, callback) {
  const eventName = extractEventName(propName)
  element.removeEventListener(eventName, callback)
}