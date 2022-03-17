function answerForm(){
    const newAnswer = document.getElementById("newanswer");
    const modal = document.querySelector(".modalForm");
    newAnswer.addEventListener("click",()=>{
        console.log("clicked")
        modal.style.display="block"
    })
}

function commentForm(){
    const newComment = document.querySelectorAll(".newcomment");
    const modal = document.querySelectorAll(".modalComment");
    for(let i = 0; i < newComment.length; i++){
        newComment[i].addEventListener("click",()=>{
            modal[i].style.display="block"
        })
    }
}



function editAnswer(){
    const edit = document.querySelectorAll(".edit");
    //console.log(edit)
    const modal = document.querySelectorAll(".modalEdit");
    //console.log(modal)
    for(let i = 0; i < edit.length; i++){
        edit[i].addEventListener("click",()=>{
            console.log("clicked")
            //modal.style.display="block"
            //for(let j = i; j <= edit.length;j++){
                modal[i].style.display="block"
            //}
        })
    }
}



function cancelAnswer(){
    const cancel = document.getElementById("cancel");
    const modal = document.querySelector(".modal");
    cancel.addEventListener("click",()=>{
        console.log("clicked")
        modal.style.display="none"
    })
}
function deleteAnswer(){
    const deleteButton = document.querySelectorAll(".delete");
    const modal = document.querySelectorAll(".modalDelete");

    for(let i = 0; i < deleteButton.length; i++){
        deleteButton[i].addEventListener("click",()=>{
            console.log("clicked")
            //modal.style.display="block"
            //for(let j = i; j <= edit.length;j++){
                modal[i].style.display="block"
            //}
        })
    }
}
document.addEventListener("DOMContentLoaded", (event) => {
    answerForm();
    editAnswer();
    cancelAnswer();
    deleteAnswer();
    commentForm()
});
