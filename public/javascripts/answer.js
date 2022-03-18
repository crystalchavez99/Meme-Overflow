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
            //console.log("clicked")
            modal[i].style.display = "none"
        })
    }
}

function displayCommentForm(){
    const newComment = document.querySelectorAll(".newcomment");
    const modal = document.querySelectorAll(".modalComment");
    for (let i=0;i<newComment.length;i++){
        newComment[i].addEventListener("click", ()=>{
        modal[i].style.display = "block"
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

function displayDelete(){
    const deleteButton = document.querySelectorAll(".delete");
    const modal = document.querySelectorAll(".modalDelete");
    for(let i = 0; i < deleteButton.length; i++){
        deleteButton[i].addEventListener("click",(e)=>{
            e.preventDefault()
            const answer = e.target.id.split('-')[1];
            modal[i].style.display="block"
            //console.log(answer)
        })
    }
}

function deleteAnswer(){
    //console.log(answerId)
    //console.log("form ran")
    const yes = document.querySelectorAll(".yes");
    for(let i =0; i < yes.length; i++){
        yes[i].addEventListener("click",async(e)=>{
            e.preventDefault();
            const answerId = e.target.id.split('-')[1];
            console.log("ANSWER ID IN ANSWERScript.JS", answerId)
            const res = await fetch(`/answers/${answerId}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            //console.log("delete request sent",data)
            if(data.message === "Success"){
                const answerContainer = document.getElementById(`answer-${answerId}`);
                //console.log(answerContainer)
                answerContainer.remove()
            }
        })
    }


    // deleteForm.addEventListener("submit", async (e) => {
    //     console.log("submitformclicked")
    //     e.preventDefault()
    //     const formData = new FormData(deleteForm)
    //     // const title = formData.get("title")
    //     // const memeUrl = formData.get("memeUrl")
    //     // const questionId = formData.get("questionId")
    //     // console.log(title, memeUrl, "=====THIS IS THE TITLE  +  URL =========")
    //     // const body = JSON.stringify({ title: title, memeUrl: memeUrl, questionId: questionId })
    //     const res = await fetch(`/answers/${answer.id}/delete`, {
    //         method: "DELETE",
    //         headers: {
    //             "Content-Type": 'application/JSON'
    //         }
    //     })
    //     const data = await res.json();
    //     if(data.message==="success"){
    //         const container = document.getElementById(`answer-${answer.id}`)
    //         container.remove();
    //     }
    // })
}
document.addEventListener("DOMContentLoaded", (event) => {
    displayForm();
    displayAnswer();
    cancelAnswer();
    displayDelete();
    deleteAnswer();
    displayCommentForm();
});
