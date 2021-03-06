'use strict'

const VotesComment = use('App/Model/VotesComment')
const Comment = use('App/Model/Comment.js')

class VotesCommentController {

	* vote (request, response) {
		let user = request.authUser
		let linkId = request.param('link_id')
		let commentId = request.param('comment_id')
		let data = {}
		data.user_id = Number(user.id)
		data.links_id = Number(linkId)
		data.comments_id = commentId

		const exists = yield VotesComment.query().table('votes_comments')
			.where("user_id", data.user_id).andWhere("comments_id", data.comments_id)

		if (exists.length === 0){
			let vote = yield VotesComment.create(data)
			yield vote.save()

			let comment =  yield Comment.findBy('id', data.comments_id)
			if (comment.votes === null){
				comment.votes = 1
			} else {
				comment.votes = comment.votes+1
				console.log(comment.votes)
			}
			yield comment.save()
			response.status(201).json([vote, comment])
		} else {
			response.status(403).json({text: "Can't vote for that again"})
		}



	}
}

module.exports = VotesCommentController
