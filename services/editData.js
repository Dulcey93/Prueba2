import print from "./getData.js"
export default{
    editEvent(element){
        console.log(element.classList[1]);
        let form = document.querySelector("#editForm");
        form.addEventListener("submit", (e)=>{
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.target));
            let {nombre, edad, telefono, email, adress, dateBorn, document, dateIn, teamId}= data;
            edad = parseInt(edad);
            telefono = parseInt(telefono);
            document = parseInt(document);
            teamId = parseInt(teamId);
            data = {nombre, edad, telefono, email, adress, dateBorn, document, dateIn, teamId};
            data = [data, element.classList[1]];
            let ws = new Worker("/src/workers/wsPost.js", {type: "module"})
            ws.postMessage({ accion: "putData", body: data });
            ws.addEventListener("message", (e) => {
                console.log(e.data);
                ws.terminate()
            });
            print.printData();
        })
    }
}