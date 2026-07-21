/* ==========================================
   Invoice Merge Tool
   app.js
========================================== */

let mappingData = [];
let documentFiles = [];
let folderHandle = null;

// UI Elements
const excelInput = document.getElementById("excelFile");
const pickFolderBtn = document.getElementById("pickFolderBtn");
const mergeBtn = document.getElementById("startMergeBtn");

const excelInfo = document.getElementById("excelInfo");
const folderInfo = document.getElementById("folderInfo");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const log = document.getElementById("log");

// =======================================
// Logging
// =======================================

function addLog(message, type = "") {

    const line = document.createElement("div");

    if (type)
        line.className = type;

    line.textContent = message;

    log.appendChild(line);

    log.scrollTop = log.scrollHeight;

}

addLog("Application started");

// =======================================
// Progress
// =======================================

function setProgress(value, text) {

    progressBar.value = value;

    progressText.textContent = text;

}

// =======================================
// Enable Merge Button
// =======================================

function updateMergeButton() {

    if (
        mappingData.length > 0 &&
        documentFiles.length > 0
    ) {

        mergeBtn.disabled = false;

    }
    else {

        mergeBtn.disabled = true;

    }

}

// =======================================
// Excel Import
// =======================================

excelInput.addEventListener("change", loadExcel);

function loadExcel(event) {

    const file = event.target.files[0];

    if (!file)
        return;

    addLog("Reading Excel...");

    const reader = new FileReader();

    reader.onload = function(e){

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data,{type:"array"});

        const sheet = workbook.Sheets[
            workbook.SheetNames[0]
        ];

        mappingData = XLSX.utils.sheet_to_json(sheet);

        excelInfo.innerHTML =
            "<b>Loaded:</b> " +
            file.name +
            "<br><b>Total Rows:</b> " +
            mappingData.length;

        addLog(
            "Excel loaded (" +
            mappingData.length +
            " rows)",
            "success"
        );

        updateMergeButton();

    };

    reader.readAsArrayBuffer(file);

}

// =======================================
// Folder Picker
// =======================================

pickFolderBtn.addEventListener("click", pickFolder);

async function pickFolder(){

    try{

        folderHandle =
            await window.showDirectoryPicker();

        documentFiles=[];

        let pdfCount=0;
        let imageCount=0;

        for await (const entry of folderHandle.values()){

            if(entry.kind==="file"){

                const file=await entry.getFile();

                documentFiles.push(file);

                const ext=file.name
                    .split(".")
                    .pop()
                    .toLowerCase();

                if(ext==="pdf")
                    pdfCount++;

                if(
                    ext==="jpg" ||
                    ext==="jpeg" ||
                    ext==="png"
                )
                    imageCount++;

            }

        }

        folderInfo.innerHTML=
        `
        <b>Folder:</b> ${folderHandle.name}
        <br>
        <b>Total Files:</b> ${documentFiles.length}
        <br>
        PDFs: ${pdfCount}
        <br>
        Images: ${imageCount}
        `;

        addLog(
            "Folder loaded ("+
            documentFiles.length+
            " files)",
            "success"
        );

        updateMergeButton();

    }

    catch(err){

        addLog(
            "Folder selection cancelled",
            "warning"
        );

    }

}

// =======================================
// Merge Button
// =======================================

mergeBtn.addEventListener("click", startMerge);

function startMerge(){

    setProgress(
        10,
        "Preparing..."
    );

    addLog("");

    addLog(
        "Merge process will be implemented in the next step..."
    );

}