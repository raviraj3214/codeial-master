const Comment = require('../../../models/comment');
const Post = require('../../../models/post');
module.exports.index = async function (req, res) {

    try {

        let posts = await Post.find({});

        return res.status(200).json({
            message: "codial api version-2 all posts",
            allPosts: {
                posts
            }
        })

    } catch (err) {
        res.json({
            message: "error" + err
        });
    }
}


module.exports.destroy = async function (req, res) {
    try {
        // let post = Post.findById(req.params.id);
        await Post.findByIdAndDelete(req.params.id);

        await Comment.deleteMany({ post: req.params.id })

        let posts = await Post.find({});

        return res.status(200).json({
            message: "post deleted successfully",
            posts: {
                message: "posts length",
                data: posts
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            message: "internal server error"
        })
    }
}
