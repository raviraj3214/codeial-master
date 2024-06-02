const Comment = require('../models/comment');
const Post = require('../models/post');
const { post } = require('../routes');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function (req, res) {

    try {
        let post = await Post.findById(req.body.post)
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
            post.comments.push(comment);
            post.save();

            // Similar for comments to fetch the user's id AND email!
            comment = await comment.populate('user', 'name email');
            // commentsMailer.newComment(comment)

            // PUSHING THE EMAILS TASK/ FUNCTION INTO QUEUE/KUE
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log("error in creating a queue");
                    return;
                }

                console.log("job enqueued: ",job.id);
            })


            if (req.xhr){
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }

            res.redirect('/');//return to home page    
        }
    } catch (err) {
        return console.log("Err: ", err);
    }
}

module.exports.destroy = async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.id)//to find the comment
        let post = await Post.findById(comment.post)//to find the post from comment

        if (comment.user == req.user.id || post.user == req.user.id) {

            let postId = comment.post;

            //update the comments in postSchema
            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
           
            //deleting comment 
                comment.deleteOne()
                .then(() => {
                    console.log("comment deleted succesfully ");
                })

                // destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment.id, onModel: 'Comment'});
            
            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            
            req.flash('success', 'comment deleted successfully..');

            return res.redirect('back');
        } else {
            req.flash('error', 'cannot delete comment');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}