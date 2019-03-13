export default class frame {
  constructor(params) {
    this.vdom = frame.setGuid(params.vdom);

    this.domCurrent = "";
  }

  static newGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  static setProps(v, propkey, propval) {
    v.children.forEach((child, i) => {
      if (child.type === "text") {
        v.children[i].text = frame.replaceAll(
          child.text,
          `{{${propkey}}}`,
          propval
        );
      } else {
        frame.setProps(child, propkey, propval);
      }
    });
  }

  static render(v, selected) {
    let virtualdom = new frame({ vdom: v });
    virtualdom.domNew = virtualdom.renderVdom(v, selected);
    virtualdom.domCurrent = virtualdom.domNew;
    console.log(virtualdom);
  }

  renderVdom(v, selected) {
    // get element to append doc to, append vdom elt
    let elt = document.createElement(v.type);
    elt.dataset.fId = v.fId;
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
        frame.setProps(v, prop, v.props[prop]);
      });
    }
    // if text, render text, else, rerun renderVdom
    v.children.forEach(child => {
      if (child.type === "text") {
        let text = document.createTextNode(child.text);
        elt.appendChild(text);
      } else {
        this.renderVdom(child, elt);
      }
    });
    return selected;
  }

  static setGuid(vdomelt) {
    if (!vdomelt.fId) {
      vdomelt.fId = frame.newGuid();
    }
    let gvdom = vdomelt.children.map(child => {
      if (child.type !== "text" && !child.fId) {
        child.fId = frame.newGuid();
        this.setGuid(child);
      }
      return child;
    });
    return gvdom;
  }
}
