document.addEventListener("DOMContentLoaded", (e) => {

    const voteCounts = document.querySelectorAll(".vote-button-group span")
    const upvoteButtons = Array.from(document.querySelectorAll(".upvote button"))

    upvoteButtons.forEach(upvoteButton => {

        upvoteButton.addEventListener("click", async (ev) => {
            ev.preventDefault();
            const id = upvoteButton.id.split("-")[1];

            const res = await fetch(`/answers/${id}/upvote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            const newVoteCount = res.voteCount;
            const voteCountSpan = document.getElementById(`vote-count-${id}`)
            voteCountSpan.innerText = newVoteCount;
        })

    })


})
