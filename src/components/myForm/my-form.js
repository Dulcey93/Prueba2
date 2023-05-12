import config from "../../../config/config_path.js";

export default class MyForm extends HTMLElement {
    static url = import.meta.url;
    static async component(){
        return await (await fetch(config.endPoint(MyForm.url))).text();
    }
    handleEvent(e){
        e.preventDefault();
        this.myWorker(e)
        this.form.reset();
    }
    changeView(){
        window.location.href = "/src/components/registros/registros.html";
    }
    myWorker(e){
        e.preventDefault();
        let ws = new Worker("src/workers/wsPost.js", {type: "module"})
        let data = Object.fromEntries(new FormData(e.target));
        let {nombre, edad, telefono, email, adress, dateBorn, document, dateIn, teamId}= data;
        edad = parseInt(edad);
        telefono = parseInt(telefono);
        document = parseInt(document);
        teamId = parseInt(teamId);
        data = {nombre, edad, telefono, email, adress, dateBorn, document, dateIn, teamId};
        ws.postMessage({ accion: "postOne", body: data });
        ws.addEventListener("message", (e) => {
            ws.terminate()
        });
    }
    myWorkerTeam(e){
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.target));
        let wsPost = new Worker("src/workers/wsTeam.js", {type: "module"});
        wsPost.postMessage({ accion: "postOne", body: data });
        wsPost.addEventListener("message", (e) => {
            wsPost.terminate();
        });

        this.formTeam.reset();
    }
    myWorkerSkill(e){
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.target));
        let wsSkill = new Worker("src/workers/wsSkill.js", {type: "module"})
        wsSkill.postMessage({ accion: "postOne", body: data });
        wsSkill.addEventListener("message", (e) => {
            wsSkill.terminate()
        });

        this.formSkill.reset();
    }
    myWorkerModulo(e){
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.target));
        let wsModulo = new Worker("src/workers/wsModulo.js", {type: "module"})
        wsModulo.postMessage({ accion: "postOne", body: data });
        wsModulo.addEventListener("message", (e) => {
            wsModulo.terminate()
        });

        this.formSkill.reset();
    }
    myWorkerEvaluacion(e){
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.target));
        let wsEvaluacion = new Worker("src/workers/wsEvaluacion.js", {type: "module"})
        wsEvaluacion.postMessage({ accion: "postOne", body: data });
        wsEvaluacion.addEventListener("message", (e) => {
            wsEvaluacion.terminate()
        });

        this.formSkill.reset();
    }
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        Promise.resolve(MyForm.component()).then(html=>{
            this.shadowRoot.innerHTML = html;
            this.btn = this.shadowRoot.querySelector(".students");
            this.btn.addEventListener("click", this.changeView.bind(this));
            this.form = this.shadowRoot.querySelector("#student");
            this.form.addEventListener("submit", this.handleEvent.bind(this));
            this.formTeam = this.shadowRoot.querySelector("#team");
            this.formTeam.addEventListener("submit", this.myWorkerTeam.bind(this));
            this.formSkill = this.shadowRoot.querySelector("#skill");
            this.formSkill.addEventListener("submit", this.myWorkerSkill.bind(this));
            this.formModulo = this.shadowRoot.querySelector("#modulo");
            this.formModulo.addEventListener("submit", this.myWorkerModulo.bind(this));
            this.formEvaluacion = this.shadowRoot.querySelector("#evaluacion");
            this.formEvaluacion.addEventListener("submit", this.myWorkerEvaluacion.bind(this));

            /* Workers para listar opciones de los selects */
            /* Worker team */
            this.select = this.shadowRoot.querySelector("#idTeam");
            let ws = new Worker("src/workers/wsTeam.js", {type: "module"});
            ws.postMessage({ accion: "showTeams"});
            ws.addEventListener("message", (e) => {
                this.select.insertAdjacentHTML("beforeend", e.data);
                ws.terminate();
            });
            /* Worker skills */
            this.skills = this.shadowRoot.querySelector("#idSkill");
            let wsSkill = new Worker("src/workers/wsSkill.js", {type: "module"});
            wsSkill.postMessage({ accion: "showSkills"});
            wsSkill.addEventListener("message", (e) => {
                this.skills.insertAdjacentHTML("beforeend", e.data);
                wsSkill.terminate();
            });
            /* Worker modulos */
            this.modulos = this.shadowRoot.querySelector("#idModulo");
            let wsModulo = new Worker("src/workers/wsModulo.js", {type: "module"});
            wsModulo.postMessage({ accion: "showModulos"});
            wsModulo.addEventListener("message", (e) => {
                this.modulos.insertAdjacentHTML("beforeend", e.data);
                wsModulo.terminate();
            });
            /* Worker Recruiters */
            this.recruiters = this.shadowRoot.querySelector("#idrecluta");
            let wsEvaluacion = new Worker("src/workers/wsEvaluacion.js", {type: "module"});
            wsEvaluacion.postMessage({ accion: "showRecruiters"});
            wsEvaluacion.addEventListener("message", (e) => {
                this.recruiters.insertAdjacentHTML("beforeend", e.data);
                wsEvaluacion.terminate();
            });
        })
    }
}
customElements.define(config.name(MyForm.url), MyForm)