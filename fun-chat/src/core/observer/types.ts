enum ObserverEvents {
  socketOpen = 'socketOpen',
  socketClose = 'socketClose',
  loginResponse = 'loginResponse',
  externalLoginResponse = 'externalLoginResponse',
  logoutResponse = 'logoutResponse',
  externalLogoutResponse = 'externalLogoutResponse',
  allActiveUsers = 'allActiveUsers',
  allInactiveUsers = 'allInactiveUsers',
  messageHistory = 'messageHistory',
  messageSend = 'messageSend',
  messageRead = 'messageRead',
  openDialog = 'openDialog',
}

export default ObserverEvents;
