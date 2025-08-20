import express from 'express';
import { UserRoutes } from './user.routes';
import { AuthRoutes } from './auth.route';
import { CourseRoutes } from './course.route';
import { ModuleRoutes } from './module.route';
import { LectureRoutes } from './lecture.route';
import { userLectureProgressRoutes } from './userLectureProgress.route';


const router = express.Router();

const moduleRoutes = [
    {
        path:'/users',
        route: UserRoutes
    },
    {
        path:'/auth',
        route: AuthRoutes
    },
    {
        path:'/courses',
        route: CourseRoutes
    },
    {
        path:'/modules',
        route: ModuleRoutes
    },
    {
        path:'/lectures',
        route: LectureRoutes
    },
    {
        path:'/lecturesProgress',
        route: userLectureProgressRoutes
    },

];

moduleRoutes.forEach(({path,route}) => router.use(path,route))

export default router;