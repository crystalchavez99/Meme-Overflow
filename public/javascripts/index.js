// function answerForm() {
//     const newAnswer = document.getElementById("newanswer");
//     const modal = document.querySelector(".modalForm");
//     newAnswer.addEventListener("click", () => {
//         console.log("clicked")
//         modal.style.display = "block"
//     })
// }

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
     console.log(edit)
     const modal = document.querySelectorAll(".modalEdit");
     console.log(modal)
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
     const modal = document.querySelectorAll(".modalDelete");

     for (let i = 0; i < deleteButton.length; i++) {
         deleteButton[i].addEventListener("click", () => {
             console.log("clicked")
             modal[i].style.display="block"
         })
     }
 }


function hide() {
    const modal = document.querySelector(".modal");
    console.log("click")
    modal.style.display = "none";
}

function newForm() {
    const form = document.getElementById("newForm");
    // const h2 = document.createElement("h2");
    // h2.innerText = "Your Answer";
    const modal = document.querySelector(".modal");
    //modal.appendChild(h2);
    modal.style.display = "block"
    const cancel = document.querySelectorAll("#class");
    cancel.addEventListener("click", hide)
}

async function submit() {
    console.log("click")
    const form = document.getElementById("newForm");
    const data = new FormData(form);
    await fetch(`/questions/${question.id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            memeUrl
        })
    }).then((res) => { return res.text() })
    return false;
}

// editSubmit.addEventListener("click",editAnswer)
document.addEventListener("DOMContentLoaded", (event) => {
    //answerForm();
    const newAnswer = document.getElementById("newanswer");
    //const submitButton = document.querySelectorAll("#submit");
    //const cancel = document.querySelectorAll("#class");
    newAnswer.addEventListener("click", newForm);
    //submitButton.addEventListener("click",submit);
    //cancel.addEventListener("click",hide)
    editAnswer();
    cancelAnswer();
    //deleteAnswer();
    //commentForm()

});
