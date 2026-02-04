import {ApplicationConfig} from '@loopback/core';
import {BibliotecaParte3Application} from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new BibliotecaParte3Application({
    rest: {
      port: 3001,
      host: '127.0.0.1',
    },
  });

  await app.boot();
  await app.start();

  console.log(`Server is running at ${app.restServer.url}`);
  return app;
}

if (require.main === module) {
  main().catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
