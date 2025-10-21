import { generateResponse } from '../../lib/responseFormate.js';
import  User  from '../auth/auth.model.js';
import Blog from '../blog/blogModel.js';
import Contract from '../contract/contract.model.js';

const adminManagement = async(req, res) =>{

    try{
        const totalUsers = await User.countDocuments();
        const totalMessages = await Contract.countDocuments();
        const totalBlogs = await Blog.countDocuments();



        generateResponse(res, 200, true, "Admin all data get successfully", {totalUsers, totalMessages, totalBlogs, messages})
    }catch(error){
        res.status(404).json({
            success:false,
            message:"Check error why not work",
        })
    }




}

export default adminManagement;