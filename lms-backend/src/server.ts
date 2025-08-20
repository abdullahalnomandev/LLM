import mongoose from 'mongoose';
import app from './app';
import { Server } from 'http';
import config from './config';

process.on("uncaughtException",error => {
  process.exit(1);
})

let server: Server;

const bootstrap = async () => {
  const { database_url, port } = config;

  try {
    await mongoose.connect(database_url as string);
    console.log('🛢️  Database connection successful');
    server = app.listen(port, () => {
      console.log(`✅ app listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect database ', err);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        console.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

bootstrap();

process.on("SIGTERM", () => {
  console.log("SIGTERM is received");
  if(server){
    server.close();
  }
})
