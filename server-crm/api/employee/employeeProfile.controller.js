import express from "express";
import prisma from "../../prisma/prismaClient.js";

const employeeProfile = {

    async getEmployee(req, res) {
        try {
            const empId = req.params.id;
            const empDetail = await prisma.Employee.findUnique({
                where: { id: empId },
            });

            if (!empDetail) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json(empDetail);
        }
        catch (error) {
            res.status(500).json({
                message: "There is an error",
                error: `${error}`
            })
        }
    },

    async updateEmployee(req, res) {
        try {
            const empId = req.params.id;
            const dataToUpdate = req.body;

            const updateEmployee = await prisma.Employee.update({
                where:{id:empId},
                data:dataToUpdate,
            })

            res.status(200).json(updateEmployee);
        }
        catch (error) {
            res.status(500).json({
                message: "There is an error",
                error
            })
        }
    },

    async deleteEmployee(Req, res) {
        try {
            const empId = req.params.id;
            
            await prisma.user.delete({
                where:{id:userId},
            });

            res.status(200).json({
                message:"Employee has been deleted."
            })
        }
        catch (error) {
            res.status(500).json({
                message: "There is an error",
                error
            })
        }
    }

}

export default employeeProfile