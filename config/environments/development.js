var nconf = require('nconf');
nconf.set('url', 'localhost');

nconf.set('database', {
  user: 'username',
  password: 'password',
  server: 'localhost'
});
