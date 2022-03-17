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

// const editSubmit = document.getElementById("editSubmit");
// const answerBlock = document.querySelector("#answer");
// const editAnswer = e=>{
//     const input = document.querySelector("#title");
//     const value = input.value;
//     const title = document.getElementsByClassName("title");
//     title.innerText = value;
// }

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




function newForm(){
    const form = document.getElementById("newForm");
    const h2 = document.createElement("h2");
    h2.innerText = "Your Answer";
    const modal = document.querySelector(".modal");
    //modal.appendChild(h2);
    modal.style.display="block"
    // const cancel = document.getElementById("cancel");
    // cancel.addEventListener("click",{
    //     modal.style.display = "none";
    // });
}


// editSubmit.addEventListener("click",editAnswer)
document.addEventListener("DOMContentLoaded", (event) => {
    //answerForm();
    const newAnswer = document.getElementById("newanswer");
    //const cancel = document.querySelectorAll(".class");
    newAnswer.addEventListener("click",newForm)
    //cancel.addEventListener("click",hide)
    editAnswer();
    cancelAnswer();
    deleteAnswer();
    commentForm()

});
