import { Router } from "express";
import { register, checkToken, login } from "../controller";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/checkToken", checkToken);

export default router;
