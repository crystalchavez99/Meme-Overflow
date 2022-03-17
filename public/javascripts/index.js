// function answerForm() {
//     const newAnswer = document.getElementById("newanswer");
//     const modal = document.querySelector(".modalForm");
//     newAnswer.addEventListener("click", () => {
//         console.log("clicked")
//         modal.style.display = "block"
//     })
// }

// const { application } = require("express");
// const { Json } = require("sequelize/types/lib/utils");

// function commentForm() {
//     const newComment = document.querySelectorAll(".newcomment");
//     const modal = document.querySelectorAll(".modalComment");
//     for (let i = 0; i < newComment.length; i++) {
//         newComment[i].addEventListener("click", () => {
//             modal[i].style.display = "block"
//         })
//     }
// }

// const editSubmit = document.getElementById("editSubmit");
// const answerBlock = document.querySelector("#answer");
// const editAnswer = e=>{
//     const input = document.querySelector("#title");
//     const value = input.value;
//     const title = document.getElementsByClassName("title");
//     title.innerText = value;
// }

function editAnswer() {
    const edit = document.querySelectorAll(".edit");
    //console.log(edit)
    const modal = document.querySelectorAll(".modalEdit");
    //console.log(modal)
    for (let i = 0; i < edit.length; i++) {
        edit[i].addEventListener("click", () => {
            modal[i].style.display = "block"
        })
    }
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
function deleteAnswer() {
    const deleteButton = document.querySelectorAll(".delete");
    console.log(deleteButton)
    const modal = document.querySelectorAll(".modalDelete");

    for (let i = 0; i < deleteButton.length; i++) {
        deleteButton[i].addEventListener("click", () => {
            console.log("clicked")
            modal[i].style.display = "block"
        })
    }
}


// function hide() {
//     const modal = document.querySelector(".modal");
//     console.log("click")
//     modal.style.display = "none";
// }

function newForm() {
    const form = document.getElementById("newForm");
    // const h2 = document.createElement("h2");
    // h2.innerText = "Your Answer";
    const modal = document.querySelector(".modal");
    //modal.appendChild(h2);
    modal.style.display = "block"
    // const cancel = document.querySelectorAll("#class");
    // cancel.addEventListener("click", hide)
}
//const title = document.getElementById("title")

function submitForm() {
    console.log("submitformfunctionran")
    const form = document.querySelector("#newAnswerForm")
    console.log(form, "=====================");
    // for (let i = 0; i < form.length; i++) {
    form.addEventListener("submit", async (e) => {
        console.log("submitformclicked")
        e.preventDefault()
        const formData = new FormData(form)
        const title = formData.get("title")
        const memeUrl = formData.get("memeUrl")
        const questionId = formData.get("questionId")
        console.log(title, memeUrl, "=====THIS IS THE TITLE  +  URL =========")
        const body = JSON.stringify({ title: title, memeUrl: memeUrl, questionId: questionId})
        const res= await fetch(`/answers`, {
            method: "POST",
            body,
            headers:{
                "Content-Type":'application/JSON'
            }
        })

        //how to render?
        const { message}  = await res.json()
        // if (res.ok){
        //     console.log("+++++++RESPONSE IS OK+++++++")

        // }
        console.log(message, "RESPONSE MSG=========")
    });

    // }
}

// editSubmit.addEventListener("click",editAnswer)
document.addEventListener("DOMContentLoaded", (event) => {
    const newAnswer = document.getElementById("newanswer");
    newAnswer.addEventListener("click", newForm);
    submitForm();
    editAnswer();
    cancelAnswer();
    deleteAnswer();
    //commentForm()

});


//
