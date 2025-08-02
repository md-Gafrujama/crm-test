import { Parser } from "json2csv";

export function convertStringToISODateString(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toISOString();
}

export function convertLeadsToCSV(leads) {
  const fields = [
    "id", "title","username", "customerFirstName", "customerLastName", "emailAddress",
    "phoneNumber", "jobTitle", "topicOfWork", "industry", "status",
    "serviceInterestedIn", "closingDate", "notes"
  ];
  const parser = new Parser({ fields });
  return parser.parse(leads);
}

export function convertAlertsToCSV(alerts){
  const fields = [
    "id","uid","topic","remainder","date","time","descrition"
  ];
  const parser = new parser({fields});
  return parser.parse(alerts);
}