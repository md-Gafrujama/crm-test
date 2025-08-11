import prisma from "../../prisma/prismaClient.js";

function formatDateToISO(date) {
  const isoDate = new Date(date);
  if (isNaN(isoDate.getTime())) {
    throw new Error("Invalid date format");
  }
  return isoDate.toISOString(); 
}
const alertController = {
  async createAlert(req, res) {
    try {
      const { uid, companyId } = req.user;
      const { alerttopic, reminder, alertdate, remindertime, description } =
        req.body;

      const alertData = await prisma.Alertsandremainder.create({
        data: {
          uid,
          topic: alerttopic,
          remainder: reminder,
          date: new Date(alertdate),
          time: remindertime,
          description,
          companyId,
        },
      });

      res.status(200).json(alertData);
    } catch (error) {
      console.error("Unable to add alert in server for now:", error);
      res.status(500).json({
        msg: error.message || "Internal server error",
      });
    }
  },

  async getAllAlert(req, res) {
    try {
      const { uid, userType } = req.user;
      const companyId = req.user.companyId;
      const query = {
        select: {
          id: true,
          uid: true,
          topic: true,
          remainder: true,
          date: true,
          time: true,
          description: true,
          companyId: true,
        },
      };

      if (userType !== "admin") {
        query.where = { uid };
      } else {
        query.where = { uid, companyId: companyId };
      }

      const alerts = await prisma.Alertsandremainder.findMany(query);

      return res.status(200).json({
        success: true,
        message: "Alerts retrieved successfully",
        data: alerts,
      });
    } catch (error) {
      console.error("Error fetching alerts:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving alerts",
        error: error.message,
      });
    }
  },

  async deleteAlert(req, res) {
    try {
      const { uid, userType } = req.user;
      const alertId = req.params.id;

      const alert = await prisma.Alertsandremainder.findUnique({
        where: { id: alertId },
      });

      if (!alert) {
        return res.status(404).json({
          success: false,
          message: "Alert not found",
        });
      }

      if (userType !== "admin" && alert.uid !== uid) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to delete this alert",
        });
      }

      await prisma.Alertsandremainder.delete({
        where: { id: alertId },
      });

      return res.status(200).json({
        success: true,
        message: "Alert deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting alert:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the alert",
        error: error.message,
      });
    }
  },

  async updateAlert(req, res) {
    try {
      const { uid, userType, companyId } = req.user;
      const alertId = req.params.id;
      const updateData = req.body;

      const alert = await prisma.Alertsandremainder.findUnique({
        where: { id: alertId },
      });

      if (!alert) {
        return res.status(404).json({
          success: false,
          message: "Alert not found",
        });
      }

      if (userType !== "admin" && alert.uid !== uid) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to update this alert",
        });
      }

      const { id, date, ...validUpdateData } = updateData;

      // Format 'date' if provided
      if (date) {
        try {
          validUpdateData.date = formatDateToISO(date); // Use the helper function
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid date format. Expected ISO-8601 format.",
          });
        }
      }

      const allowedFields = [
        "topic",
        "remainder",
        "date",
        "time",
        "description",
        "companyId",
      ];
      const validatedUpdateData = Object.keys(validUpdateData).reduce(
        (acc, key) => {
          if (allowedFields.includes(key)) {
            acc[key] = validUpdateData[key];
          }
          return acc;
        },
        {}
      );

      const updatedAlert = await prisma.Alertsandremainder.update({
        where: { id: alertId },
        data: validatedUpdateData,
      });

      return res.status(200).json({
        success: true,
        message: "Alert updated successfully",
        data: updatedAlert,
      });
    } catch (error) {
      console.error("Error updating alert:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the alert",
        error:
          process.env.NODE_ENV === "development" ? error.stack : error.message,
      });
    }
  },
};

export default alertController;
