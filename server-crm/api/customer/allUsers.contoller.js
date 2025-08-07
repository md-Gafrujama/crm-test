import prisma from "../../prisma/prismaClient.js";

const allUsersDetail = {
    async allData(req, res) {
        try {
            
            const companyId = req.user.companyId; 
            const users = await prisma.user.findMany({
                where:{
                    companyId :companyId
                }});
            if (!users || users.length === 0) {
                return res.status(404).json({
                    message: "No users found."
                });
            } else {
                return res.status(200).json(users);
            }

        }
        catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
        }
    }
}

export default allUsersDetail;