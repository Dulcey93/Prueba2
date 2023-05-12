import print from "./getData.js"
export default {
    editEvent(element) {
        let ws = new Worker("/src/workers/wsPost.js", { type: "module" });
        let select = document.querySelector("#teamId");
        let wsTeam = new Worker("/src/workers/wsTeam.js", { type: "module" });
        wsTeam.postMessage({ accion: "showTeams" });
        wsTeam.addEventListener("message", (e) => {
            select.innerHTML = e.data;
            wsTeam.terminate();
        });
        let data = element.classList[1];
        ws.postMessage({ accion: "getRecruiter", body: data });
        let form = document.querySelector("#editForm");
        ws.addEventListener("message", (e) => {
            let data = e.data;
            let { nombre, edad, telefono, email, adress, dateBorn, document, dateIn, teamId } = data;
            form.nombre.value = nombre;
            form.edad.value = edad;
            form.telefono.value = telefono;
            form.email.value = email;
            form.adress.value = adress;
            form.dateBorn.value = dateBorn;
            form.document.value = document;
            form.dateIn.value = dateIn;
            // Agregar la propiedad selected a la opcion que tenga el mismo valor que el teamId
            Array.from(select.options).forEach((option) => {
                if (option.value === teamId) {
                    option.selected = true;
                }
            });
            ws.terminate()
        });
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.target));
            let { nombre, edad, telefono, email, adress, dateBorn, document, dateIn, teamId } = data;
            edad = parseInt(edad);
            telefono = parseInt(telefono);
            document = parseInt(document);
            teamId = parseInt(teamId);
            data = { nombre, edad, telefono, email, adress, dateBorn, document, dateIn, teamId };
            data = [data, element.classList[1]];
            let ws = new Worker("/src/workers/wsPost.js", { type: "module" })
            ws.postMessage({ accion: "putData", body: data });
            ws.addEventListener("message", (e) => {
                console.log(e.data);
                ws.terminate()
            });
            print.printData();
        })
    }
}