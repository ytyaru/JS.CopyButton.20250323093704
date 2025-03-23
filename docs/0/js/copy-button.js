;(function(){
class CopyButtonElement extends HTMLElement {
    constructor(options) {// baseEl:el, ...
        super();
        this._options = {...this.defaultOptions, ...options};
        this._shadow = this.attachShadow({mode:'open'});
    }
    connectedCallback() {
        console.log("カスタム要素がページに追加されました。");
        // this.textContent を取得するにはsetTimeoutせねばならない! クソ仕様
        // https://stackoverflow.com/questions/64169068/obtain-this-textcontent-during-custom-element-construction
        console.log(this.textContent)
        setTimeout(()=>{
            console.log('setTimeout:', this.textContent);
            console.log('setTimeout:', this.innerHTML);
            this.#makeDefaultBaseEl();
            this.#makeEl();
            this.#addEvent();
            console.log('setTimeout:', this.children);
        }, 0);
    }
    disconnectedCallback() {console.log("カスタム要素がページから除去されました。");}
    adoptedCallback() {console.log("カスタム要素が新しいページへ移動されました。");}
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`属性 ${name} が変更されました。`);
    }
    static get observedAttributes() {return [''];}

    get el() {return this._shadow.querySelector(`div[name="overlay-box"]`)}
    get baseEl() {return this._shadow.querySelector(`.base-el`)}
    get defaultOptions() { return {
        baseEl: null,
    } }
    #makeStyle() {
        const style = document.createElement('style');
        style.textContent = ``;
        return style;
    }
    #makeDefaultBaseEl() {
        const innerEl = [...this.children].find(el=>'base'===el.getAttribute('name'));
        if (innerEl) {this._options.baseEl = innerEl}
        if (this._options.baseEl instanceof HTMLElement) {
            if (!this._options.baseEl.classList.contains('base-el')) {
                this._options.baseEl.classList.add('base-el');
            }
        } else {
            const el = document.createElement('textarea');
            el.classList.add('base-el');
            this._options.baseEl = el;
        }
    }
    #makeEl() {
        const button = document.createElement('button');
        button.textContent = '📋';
        button.addEventListener('click', async(e)=>{
            await Clipboard.copy()
        })
        this._shadow.append(button);
    }
    #makeArea() {
        const area = document.createElement('div');
        area.setAttribute('name', 'overlay-area');
        area.classList.add('overlay-area');
        const NAMES = 'top-left top top-right left center right bottom-left bottom bottom-right'.split(' ');
        // 対象要素のみ取得する。余計な要素は消す。
        for (let node of this.childNodes) {
            if (Node.ELEMENT_NODE===node.nodeType) {
                if (NAMES.includes(node.getAttribute('name'))) {
                    node.classList.add('child');
                    area.append(node)
                } else {node.remove()}
            }
        }
        return area;
    }
    #addEvent() {
        (new ResizeObserverX((entries,observer)=>{
            const E = entries[0].target.style;
            const B = entries[0].border[0];
            const T = this.el.style;
            E.contentVisibility = 'hidden';
            T.width = B.width;
            T.height = B.height;
            E.contentVisibility = 'visible';
        })).observe(this.baseEl);
    }
}
customElements.define('copy-button', CopyButtonElement);
// <copy-button><copy-button>
// <button is="clipboard-copy"><button>
// <copy-button><svg></svg><copy-button>
// <button is="clipboard-copy"><svg></svg><button>
})();

