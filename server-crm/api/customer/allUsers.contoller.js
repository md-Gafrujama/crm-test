import prisma from "../../prisma/prismaClient.js";
// import client from "../../middleware/redis.middleware.js";

const allUsersDetail = {
  async allData(req, res) {
    try {
      const userType = req.user.userType;
      const companyId = req.user.companyId;

      if (userType !== "admin") {
        return res.status(200).json({
          msg: "You are not the admin so we cannot fetch the request data.",
        });
      }

      // const cacheKey = `usersData:${companyId}`;
      // const cachedData = await client.get(cacheKey);

      // if (cachedData) {
      //   return res.status(200).json({
      //     msg: "Fetched users data from cache.",
      //     users: JSON.parse(cachedData),
      //   });
      // }

      const users = await prisma.user.findMany({
        where: { companyId: companyId },
      });

      if (!users || users.length === 0) {
        return res.status(404).json({
          msg: "No users found.",
        });
      }

      // await client.set(cacheKey, JSON.stringify(users), "EX", 600); 
      return res.status(200).json({
        msg: "Successfully fetched users data from DB.",
        users: users,
      });

    } catch (error) {
      return res.status(500).json({
        msg: "Internal server error",
        error: error.message,
      });
    }
  },

  async onlyAdmin(req, res) {
    try {
      const companyId = req.user.companyId;
      const userType = req.user.userType;
      if (userType != "admin") {
        res.status(200).json({
          msg: "Sorry , you are unauthorized to get the data",
        });
        return;
      }
      const data = await prisma.User.findMany({
        where: {
          userType: "admin",
          companyId: companyId,
        },
      });
      const dataCount = await prisma.User.count({
        where: {
          userType: "admin",
          companyId: companyId,
        },
      });

      res.status(200).json({
        msg: "Data is extracted properly",
        data: data,
        dataCount: dataCount,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Cannot retirve the data",
        error: error.message || error,
      });
    }
  },

  async onlyUser(req, res) {
    try {
      const companyId = req.user.companyId;
      const userType = req.user.userType;
      if (userType != "admin") {
        res.status(200).json({
          msg: "Sorry , you are unauthorized to get the data",
        });
        return;
      }
      const data = await prisma.User.findMany({
        where: {
          role: "user",
          companyId: companyId,
        },
      });
      const dataCount = await prisma.User.count({
        where: {
          role: "user",
          companyId: companyId,
        },
      });

      res.status(200).json({
        msg: "Data is extracted properly",
        data: data,
        dataCount: dataCount,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Cannot retirve the data",
        error: error.message || error,
      });
    }
  },

  async onlyActive(req,res){
    const companyId = req.user.companyId;
    const userType = req.user.userType;
    try{

      if(userType!== "admin"){
        res.status(500).json({
          msg : "Sorry you are not an authorized person to get the data",
        })
        return;
      }
      
      const data = await prisma.User.findMany({where:{
        statusOfWork : "active",
        companyId : companyId,
      }})


      const dataCount = await prisma.User.count({where:{
        statusOfWork : "active",
        companyId : companyId,
      }})

      res.status(200).json({
        data: data,
        count : dataCount
      })
    }
    catch(error){
      res.status(500).json({
        msg:"Something went wrong in server. We will soon fix it",
        error: error.message || error
      })
    }
  },

  async onlyInactive(req,res){
    const companyId = req.user.companyId;
    const userType = req.user.userType;
    try{

      if(userType!== "admin"){
        res.status(500).json({
          msg : "Sorry you are not an authorized person to get the data",
        })
        return;
      }
      const data = await prisma.User.findMany({where:{
        statusOfWork : "active",
        companyId : companyId,
      }})

      
      const dataCount = await prisma.User.count({where:{
        statusOfWork : "" || "inactive",
        companyId : companyId
      }})

      res.status(200).json({
        data:data,
        count : dataCount
      })
    }
    catch(error){
      res.status(500).json({
        msg:"Something went wrong in server. We will soon fix it",
        error: error.message || error
      })
    }
  },
};

export default allUsersDetail;