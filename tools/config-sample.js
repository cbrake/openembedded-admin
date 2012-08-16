exports.config = {
  email: {
    transport: {
      type: 'SMTP',
      options: {
        host: "my-server.com",
        auth: {
          user: 'smtp-user',
          pass: 'password'
        }
      }
    },
    from: 'user@gmail.com'
  }
}

