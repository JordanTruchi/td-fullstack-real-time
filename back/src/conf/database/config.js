const {
  DATABASE_USER: user,
  DATABASE_PASSWORD: password,
  DATABASE_NAME: database,
  CLUSTER_NAME: cluster,
} = process.env,
  loginStirng = `mongodb+srv://${user}:${password}@${cluster}.szlbe.mongodb.net/${database}?retryWrites=true&w=majority`;

module.exports = loginStirng;