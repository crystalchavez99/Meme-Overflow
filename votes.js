const db = require('./db/models');
const { asyncHandler } = require('./utils');

const updateVote = asyncHandler(async (answer, voterId, upvoted, downvoted, action) => {
    const answererId = answer.User.id;
    const answerer = await db.User.findByPk(answererId);
    let maxLikes = answerer.maxLikes;
    let currentLikes = answerer.currentLikes;

    // if user hasn't upvoted/downvoted the answer
    if (!upvoted && !downvoted) {
        await db.Upvote.create({
            userId: voterId,
            answerId: answer.id,
        });

        if (maxLikes === currentLikes) {
            await answerer.update(
                {
                    maxLikes: maxLikes + 1,
                    currentLikes: currentLikes + 1,
                }
            );
        } else {        // maxLikes > currentLikes
            await answerer.update(
                {
                    currentLikes: currentLikes + 1,
                }
            )
        }

    } else if (upvote.length === 1) {   // if user has upvoted
        await upvote[0].destroy();

        await answerer.update({
            currentLikes: currentLikes - 1,
        })
    } else {                            // if user has downvoted
        await downvote[0].destroy();

        await db.Upvote.create({
            userId: voterId,
            answerId,
        });

        currentLikes += 2;
        if (maxLikes < currentLikes) maxLikes = currentLikes;

        await answerer.update(
            {
                maxLikes: maxLikes,
                currentLikes: currentLikes,
            }
        );
    }

});
