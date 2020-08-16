export default (targetObj, element = document) => {
  element.querySelectorAll('[ref]').forEach(element => {
    const refName = element.getAttribute('ref')
    const refValue = element

    targetObj[refName] = refValue
  })
}