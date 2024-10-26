
function binaryConvertor(number) {
    let binary = [];
    let index =0

    while(number > 0){
       binary += number %2;
       number = parseInt(number / 2);
    }

    let newBinary = [];
    for(let i = binary.length -1; i >= 0; i--){
        newBinary[index++] = binary[i]
    }
    return newBinary.join("")
}

function displayBinary() {
    let userText  = document.getElementById('usertext').value;
    let userOutput = document.getElementById('binaryText');
    userOutput.innerHTML =  userText + " in Binary is <br><br>"+ binaryConvertor(userText).fontsize(20).fontcolor("lightblue");
}