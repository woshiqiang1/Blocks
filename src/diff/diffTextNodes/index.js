export default function diffTextNodes($parent, newTextNode, oldTextNode, index = 0) {
  if(!oldTextNode) {
    const $newTextNode = document.createTextNode(newTextNode)
    $parent.appendChild($newTextNode)
  } else if(!newTextNode) {
    const $oldTextNode = $parent.childNodes[index]
    $parent.removeChild($oldTextNode)
  } else if(newTextNode !== oldTextNode) {
    const $oldTextNode = $parent.childNodes[index]
    const $newTextNode = document.createTextNode(newTextNode)
    $parent.replaceChild($newTextNode, $oldTextNode)
  }
}