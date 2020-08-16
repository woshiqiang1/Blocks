export default function removeProp(element, name) {
  if(name === 'className') {
    element.removeAttribute('class')
  } else {
    element.removeAttribute(name)
  }
}