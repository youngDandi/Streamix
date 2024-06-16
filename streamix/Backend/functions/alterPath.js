function alterPath(string){
    let aux;
    for (var i=0;i<string.length;i++){
        if(string[i] == "\\"){
        string[i] = "/";    
        }
        aux = aux + string[i];
    }
    return aux;
}

module.exports = {alterPath};