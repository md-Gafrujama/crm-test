import { google } from "googleapis";

export function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL_ONE
  );
}

export function getOAuthClientWithTokens(tokens) {
  const client = createOAuthClient();
  client.setCredentials(tokens);
  return client;
}
