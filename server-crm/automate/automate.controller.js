import prisma from "../prisma/prismaClient.js"

export async function deleteOldAlerts() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  try {
    const result = await prisma.Alertsandremainder.deleteMany({
      where: {
        date: {
          lt: sevenDaysAgo,
        },
      },
    });

    console.log(`Deleted ${result.count} old alerts.`);
  } catch (error) {
    console.error("Failed to delete old alerts:", error);
    throw error;
  }
}

export async function alertsOfTheDay() {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);


  try {
    const alerts = await prisma.alertsandremainder.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    console.log(`Found ${alerts.length} alerts for the day.`);

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const fiveMinutesLater = nowMinutes + 5;

    const upcomingAlerts = alerts.filter((alert) => {
      if (!alert.time) return false;

      const [hours, minutes] = alert.time.split(":").map(Number);
      const alertMinutes = hours * 60 + minutes;

      return alertMinutes >= nowMinutes && alertMinutes <= fiveMinutesLater;
    });

    console.log(`Found ${upcomingAlerts.length} upcoming alerts within the next 5 minutes.`);

    return upcomingAlerts;
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    throw error;
  }
}
