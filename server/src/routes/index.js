import { Router } from "express";
import { healthCheck } from "../controllers/api.controller";
import userRouter from './user';
import scraperRouter from './scraper.routes';

const router = Router();

router.route("/").get((req, res) => {
    console.log("Received a request at the root route");
    healthCheck(req, res); // Call the healthCheck function
});


router.use("/users", userRouter);


router.use("/sportsNews", scraperRouter, (req, res, next) => {
    console.log("Received a request at the /sportsNews route");
    next();
});


export default router;