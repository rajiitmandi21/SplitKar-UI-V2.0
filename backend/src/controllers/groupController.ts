import type { Response } from "express"
import type { AuthenticatedRequest } from "../middleware/auth"
import { groupModel } from "../models/Group"

export class GroupController {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, description, icon, color, currency, member_ids } = req.body
      const userId = req.user!.userId

      // Validation
      if (!name) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Group name is required",
        })
      }

      const group = await groupModel.create({
        name,
        description,
        icon,
        color,
        currency,
        created_by: userId,
        member_ids,
      })

      res.status(201).json({
        message: "Group created successfully",
        group,
      })
    } catch (error) {
      console.error("Create group error:", error)
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to create group",
      })
    }
  }

  async getUserGroups(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId
      const groups = await groupModel.findUserGroups(userId)

      res.json({
        groups: groups.map((group) => ({
          ...group,
          member_count: Number(group.member_count),
          total_expenses: Number(group.total_expenses),
          user_balance: Number(group.user_balance),
        })),
      })
    } catch (error) {
      console.error("Get user groups error:", error)
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to fetch groups",
      })
    }
  }

  async getGroup(req: AuthenticatedRequest, res: Response) {
    try {
      const { groupId } = req.params
      const userId = req.user!.userId

      // Check if user is a member of the group
      const membership = await groupModel.checkMembership(groupId, userId)
      if (!membership) {
        return res.status(403).json({
          error: "Forbidden",
          message: "You are not a member of this group",
        })
      }

      const group = await groupModel.findById(groupId)
      if (!group) {
        return res.status(404).json({
          error: "Not Found",
          message: "Group not found",
        })
      }

      const members = await groupModel.getMembers(groupId)

      res.json({
        group,
        members,
        your_role: membership.role,
      })
    } catch (error) {
      console.error("Get group error:", error)
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to fetch group",
      })
    }
  }

  async addMember(req: AuthenticatedRequest, res: Response) {
    try {
      const { groupId } = req.params
      const { user_id, role = "member" } = req.body
      const currentUserId = req.user!.userId

      // Check if current user is admin of the group
      const membership = await groupModel.checkMembership(groupId, currentUserId)
      if (!membership || membership.role !== "admin") {
        return res.status(403).json({
          error: "Forbidden",
          message: "Only group admins can add members",
        })
      }

      await groupModel.addMember(groupId, user_id, role)

      res.json({
        message: "Member added successfully",
      })
    } catch (error) {
      console.error("Add member error:", error)
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to add member",
      })
    }
  }

  async removeMember(req: AuthenticatedRequest, res: Response) {
    try {
      const { groupId, userId } = req.params
      const currentUserId = req.user!.userId

      // Check if current user is admin of the group or removing themselves
      const membership = await groupModel.checkMembership(groupId, currentUserId)
      if (!membership || (membership.role !== "admin" && currentUserId !== userId)) {
        return res.status(403).json({
          error: "Forbidden",
          message: "You can only remove yourself or be an admin to remove others",
        })
      }

      await groupModel.removeMember(groupId, userId)

      res.json({
        message: "Member removed successfully",
      })
    } catch (error) {
      console.error("Remove member error:", error)
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to remove member",
      })
    }
  }

  async updateGroup(req: AuthenticatedRequest, res: Response) {
    try {
      const { groupId } = req.params
      const updates = req.body
      const userId = req.user!.userId

      // Check if user is admin of the group
      const membership = await groupModel.checkMembership(groupId, userId)
      if (!membership || membership.role !== "admin") {
        return res.status(403).json({
          error: "Forbidden",
          message: "Only group admins can update group details",
        })
      }

      const group = await groupModel.update(groupId, updates)

      res.json({
        message: "Group updated successfully",
        group,
      })
    } catch (error) {
      console.error("Update group error:", error)

      if (error instanceof Error && error.message.includes("No valid fields")) {
        return res.status(400).json({
          error: "Validation Error",
          message: error.message,
        })
      }

      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to update group",
      })
    }
  }

  async deleteGroup(req: AuthenticatedRequest, res: Response) {
    try {
      const { groupId } = req.params
      const userId = req.user!.userId

      const success = await groupModel.delete(groupId, userId)

      if (!success) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Only group creator can delete the group",
        })
      }

      res.json({
        message: "Group deleted successfully",
      })
    } catch (error) {
      console.error("Delete group error:", error)
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to delete group",
      })
    }
  }
}

export const groupController = new GroupController()
