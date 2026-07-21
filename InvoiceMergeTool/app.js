const pickFolderBtn = document.getElementById("pickFolder");
const status = document.getElementById("status");

let files = [];

pickFolderBtn.addEventListener("click", async () => {

    try {

        const directoryHandle = await window.showDirectoryPicker();

        files = [];

        for await (const entry of directoryHandle.values()) {

            if (entry.kind === "file") {

                const file = await entry.getFile();

                files.push(file);

            }

        }

        status.innerHTML = `
            <b>Folder:</b> ${directoryHandle.name}<br>
            <b>Total files:</b> ${files.length}
        `;

        console.log(files);

    }

    catch(err){

        console.log(err);

    }

});