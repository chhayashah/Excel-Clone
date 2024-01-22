let downloadBtn = document.querySelector(".download");
let openBtn=document.querySelector(".open");

// Download Task
downloadBtn.addEventListener("click", (e) => {
    let jsonData =JSON.stringify([sheetDB,graphComponentMatrix]);
    let file = new Blob([jsonData], {type: "application/json"});

    let a = document.createElement("a");
    a.href =URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
})

// open task(uplaod
openBtn.addEventListener("click", (e) => {
    // opens file explorer
    let input =document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change",(e) => {
        let fr=new FileReader();
        let files = input.files;
        let fileObj=files[0];

        fr.readAsText(fileObj);
        fr.addEventListener("load" ,(e) => {
            let readSheetDate = JSON.parse(fr.result);

            // basic sheet with default data will be created
            addSheetBtn.click();

            // sheetDB, graphComponent
            sheetDB=readSheetDate[0];
            graphComponentMatrix = readSheetDate[1];

            collectedSheetDB[collectedSheetDB.length-1] = sheetDB;
            collectedGraphComponent[collectedGraphComponent.length-1] = graphComponentMatrix;
        
            handleSheetProperties();
        })
    })
})