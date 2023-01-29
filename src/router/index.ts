import { Router } from "express";
import checkToken from "../controller/auth/checkToken";
import login from "../controller/auth/login";
import register from "../controller/auth/register";
import userSearchSuggs from "../controller/userSearchSuggs";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/userSearchSuggestions", userSearchSuggs);
router.get("/auth/checkToken", checkToken);

export default router;
