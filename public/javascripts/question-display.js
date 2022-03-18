document.addEventListener("DOMContentLoaded", (e) => {
    const voteCounts = document.querySelectorAll(".vote-button-group span")
    const upvoteButtons = Array.from(document.querySelectorAll(".upvote-button"))

    upvoteButtons.forEach(upvoteButton => {
        upvoteButton.addEventListener("click", async (ev) => {
            const id = upvoteButton.id.split("upvote-")[1];
            const downvoteButton = document.getElementById(`downvote-${id}`);

            // animated buttons logic
            if (upvoteButton.classList.contains('voted')) {
                upvoteButton.classList.remove('voted');
            } else {
                if (downvoteButton.classList.contains('voted')) {
                    downvoteButton.classList.remove('voted');
                    upvoteButton.classList.add('voted');
                } else {
                    upvoteButton.classList.add('voted');
                }
            }

            const res = await fetch(`/answers/${id}/upvote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const { voteCount } = await res.json();
            const voteCountSpan = document.getElementById(`vote-count-${id}`)
            voteCountSpan.innerText = voteCount;
        })

    })
    const downvoteButtons = Array.from(document.querySelectorAll(".downvote-button"))

    downvoteButtons.forEach(downvoteButton => {
        downvoteButton.addEventListener("click", async (ev) => {
            const id = downvoteButton.id.split("downvote-")[1];
            const upvoteButton = document.getElementById(`upvote-${id}`);

            // animated buttons logic
            if (downvoteButton.classList.contains('voted')) {
                downvoteButton.classList.remove('voted');
            } else {
                if (upvoteButton.classList.contains('voted')) {
                    upvoteButton.classList.remove('voted');
                    downvoteButton.classList.add('voted');
                } else {
                    downvoteButton.classList.add('voted');
                }
            }

            const res = await fetch(`/answers/${id}/downvote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const { voteCount } = await res.json();
            const voteCountSpan = document.getElementById(`vote-count-${id}`)
            voteCountSpan.innerText = voteCount;
        })

    })

})
