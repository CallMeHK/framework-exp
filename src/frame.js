export default class frame {
  constructor(params) {
    this.name = params.name;
  }

  static replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  static setProps(v, propkey, propval) {
    v.children.forEach((child, i) => {
      if (typeof child === "string") {
        v.children[i] = frame.replaceAll(child, `{{${propkey}}}`, propval);
      } else {
        frame.setProps(child, propkey, propval);
      }
    });
  }

  static renderVdom(v, selected) {
    // get element to append doc to, append vdom elt
    let elt = document.createElement(v.type);
    selected.appendChild(elt);
    // if there are attributes, set attributes
    if (v.attrs !== {}) {
      Object.keys(v.attrs).forEach(attr => {
        elt.setAttribute(attr, v.attrs[attr]);
      });
    }
    // if there are props, apply them to children
    if (v.props !== {}) {
      // for each prop
      Object.keys(v.props).forEach(prop => {
        // for each child
        frame.setProps(v,prop,v.props[prop])
      });
    }
    v.children.forEach(child => {
      if (typeof child === "string") {
        let text = document.createTextNode(child);
        elt.appendChild(text);
      } else {
        frame.renderVdom(child, elt);
      }
    });
  }
}
