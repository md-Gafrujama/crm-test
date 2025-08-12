import express from "express";
import prisma from "../../prisma/prismaClient.js";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";

const router = express.Router();
router.use(express.json());

router.get("/", jwtTokenMiddleware , async(req,res)=>{
    try{
        
        const companyId = req.user.companyId; 

        const user = await prisma.user.findMany({where:{companyId:companyId}});
        const company = await prisma.company.findMany({where:{id:companyId}});
        const leads = await prisma.Lead.findMany({where:{isCurrentVersion:true, companyId:companyId}});
        const userCount = await prisma.user.count({where:{companyId:companyId}});
        const leadsCount = await prisma.Lead.count({where:{isCurrentVersion:true,companyId:companyId}});
        const companyCount = await prisma.company.count();

        res.status(200).json({
           msg :" got data from mongodb",
           userData : user,
           companyData : company,
           leads : leads,
           userNumber : userCount,
           leadsNumber : leadsCount,
           company : companyCount
        })

    }
    catch(e){
        console.log(e);
        res.status(500).send(e);
    }

})

export default router;