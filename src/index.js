import vdom from './vdom/index'
import diff from './diff/index'
import getRefs from './refs/index'

class Blocks {
  constructor() {
    this.oldVnode = null
    this.refs = {}
  }

  component(type, props, ...children) {
    return vdom(type, props, ...children)
  }

  render(newVnode, parent) {
    diff(parent, newVnode, this.oldVnode)
    getRefs(this.refs)
    this.oldVnode = newVnode
  }
}

export default new Blocks()