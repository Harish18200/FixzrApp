import { Router } from "express";
import { signUp } from "../controllers/user/userController";
import { Otpvalidate } from "../controllers/user/userController";
import { resendOtp } from "../controllers/user/userController";

const router = Router();

router.post("/signUp", signUp);
router.post("/Otpvalidate", Otpvalidate);
router.post("/resendOtp", resendOtp);

export default router;
