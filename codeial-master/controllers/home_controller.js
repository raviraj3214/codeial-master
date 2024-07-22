const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function (req, res) {
    try {
        let posts = await Post.find({}).sort('-createdAt')
        .populate('user')
            .populate({
                path: 'comments likes',
                populate: {
                    path: 'user likes',
                },
                // populate:{
                //     path:'likes'
                // }
            })
            .populate('likes')
            .exec()


            if(req.isAuthenticated()){
                let users = await User.find({});
                let user = await User.findById(req.user._id)
                .populate({
                    path: 'friendships',
                    populate: {
                        path: 'from_user to_user',
                    }
                })


                let friends =await  user.friendships;
                // let friends = await user.populate('friendships');
                // console.log(friends)
                return res.render('home', {
                    title: "posts",
                    subtitle: "Home",
                    posts: posts,
                    all_users: users,
                    friends: friends
                });

            }else{
                let users = await User.find({});
                return res.render('home', {
                    title: "posts",
                    subtitle: "Home",
                    posts: posts,
                    all_users: users,
                });
            }
    } catch (err) {
        return console.log("Err", err);
    }
}