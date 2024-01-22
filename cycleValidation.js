// storage -> 2D array
let collectedGraphComponent= [];
let graphComponentMatrix=[];

// for(let i=0;i<rows;i++){
//     let row = [];
//     for(let j=0;j<cols;j++){
//         //why array ->  more than 1 child relation(dependency)
//         row.push([]);

//     }
//     graphComponentMatrix.push(row);
// }

// True -> cyclic, False -> Not cyclic
function isGraphCyclic(graphComponentMatrix) {
    // Dependency -> visited, dfsVisited(2D array)

    let visited=[]; //Node visit trace
    let dfsVisited=[];//stack visit trace

    for(let i=0;i<rows;i++){
        let visitedRow=[];
        let dfsVisitedRow=[];
        for(let j=0;j<close;j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for(let i=0;i<rows;i++){
        for(let j=0;j<close;j++){
            if(visited[i][j] == false){
                let response=dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
             // found cycle so return immediately, no need to explore more path
            if(response==true)return [i, j];
            }
        }
    }
            
    return null;
}


// start -> vis(TRUE) dfsVis(TRUe)
// End -> dfsVis(FALSE)
// if vis[i][j] -> already explored path, so go back no use to explore again
// cycle detection condition -> if (vis[i][j] == true && dfsVis[i][j] ==true) -> cycle
// Return -> True/False
// True -> cyclic, False -> Not cyclic
function dfsCycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {
    visited[srcr][srcc] =true;
    dfsVisited[srcr][srcc]=true;

    // AI -> [[0,1],[1,0],[5,10],....]
    for(let children=0;children<graphComponentMatrix[srcr][srcc].length;children++){
        let[nbrr,nbrc]=graphComponentMatrix[srcr][srcc][children];
        if(visited[nbrr][nbrc] === false){
            let response = dfsCycleDetection(graphComponentMatrix,nbrr,nbrc,visited,dfsVisited)
            if(response === true) return true;//found cycle so return immediately, no need to explore more path
        }
        else if(visited[nbrr][nbrc] === true&&dfsVisited[nbrr][nbrc] === true){
            // found cycle so return immediately, no need to explore more path
            return true;
        }
    }
    
    dfsVisited[srcr][srcc]=false;
    return false;
}