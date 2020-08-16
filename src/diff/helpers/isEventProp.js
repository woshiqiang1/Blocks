export default function isEventProp(propName) {
  return /^on/.test(propName)
}