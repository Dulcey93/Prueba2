import delete_users from "./deleteData.js";
import edit_users from  "./editData.js";

export default {
    wsGet: new Worker("/src/workers/wsPost.js", {type:"module"}),
    wsTeam: new Worker("/src/workers/wsTeam.js", {type:"module"}),
    wsSkill: new Worker("/src/workers/wsSkill.js", {type:"module"}),
    wsModulo: new Worker("/src/workers/wsModulo.js", {type:"module"}),
    wsEvaluacion: new Worker("/src/workers/wsEvaluacion.js", {type:"module"}),
    printData(){
        window.addEventListener("DOMContentLoaded", (e)=>{
          const dialog = document.querySelector("#my-dialog");
          // Reclutas tabla
          this.wsGet.postMessage({ accion: "showAll"});
          this.wsGet.addEventListener("message", (e) => {
            document.querySelector("#reclutaBody").insertAdjacentHTML("beforebegin", e.data);
            // Seleccionamos todos los botones dentro de la tabla reclutas
            const delete_button = document.querySelectorAll(".recluta .delete");
            const edit_button = document.querySelectorAll(".recluta .edit");
            delete_button.forEach((element) => {
              element.addEventListener("click", () => {
                delete_users.getEvent(element)
              });
            });
            edit_button.forEach((element) => {  
                element.addEventListener("click", () => {
                  edit_users.editEvent(element)
                  dialog.showModal();
                });
              });
            this.wsGet.terminate();
          });
          
          // Team Tabla
          this.wsTeam.postMessage({ accion: "showAll"});
          this.wsTeam.addEventListener("message", (e) => {
            document.querySelector("#teamBody").insertAdjacentHTML("beforebegin", e.data);
            // Seleccionamos todos los botones dentro de la tabla team
              
            this.wsTeam.terminate();
          });

          // Skill Tabla
          this.wsSkill.postMessage({ accion: "showAll"});
          this.wsSkill.addEventListener("message", (e) => {
            document.querySelector("#skillBody").insertAdjacentHTML("beforebegin", e.data);
            this.wsSkill.terminate();
          });

          // Modulo Tabla
          this.wsModulo.postMessage({ accion: "showAll"});
          this.wsModulo.addEventListener("message", (e) => {
            document.querySelector("#moduloBody").insertAdjacentHTML("beforebegin", e.data);
            this.wsModulo.terminate();
          });
          
          // Evaluacion Tabla
          this.wsEvaluacion.postMessage({ accion: "showAll"});
          this.wsEvaluacion.addEventListener("message", (e) => {
            document.querySelector("#evaluacionBody").insertAdjacentHTML("beforebegin", e.data);
            this.wsEvaluacion.terminate();
          });
        })
    },
    changeView(){
        document.querySelector("#register").addEventListener("click", (e)=>{
            window.location.href = "/index.html";
        })
    },
    search(){
      const modal = document.querySelector("#my-dialog2")
      const search_button = document.querySelector(".search");
      const search_inputs = document.querySelector("#searchInput")
      const close_button = document.querySelector("#closeModal")
      search_button.addEventListener("click", ()=>{
        modal.showModal();
      })
      search_inputs.addEventListener("input", (e)=>{
        let modal = document.querySelector(".modalbody");
        let ws2 = new Worker("js/ws/wsSearch.js", {type: "module"});
        let data = e.target.value.trim();
        ws2.postMessage(data);
        ws2.addEventListener("message", (e)=>{
          if (e.data.data) {
            modal.innerHTML = null
            ws2.terminate();
          }else{
            let data = e.data;
            modal.innerHTML = data
            ws2.terminate();
          }
        })
      })
      close_button.addEventListener("click", (e)=>{
        modal.close();
      })
    }
}