document.addEventListener("DOMContentLoaded", (e) => { // may leastin on evry page
    console.log("Content Loaded")
    const voteCounts = document.querySelectorAll(".vote-button-group span")
    const upvoteButtons = Array.from(document.querySelectorAll(".upvote-button"))

    upvoteButtons.forEach(upvoteButton => {
        // console.log(upvoteButton.id)
        upvoteButton.addEventListener("click", async (ev) => {
            // ev.preventDefault();
            const id = upvoteButton.id.split("-")[1];
            console.log(id)
            const res = await fetch(`/answers/${id}/upvote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const { voteCount } = await res.json();
            console.log("note count", voteCount)
            const voteCountSpan = document.getElementById(`vote-count-${id}`)
            voteCountSpan.innerText = voteCount;
        })

    })
    const downvoteButtons = Array.from(document.querySelectorAll(".downvote-button"))

    downvoteButtons.forEach(downvoteButton => {
        // console.log(upvoteButton.id)
        downvoteButton.addEventListener("click", async (ev) => {
            const id = downvoteButton.id.split("-")[1];
            const res = await fetch(`/answers/${id}/downvote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const { voteCount } = await res.json();
            console.log("note count", voteCount)
            const voteCountSpan = document.getElementById(`vote-count-${id}`)
            voteCountSpan.innerText = voteCount;
        })

    })

})
