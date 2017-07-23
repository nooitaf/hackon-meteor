Accounts.emailTemplates.siteName = 'hackon';
Accounts.emailTemplates.from = 'hackon enrollment <noreply@hackon.nl>';
Accounts.emailTemplates.enrollAccount.subject = (user) => {
  return `welcome to hackon, ${user}`;
};
Accounts.emailTemplates.enrollAccount.text = (user, url) => {
  return ' To activate your account, simply click the link below:\n\n' + url;
};
Accounts.emailTemplates.resetPassword.from = () => {
  // Overrides the value set in `Accounts.emailTemplates.from` when resetting
  // passwords.
  return 'hackon passwd reset <noreply@hackon.nl>';
};
Accounts.emailTemplates.verifyEmail = {
   subject() {
      return "Activate your account now!";
   },
   text(user, url) {
      return `Hey ${user}! Verify your e-mail by following this link: ${url}`;
   }
};
Accounts.urls.resetPassword = (token) => {
  return Meteor.absoluteUrl(`reset-pw/${token}`);
};
