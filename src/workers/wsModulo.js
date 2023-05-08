import api from "../../api/api.js";
let url = 'http://localhost:3000/moduloSkill';
let ws = {
    async showAll() {
        const data = await api.getData(url);
        let html = ``;
        data.forEach(element => {
            let {nombreModuloSkill, idSkill, id}= element;
            html += `
            <tr class="p-1">
                <td>${id}</td>
                <td>${nombreModuloSkill}</td>
                <td>${idSkill}</td>
                <td><button type="button" class="delete ${id} btn btn-light w-100">Delete</button></td>
                <td><button type="button" class="edit ${id} btn w-100">Edit</button></td>
            </tr>
            `
        });
        return [html];
    },
    async showModulos() {
        const data = await api.getData(url);
        let html = ``;
        data.forEach(element => {
            let {nombreModuloSkill, id}= element;
            html += `
            <option value="${id}">${nombreModuloSkill}</option>
            `
        });
        return [html];
    },
    async postOne(data) {
        const res = await api.postData(data, url);
        return console.log(res);
    },
    async deleteOne(id) {
        const res = await api.deleteData(id, url);
        return console.log(res);
    },
    async putData(data) {
        const res = await api.putData(data[0], data[1], url);
        return console.log(res);
    }
}

self.addEventListener("message", (e) => {
    Promise.resolve(ws[`${e.data.accion}`]((e.data.body) ? e.data.body : undefined)).then(res => postMessage(res));
})