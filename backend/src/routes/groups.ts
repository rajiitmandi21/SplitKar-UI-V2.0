import { Router } from "express"
import {
  createGroup,
  getUserGroups,
  getGroupById,
  updateGroupById,
  deleteGroupById,
  addUserToGroup,
  removeUserFromGroup,
} from "../controllers/groupController"
import { authenticate } from "../middleware/auth"
import { validateApiKey } from "../middleware/apiKey"

const router = Router()

// Apply API key validation to all routes
router.use(validateApiKey)

// Apply authentication to all routes
router.use(authenticate)

// Group routes
router.post("/", createGroup)
router.get("/", getUserGroups)
router.get("/:id", getGroupById)
router.put("/:id", updateGroupById)
router.delete("/:id", deleteGroupById)
router.post("/:id/members", addUserToGroup)
router.delete("/:id/members/:userId", removeUserFromGroup)

export default router
