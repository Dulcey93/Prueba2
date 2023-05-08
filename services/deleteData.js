export default{
    getEvent(p1){
        p1.parentNode.parentNode.remove()
        let ws = new Worker("/src/workers/wsPost.js", {type: "module"})
        ws.postMessage({ accion: "deleteOne", body: p1.classList[1] });
        ws.addEventListener("message", (e) => {
            ws.terminate()
        });
    }
}