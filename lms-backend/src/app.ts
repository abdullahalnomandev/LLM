import express, { Application } from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routers from './routes';
import notFound from './middlewares/notFound.middleware';
import globalErrorHandler from './middlewares/globalErrorHandler.middleware';

const app: Application = express()

app.use(cors())
app.use(cookieParser())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Application root routes
app.use('/api/v1',routers);

 // global error handler
 app.use(globalErrorHandler)

 // handle not found
 app.use(notFound);


export default app
