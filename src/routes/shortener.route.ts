import { Router } from "express";
import { ShortenerController } from "../controllers/shortener.controller";

const shortenerRoute = Router();
const shortenerController = new ShortenerController();

shortenerRoute.post('/', shortenerController.create);
shortenerRoute.get('/:shortURL', shortenerController.redirect);

export default shortenerRoute;