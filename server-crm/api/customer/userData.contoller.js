import prisma from "../../prisma/prismaClient.js";

const data = {

    async getData(req, res) {
        try {
            const companyId = req.user.companyId; 
            const userId = req.user.uid;

            //not possible as we use token and i dont think we need this
            // if (!userId) {
            //     return res.status(400).json({
            //         success: false,
            //         message: "User ID not found in request",
            //     });
            // }

            const userData = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    username: true,
                    phoneNumber: true,
                    role: true,
                    userType: true,
                    //photo: true,
                    createdAt: true,
                    updatedAt: true,
                    assignedWork: true,
                    statusOfWork: true,
                    statusOfAccount: true,
                    companyId:true
                    //loggedInTime: true,
                },
            });

            if (!userData) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const allLeads = await prisma.Lead.count({
                where: {
                    uid: userId,
                    isCurrentVersion:true,
                    companyId:companyId
                }
            })

            const allNewLeads = await prisma.Lead.findMany({
                where: {
                    uid: userId,
                    status: "New",
                    isCurrentVersion:true,
                    companyId:companyId
                },
            });

            const allContacted = await prisma.Lead.findMany({
                where: {
                    uid: userId,
                    status: "Contacted",
                    isCurrentVersion:true,
                    companyId:companyId
                }
            })

            const allEngaged = await prisma.Lead.findMany({
                where: {
                    uid: userId,
                    status: "Engaged",
                    isCurrentVersion:true,
                    companyId:companyId
                }
            })

            const allQualified = await prisma.Lead.findMany({
                where: {
                    uid: userId,
                    status: "Qualified",
                    isCurrentVersion:true,
                    companyId:companyId
                }
            })

            const allProposalSent = await prisma.Lead.findMany({
                where: {
                    uid: userId,
                    status: "Proposal Sent",
                    isCurrentVersion:true,
                    companyId:companyId
                }
            })

            const allNegotiation = await prisma.Lead.findMany({
                where: {
                    uid: userId,
                    status: "Negotiation",
                    isCurrentVersion:true,
                    companyId:companyId
                }
            })

            const allClosedWon = await prisma.Lead.findMany({
                where: {
                    uid: userId,
                    status: "Closed Won",
                    isCurrentVersion:true,
                    companyId:companyId
                }
            })

            const allClosedLost = await prisma.Lead.findMany({
                where: {
                    uid: userId,
                    status: "Closed Lost",
                    isCurrentVersion:true,
                    companyId:companyId
                }
            })

            const allOnHold = await prisma.Lead.findMany({
                where: {
                    uid: userId,
                    status: "On Hold",
                    isCurrentVersion:true,
                    companyId:companyId
                }
            })

            const allDoNotContact = await prisma.Lead.findMany({
                where: {
                    uid: userId,
                    status: "Do Not Contact",
                    isCurrentVersion:true,
                    companyId:companyId
                }
            })

            res.status(200).json({
                success: true,
                message: "User and leads data retrieved successfully",
                data: {
                    user: userData,
                    allLeads: allLeads,
                    totalLeads: allLeads.length,
                    allNewLeads: allNewLeads,
                    newLeadsCount: allNewLeads.length,
                    allContacted: allContacted,
                    contactedCount: allContacted.length,
                    allEngaged: allEngaged,
                    engagedCount: allEngaged.length,
                    allQualified: allQualified,
                    qualifiedCount: allQualified.length,
                    allProposalSent: allProposalSent,
                    proposalSentCount: allProposalSent.length,
                    allNegotiation: allNegotiation,
                    negotiationCount: allNegotiation.length,
                    allClosedWon: allClosedWon,
                    closedWonCount: allClosedWon.length,
                    allClosedLost: allClosedLost,
                    closedLostCount: allClosedLost.length,
                    allOnHold: allOnHold,
                    onHoldCount: allOnHold.length,
                    allDoNotContact: allDoNotContact,
                    doNotContactCount: allDoNotContact.length,
                    total: allLeads.length
                }
            });
        }
        catch (error) {
            console.error("Error fetching user data:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }

    },
}

export default data;