import { Router } from "express"
import { groupController } from "../controllers/groupController"
import { authenticate } from "../middleware/auth"

const router = Router()

// All group routes require authentication
router.use(authenticate)

router.post("/", groupController.create)
router.get("/", groupController.getUserGroups)
router.get("/:groupId", groupController.getGroup)
router.post("/:groupId/members", groupController.addMember)
router.delete("/:groupId/members/:userId", groupController.removeMember)
router.put("/:groupId", groupController.updateGroup)
router.delete("/:groupId", groupController.deleteGroup)

export default router
