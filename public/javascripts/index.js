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
        const body = JSON.stringify({ title: title, memeUrl: memeUrl, questionId: questionId })
        const res = await fetch(`/answers`, {
            method: "POST",
            body,
            headers: {
                "Content-Type": 'application/JSON'
            }
        })

        //how to render?
        const { message } = await res.json()
        // if (res.ok){
        //     console.log("+++++++RESPONSE IS OK+++++++")

        // }
        //console.log(message, "RESPONSE MSG=========")
        if (message === "success") {
            //query select the containerDiv and save into variable
            const containerDiv = document.querySelector("#answerContainer")
            //use createelement to make a new answer div and save into variable
            const newAnswerDiv = document.createElement('div')
            //set the html of the variable that just created above to the html in the each loop with the new answer data
            const answerHtml = newAnswerDiv.map(
                ({ content }) => `
                <div id="answer">
                <p class="title">test21</p>
                <img src="https://images.firstpost.com/fpimages/1200x800/fixed/jpg/2016/05/Barney-380.jpg">
                <div>
                <button class="edit" type="submit"> Edit</button><div class="modalEdit modal" style="display: none;">
               <h2>Your Answer</h2>
               <form method="post" action="/answers/52/edit">
              <input type="hidden" name="_csrf" value="mJgVUXzK-7-bmhdv2dNsYCXdWVgbchCt-9PY">
                <label for="title">Title</label><input type="title" name="title" id="title" value="test21">
                <label for="memeUrl">Upload Image</label><input type="url" name="memeUrl" id="memeUrl" value="https://images.firstpost.com/fpimages/1200x800/fixed/jpg/2016/05/Barney-380.jpg">
                <button type="submit" id="editSubmit">Submit</button></form><button id="cancel">Cancel</button>
                </div>
                <button class="delete" type="submit"> Delete</button>
                <div class="modalDelete modal" style="display: block;"><form method="post" action="/answers/52/delete">
                <input type="hidden" name="_csrf" value="mJgVUXzK-7-bmhdv2dNsYCXdWVgbchCt-9PY"><p>Do you want to delete this answer?</p>
                <button type="submit">Yes</button>
                </form>
                <button id="cancel">No</button>
                </div>
                </div>'
                `
            )
            //this varaible now contains the html needed and use appendchild to put inside the containerDiv
            const newVar = containerDiv.appendChild(answerHtml)
            //after we appendchild, queryselect the new edit button as well as delete button and add event listener to show the form
            const  document.querySelector()
            const postEle = document.getElementById(`answer`)
            console.log("===SHOW=== ")
            postEle.innerHTML = answer
        }
    });
    // }


    // document.addEventListener("DOMContentLoaded", async () => {
    //     try {
    //       const res = await fetch("http://localhost:8080/tweets");
    //       const { tweets } = await res.json();

    //       const tweetsContainer = document.querySelector("#tweets-container");
    //       const tweetsHtml = tweets.map(
    //         ({ message }) => `
    //         <div class="card">
    //           <div class="card-body">
    //             <p class="card-text">${message}</p>
    //           </div>
    //         </div>
    //       `
    //       );
    //       tweetsContainer.innerHTML = tweetsHtml.join("");
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   });
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
