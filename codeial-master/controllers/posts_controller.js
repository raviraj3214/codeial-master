const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');


module.exports.create = async function (req, res) {
    // if(req.isAuthenticated()){
    // console.log(req.user);
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id,
        });

        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name');

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'post published!')
        return res.redirect('back');
    } catch (err) {
        return console.log("error in creating post: ", err);
    }
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id)
        if (post.user == req.user.id) {
            
            //to delete comments related to post
            await Comment.deleteMany({ post: post })//deletes many comments from Comment Schema
            
            await Like.deleteMany({likeable:req.params.id, onModel: 'Post'});
            await Like.deleteMany({likeable: post.comments});
            
            //to delete post
           await post.deleteOne()//delete the post in Post Schema
           console.log("post deleted successfully")
                
            // if the request is xhr then it will be passed to ajax
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'post deleted successfully');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err)
        return res.redirect('back');
    }
}