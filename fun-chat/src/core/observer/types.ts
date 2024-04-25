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
  messageDelete = 'messageDelete',
  messageEdit = 'messageEdit',
  openDialog = 'openDialog',
  updateDialog = 'updateDialog',
  openMessageEdit = 'openMessageEdit',
}

export default ObserverEvents;
