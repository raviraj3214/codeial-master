const Like = require('../models/like');
const Post = require('../models/post');
const Comments = require('../models/comment');


module.exports.toggleLike = async function(req, res){
    if(req.isAuthenticated()){

        try{
            
            let likeable;
            let deleted= false;

            // 
            if(req.query.type == 'Post'){
                likeable = await Post.findById(req.query.id).populate('likes');
            }else{
                likeable = await Comments.findById(req.query.id).populate('likes');
            }

            // 
            let existingLike = await Like.findOne({
                user: req.user.id,
                likeable: req.query.id,
                onModel: req.query.type
            })


            // 
            if(existingLike){

                likeable.likes.pull(existingLike.id);
                likeable.save();

                existingLike.deleteOne();

                deleted = true;

            }else{


                let newLikeable = await Like.create({
                    user: req.user.id,
                    likeable: req.query.id,
                    onModel: req.query.type
                });
                
                newLikeable.save()

                likeable.likes.push(newLikeable._id)

                likeable.save()

            }

            return res.status(200).json({
                message:"Request Successfull",
                data:{
                    deleted: deleted
                }
            })


        }catch(err){
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }else{

        console.log("Not Logged in");
        return res.status(500).json({
            message: "Not Logged in"
        })
    }
}