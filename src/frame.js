export default class frame {
  constructor(params) {
    // func that returns vdom
    this.vdomFunc = params.vdom;
    // func that returns vdom + guid tags
    const vdomGuid = frame.setGuid(params.vdom());
    const vdomGuidFunc = () => vdomGuid;
    this.vdomGuid = vdomGuidFunc;
    // func that returns vdom + props
    const vdomPropsConst = frame.runProps(this.vdomGuid(), this.vdomGuid().props);
    const vdomProps = () => vdomPropsConst
    this.vdomProps = vdomProps
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

  static runProps(v,props) {
    v.children.forEach((child, i) => {
      
      if (child.type === "text") {
        console.log(props)
        Object.keys(props).forEach(propkey => {
          v.children[i].text = frame.replaceAll(
            child.text,
            `{{${propkey}}}`,
            props[propkey]
          );
          // console.log( v.children[i].text )
        });
      } else {
        v.children[i] = frame.runProps(child,props);
      }
    });
    //console.log(v);
    return v;
  }

  static setProps(v, propkey, propval) {
    v.children.forEach((child, i) => {
      //console.log(child,propkey)
      if (child.type === "text") {
        v.children[i].text = frame.replaceAll(
          child.text,
          `{{${propkey}}}`,
          propval
        );
      } else {
        v.children[i] = frame.setProps(child, propkey, propval);
      }
    });
    return v;
  }

  static render(v, selected) {
    let virtualdom = new frame({ vdom: v });
    virtualdom.domNew = virtualdom.renderVdom(v, selected);
    virtualdom.domCurrent = virtualdom.domNew;
    console.log(virtualdom);
    return virtualdom;
  }

  rerender(v) {
    // if there are props, apply them to children
    console.log(v);
    if (v.props !== {}) {
      // for each prop
      Object.keys(v.props).forEach(prop => {
        // for each child
        console.log(prop);
        frame.setProps(v, prop, v.props[prop]);
      });
    }
    console.log(v);
  }

  renderVdom(vdom, selected) {
    let v;
    if (typeof vdom === "function") {
      v = vdom();
    } else {
      v = vdom;
    }
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

  static runGuid(vdomelt) {
    let gvdom = vdomelt.children.map(child => {
      if (child.type !== "text" && !child.fId) {
        child.fId = frame.newGuid();
        this.setGuid(child);
      }
      return child;
    });
    return gvdom;
  }

  static setGuid(vdomelt) {
    vdomelt.fId = frame.newGuid();
    let setChildren = frame.runGuid(vdomelt);
    return { ...vdomelt, children: setChildren };
  }
}
