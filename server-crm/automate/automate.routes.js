import cron from "node-cron";
import { deleteOldAlerts, alertsOfTheDay } from "./automate.controller.js";
import { config as configDotenv } from "dotenv";
import axios from "axios";

cron.schedule("50 11 * * *", async () => {
  try {
    await deleteOldAlerts();
    console.log("Old alerts deleted successfully.");
  } catch (error) {
    console.error("Error while deleting old alerts:", error);
  }
});


async function sendWhatsAppMessage(topic, time, description) {
  try {
    await axios({
      url: process.env.WA_LINK,
      method: "post",
      headers: {
        "Authorization": `Bearer ${process.env.WA_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: process.env.PHONE,
        type: "text",
        text: {
          body: `You have saved a reminder for ${topic} at ${time} and it is all about ${description}. Hope you don't miss out.`
        }
      }
    });
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
}

cron.schedule("*/4 * * * *", async () => {
  const start = Date.now();

  try {
    const alerts = await alertsOfTheDay();


    if (alerts && alerts.length > 0) {
      for (const alert of alerts) {
        
        const topic = alert.topic || "No topic available";
        const time = alert.time || "No time available";
        const description = alert.description || "No description available";

        await sendWhatsAppMessage(topic, time, description);
      }
    } else {
      console.log("No alerts to send at this time.");
    }

    const end = Date.now();
    const duration = end - start;
    console.log(`Cron job finished in ${duration}ms`);

  } catch (error) {
    console.error("Error while fetching alerts of the day:", error);
  }
});
