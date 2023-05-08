import delete_users from "./deleteData.js";
import edit_users from  "./editData.js";

export default {
    wsGet: new Worker("/src/workers/wsPost.js", {type:"module"}),
    printData(){
        window.addEventListener("DOMContentLoaded", (e)=>{
          const dialog = document.querySelector("#my-dialog");
          this.wsGet.postMessage({ accion: "showAll"});
          this.wsGet.addEventListener("message", (e) => {
            document.querySelector(".tablebody").insertAdjacentHTML("beforebegin", e.data);
            let delete_button = document.querySelectorAll(".delete");
            let edit_button = document.querySelectorAll(".edit");
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
            this.wsGet.terminate()
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