export default function addProp(element, name, value) {
  if(name === 'className') {
    element.setAttribute('class', value)
  } else {
    element.setAttribute(name, value)
  }
}