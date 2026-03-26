const bcrypt = require('bcryptjs');
const hash = '$2b$10$XWkF6szjee0x5IG9cK0SqeCy6BchWxuZsqoCupt8NnFMcy/.bq40S';
const password = 'adminpassword';

bcrypt.compare(password, hash).then(res => {
  console.log('Match:', res);
});
