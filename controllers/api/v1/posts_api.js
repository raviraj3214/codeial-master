const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = function (req, res) {
    return res.json({
        message: "list of posts",
        posts: []
    });
}

module.exports.destroy = async function (req, res) {
    try {

        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            await post.deleteOne();
            await Comment.deleteMany({post: req.params.id});

            return res.status(200).json({
                message:"post deleted successfully"
            })

        }else{
            return res.status(401).json({
                message: "you cannot delete post"
            })
        }
        // console.log("req params id: " ,req.params.id);
        // console.log("post user: ",post.user);
        // console.log("logged in user: ", req.user.id);
        // return res.status(200).json({
        //     message:"post details",
        //     posts: post,
        // })

    }catch(err){
        console.log('** error: ', err);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}