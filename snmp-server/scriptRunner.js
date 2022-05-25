const { spawn } = require("child_process");

async function run(script){
    return await new Promise(resolve => {
        let output=[];
        let options={shell:true, cwd: "./scripts/"};
        let child=spawn(script, options);
        child.stdout.on("data",txt=>output.push(txt.toString().replace(/(\r\n|\n|\r)/gm, "").trim()));
        child.stderr.on("data",txt=>output.push(txt));
        child.on("close",()=>resolve(output.filter(chunk => chunk.length).join(";")));
    });
}

module.exports = function () {
    return {
        run: run
    }
};