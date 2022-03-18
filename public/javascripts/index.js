function displayForm(){
    const newAnswer = document.getElementById("newanswer");
    const modal = document.querySelector(".modalForm");
    newAnswer.addEventListener("click",()=>{
        //console.log("clicked")
        modal.style.display="block"
    })
}
function cancelAnswer() {
    const cancel = document.querySelectorAll("#cancel");
    const modal = document.querySelectorAll(".modal");
    for (let i = 0; i < cancel.length; i++) {
        cancel[i].addEventListener("click", () => {
            console.log("clicked")
            modal[i].style.display = "none"
        })
    }
}


function displayAnswer(){
    const edit = document.querySelectorAll(".edit");
    //console.log(edit)
    const modal = document.querySelectorAll(".modalEdit");
    //console.log(modal)
    for(let i = 0; i < edit.length; i++){
        edit[i].addEventListener("click",()=>{
            //console.log("clicked")
            //modal.style.display="block"
            //for(let j = i; j <= edit.length;j++){
                modal[i].style.display="block"
            //}
        })
    }
}

function deleteAnswer(){
    const deleteButton = document.querySelectorAll(".delete");
    const modal = document.querySelectorAll(".modalDelete");
    const yes = document.querySelectorAll(".yes")
    for(let i = 0; i < deleteButton.length; i++){
        deleteButton[i].addEventListener("click",(e)=>{
            e.preventDefault()
            //console.log("clicked")
            modal[i].style.display="block"
        })
    }
}
document.addEventListener("DOMContentLoaded", (event) => {
    displayForm();
    displayAnswer();
    cancelAnswer();
    deleteAnswer();

});
