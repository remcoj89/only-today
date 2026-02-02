export async function sendBlockedNotificationEmail(email: string) {
  // TODO: Implementeer met je e-mail provider (SendGrid, Resend, etc.)
  // Voor nu: log naar console in development en test
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    console.log(`[EMAIL] Account blocked notification would be sent to: ${email}`);
    return;
  }

  // Production implementatie hier
  // await emailProvider.send({
  //   to: email,
  //   subject: "Your account has been suspended",
  //   template: "account-blocked",
  // });
}
