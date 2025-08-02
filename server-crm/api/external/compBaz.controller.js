import prisma from "../../prisma/prismaClient.js"

const compareBaz = {
    async form(req, res) {
        try {
            const { userFirstName, userLastName, comment } = req.body;

            const qb2bform = await prisma.compare.create({
                data: {
                    firstName: userFirstName,
                    lastName: userLastName,
                    comment,
                },
            });

            return res.status(201).json({
                message: "Your comment has been send.",
            });

        } catch (error) {
            console.error("Something went wrong", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },

    async getForm(req, res) {
        try {
            const comments = await prisma.compare.findMany();
            return res.status(200).json(comments);
        } catch (error) {
            console.error("Error fetching data", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },

    async delComparebazar(req, res) {
        try {
            const { uid, userType } = req.user;
            const alertId = req.params.id;
            if (userType !== 'admin') {
                return res.status(403).json({
                    message: "Forbidden: Only admins can delete data.",
                });
            }

            const deleted = await prisma.compare.delete({
                where: {
                    id: alertId, 
                },
            });

            return res.status(200).json({
                message: "Data deleted successfully",
                deleted,
            });
        } catch (error) {
            console.error("Error deleting data", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }

}

export default compareBaz;