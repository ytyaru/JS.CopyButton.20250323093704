;(function(){
class CopyButtonElement extends HTMLElement {
    constructor(options) {// baseEl:el, ...
        super();
        this._options = {...this.defaultOptions, ...options};
        this._shadow = this.attachShadow({mode:'open'});
        this.for = null;
        this.value = `Set the text to be copied in the 'value' attribute, or set the CSS selector of the target element in the 'for' attribute.`;
    }
    connectedCallback() {
        console.log("カスタム要素がページに追加されました。");
        // this.textContent を取得するにはsetTimeoutせねばならない! クソ仕様
        // https://stackoverflow.com/questions/64169068/obtain-this-textcontent-during-custom-element-construction
        console.log(this.textContent)
        setTimeout(()=>{
            console.log('setTimeout:', this.textContent);
            this.#makeEl();
        }, 0);
    }
    disconnectedCallback() {console.log("カスタム要素がページから除去されました。");}
    adoptedCallback() {console.log("カスタム要素が新しいページへ移動されました。");}
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`属性 ${name} が変更されました。`);
        if ('value'===name) {this.value = newValue}
        else if ('for'===name) {this.for = newValue}
    }
    static get observedAttributes() {return ['value', 'for'];}
    get value() {return this._value}
    set value(v) {this._value = v;}
    get el() {return this._shadow.querySelector(`:host button`)}
    #makeEl() {
        const button = document.createElement('button');
        if (this.innerHTML) {button.innerHTML = this.innerHTML;}
        else {button.textContent = '📋';}
        button.addEventListener('click', async(e)=>{
            const el = document.querySelector(this.for);
            if (el) {
                for (let attr of ['value', 'textContent', 'innerHTML']) {
                    if (attr in el) {await Clipboard.write(el[attr])}
                }
            } else {await Clipboard.write(this.value)}
        })
        this._shadow.append(button);
    }
}
customElements.define('copy-button', CopyButtonElement);
// <copy-button><copy-button>
// <button is="clipboard-copy"><button>
// <copy-button><svg></svg><copy-button>
// <button is="clipboard-copy"><svg></svg><button>
})();

