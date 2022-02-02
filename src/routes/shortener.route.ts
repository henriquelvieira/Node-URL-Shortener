import { Router } from "express";
import ShortenerController from "../controllers/shortener.controller";

const shortenerRoute = Router();
const shortenerController = new ShortenerController();

shortenerRoute.get('/', shortenerController.list);
shortenerRoute.post('/', shortenerController.create);

export default shortenerRoute;