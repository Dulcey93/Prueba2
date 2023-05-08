import config from "../../../config/config_path.js";

export default class MyHeader extends HTMLElement {
    static url = import.meta.url;
    static async components() {
        return await (await fetch(config.endPoint(MyHeader.url))).text();
    }
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    handleEvent(e) {
        e.preventDefault();
    }

    connectedCallback() {
        Promise.resolve(MyHeader.components()).then(html=>{
            this.shadowRoot.innerHTML = html;
        })
    }
}
customElements.define(config.name(MyHeader.url), MyHeader);