import prisma from "../../prisma/prismaClient.js";
import {
  fetchLeadsByUser,
  fetchTimelyLeadsByUser,
  createLead,
  deleteLeadById,
  updateLeadById,
  fetchLeadWithHistory,
} from "./leads.services.js";
import {
  convertLeadsToCSV,
  convertStringToISODateString,
} from "../../utilis/csvExporter.js";

const leadsWork = {
  async addLeads(req, res) {
    try {
      const { uid, username, companyId } = req.user;
      const {
        title,
        customerFirstName,
        customerLastName,
        emailAddress,
        phoneNumber,
        companyName,
        jobTitle,
        topicOfWork,
        industry,
        status,
        serviceInterestedIn,
        closingDate,
        notes,
      } = req.body;

      const closingDateISO = convertStringToISODateString(closingDate);
      if (!closingDateISO) {
        return res.status(400).json({ error: "Invalid closingDate" });
      }

      const lead = await createLead({
        uid,
        companyId: "0",
        username,
        title,
        customerFirstName,
        customerLastName,
        emailAddress,
        phoneNumber,
        companyName,
        jobTitle,
        topicOfWork,
        industry,
        status,
        serviceInterestedIn,
        closingDate: closingDateISO,
        notes,
        companyId,
      });

      res.status(201).json(lead);
    } catch (error) {
      console.error("Create Lead Error:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  },

  async getLeads(req, res) {
    try {
      const { uid, userType, username, companyId } = req.user;

      const cacheKey = `leadsData:${uid}:${companyId}`;
      const cachedLeads = await client.get(cacheKey);

      if (cachedLeads) {
        return res.status(200).json({
          message: "Fetched leads data from cache.",
          leads: JSON.parse(cachedLeads),
        });
      }

      const leads = await fetchLeadsByUser(uid, userType, username, companyId);

      await client.set(cacheKey, JSON.stringify(leads), "EX", 600);

      return res.status(200).json({
        message: "Fetched leads data from database.",
        leads: leads,
      });
    } catch (error) {
      console.error("Get Leads Error:", error);
      return res.status(500).json({
        error: "Failed to fetch leads",
      });
    }
  },

  async getLeadsWeekly(req, res) {
    try {
      const today = new Date();
      const { uid, userType, username, companyId } = req.user;
      const leads = await fetchTimelyLeadsByUser(
        uid,
        userType,
        username,
        companyId
      );
      res.status(200).json(leads);
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong in the server.",
        error: error.message || error,
      });
    }
  },

  async getLeadsMonthly(req, res) {
    try {
      const today = new Date();
      const { uid, userType, username, companyId } = req.user;
      const leads = await fetchTimelyLeadsByUser(
        uid,
        userType,
        username,
        companyId,
        today
      );
      res.status(200).json(leads);
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong in the server.",
        error: error.message || error,
      });
    }
  },

  async delLeads(req, res) {
    try {
      const lead = await deleteLeadById(req.params.id);
      res.status(200).json(lead);
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Lead not found" });
      } else {
        res
          .status(500)
          .json({ error: "Failed to delete lead", details: error.message });
      }
    }
  },

  async upLeads(req, res) {
    try {
      const { username, companyId } = req.user;
      const { id: _id, closingDate, ...restUpdateData } = req.body;

      let closingDateISO;
      if (closingDate) {
        closingDateISO = convertStringToISODateString(closingDate);
        if (!closingDateISO) {
          return res.status(400).json({ error: "Invalid closingDate" });
        }
      }

      const updateData = {
        ...restUpdateData,
        ...(closingDateISO && { closingDate: closingDateISO }),
      };

      const lead = await updateLeadById(req.params.id, username, updateData);
      res.status(200).json(lead);
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Lead not found" });
      } else {
        res
          .status(500)
          .json({ error: "Failed to update lead", details: error.message });
      }
    }
  },

  async getLeadHistory(req, res) {
    try {
      const { id } = req.params;
      const leadData = await fetchLeadWithHistory(id);
      res.status(200).json(leadData);
    } catch (error) {
      console.error("Fetch Lead History Error:", error);
      res.status(404).json({ error: "Lead not found", details: error.message });
    }
  },
};
export default leadsWork;
