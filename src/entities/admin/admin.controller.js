import { generateResponse } from '../../lib/responseFormate.js';
import  User  from '../auth/auth.model.js';
import Blog from '../blog/blogModel.js';
import Contract from '../contract/contract.model.js';
import { getMonthlyActiveUsers } from './admin.service.js';

const adminManagement = async(req, res) =>{

    try{
        const totalUsers = await User.countDocuments();
        const totalMessages = await Contract.countDocuments();
        const totalBlogs = await Blog.countDocuments();



        generateResponse(res, 200, true, "Admin all data get successfully", {totalUsers, totalMessages, totalBlogs})
    }catch(error){
       generateResponse(res, 404, false, "Check error and fix them: ", error);
    }

}

const getMonthlyActiveUsersController =async (req, res) => {
  try {
    const { year } = req.query;
    const selectedYear = year ? Number(year) : new Date().getFullYear();

    const result = await getMonthlyActiveUsers(selectedYear);

    generateResponse(res, 200, true, 'Monthly active users retrieved successfully', result);
    } catch (error) {
        console.error(error);
        generateResponse(res, 500, false, 'Failed to retrieve monthly active users', error.message);
    }
    
};


export { adminManagement, getMonthlyActiveUsersController };