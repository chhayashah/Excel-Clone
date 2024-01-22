for(let i=0;i<rows;i++){
    for(let j=0;j<close;j++){
        let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",(e) => {
            let address = addressBar.value;
            let [activecell,cellProp]=getCellAndCellProp(address);
            let enteredDate=activecell.innerText;

            if (enteredDate===cellProp.value) return;

            cellProp.value=enteredDate;
            // if data modifies remove P-C relation, formula empty, update children with new hardcoded value
            removeChildParent(cellProp.formula);
            cellProp.formula=" ";
            updateChildrenCells(address);
        })
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async(e) => {
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula) {

        // if change in formula, break old P-C relation,evaluate new formula, add new P-C relation
        let address = addressBar.value;
        let [cell,cellProp] = getCellAndCellProp(address);
        if(inputFormula != cellProp.formula) removeChildParent(cellProp.formula);

        addChildToGraphComponent(inputFormula, address);
        // check formula cyclic or not
        // True -> cycle, False -> Not cyclic
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if (cycleResponse) {
            // alert("Your formula is cyclic");
            let response=confirm("Your formula is cyclic. Do you want to trace your path");
            while(response===true){
                // keep on tracking color until user is statisfied
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);
                response=confirm("Your formula is cyclic. Do you want to trace your path");

            }

            removeChildFromGraphComponent(inputFormula, address);
            return;
        }


        let evaluatedValue = evaluateFormual(inputFormula);

        // To update UI and cellProp in DB
        getCellAndCellProp(evaluatedValue,inputFormula, address);
        addChildToParent(inputFormula);
        console.log(sheetDB);

        updateChildrenCells(address);
    }
})

function addChildToGraphComponent(formula, childFormula) {
    let [crid,ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormla = formula.split(" ");
    for(let i=0;i<encodedFormla.length;i++){
        let asciiValue = encodedFormla[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormla[i]);
            // B1:A1+10
            // rid -> i, cid -> j
            graphComponentMatrix[prid][pcid].push([crid,ccid]);
        }
    }
}

function removeChildFromGraphComponent(formula,childAddress) {
    let [crid,ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormla = formula.split(" ");

    for(let i=0;i<encodedFormla.length;i++){
        let asciiValue = encodedFormla[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormla[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }

}

function updateChildrenCells(parentAddress){
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for(let i=0;i<children.length;i++){
        let childAddress=children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula=childCellProp.formula;

        let evaluatedValue=evaluateFormual(childFormula);
        setCellUIAndCellProp(evaluatedValue,childFormula,childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula){
    let childAddress = addressBar.value;
    let encodedFormla = formula.split(" ");
    for(let i=0;i<encodedFormla.length;i++){
        let asciiValue = encodedFormla[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <=90){
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormla[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1);
        }
    }
}

function removeChildParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormla = formula.split(" ");
    for(let i=0;i<encodedFormla.length;i++){
        let asciiValue = encodedFormla[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <=90){
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormla[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function evaluateFormual(formula) {
    let encodedFormla = formula.split(" ");
    for(let i=0;i<encodedFormla.length;i++){
        let activeValue = encodedFormla[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue<=90){
            let [cell,cellProp]=getCellAndCellProp(encodedFormla[i]);
        encodedFormla[i]=cellProp.value;
        }
        
    }
    let deccodedFormula = encodedFormla.join(" ");
    return eval(formula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address){
    // let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    // UI update
    cell.innerText = evaluatedValue;
    // DB update
    cellProp.value=evaluatedValue;
    cellProp.formula=formula;

}