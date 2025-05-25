import type { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { logger } from "../utils/logger"

// Define interfaces
interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    userId: string
    email: string
    role: string
  }
}

interface GroupData {
  id: string
  name: string
  description?: string
  created_by: string
  members: string[]
  created_at: Date
  updated_at: Date
}

// Mock data store (replace with actual database later)
const groups: GroupData[] = []

export const createGroup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body

    if (!name) {
      res.status(400).json({ error: "Group name is required" })
      return
    }

    const newGroup: GroupData = {
      id: uuidv4(),
      name,
      description: description || "",
      created_by: req.user!.id || req.user!.userId,
      members: [req.user!.id || req.user!.userId],
      created_at: new Date(),
      updated_at: new Date(),
    }

    groups.push(newGroup)

    logger.info(`Group created: ${newGroup.id} by user: ${req.user!.id || req.user!.userId}`)
    res.status(201).json({
      message: "Group created successfully",
      group: newGroup,
    })
  } catch (error) {
    logger.error("Error creating group:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getUserGroups = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id || req.user!.userId
    const userGroups = groups.filter((group) => group.members.includes(userId))

    res.json({
      groups: userGroups.map((group: GroupData) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        memberCount: group.members.length,
        created_at: group.created_at,
      })),
    })
  } catch (error) {
    logger.error("Error fetching user groups:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getGroupById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const group = groups.find((g) => g.id === id)

    if (!group) {
      res.status(404).json({ error: "Group not found" })
      return
    }

    res.json({ group })
  } catch (error) {
    logger.error("Error fetching group:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const updateGroupById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, description } = req.body
    const userId = req.user!.id || req.user!.userId

    const groupIndex = groups.findIndex((g) => g.id === id)
    if (groupIndex === -1) {
      res.status(404).json({ error: "Group not found" })
      return
    }

    const group = groups[groupIndex]
    if (group.created_by !== userId) {
      res.status(403).json({ error: "Only group owner can update the group" })
      return
    }

    groups[groupIndex] = {
      ...group,
      name: name || group.name,
      description: description || group.description,
      updated_at: new Date(),
    }

    res.json({
      message: "Group updated successfully",
      group: groups[groupIndex],
    })
  } catch (error) {
    logger.error("Error updating group:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const deleteGroupById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id || req.user!.userId

    const groupIndex = groups.findIndex((g) => g.id === id)
    if (groupIndex === -1) {
      res.status(404).json({ error: "Group not found" })
      return
    }

    const group = groups[groupIndex]
    if (group.created_by !== userId) {
      res.status(403).json({ error: "Only group owner can delete the group" })
      return
    }

    groups.splice(groupIndex, 1)

    logger.info(`Group deleted: ${id} by user: ${userId}`)
    res.json({ message: "Group deleted successfully" })
  } catch (error) {
    logger.error("Error deleting group:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const addUserToGroup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { userId } = req.body
    const requesterId = req.user!.id || req.user!.userId

    const groupIndex = groups.findIndex((g) => g.id === id)
    if (groupIndex === -1) {
      res.status(404).json({ error: "Group not found" })
      return
    }

    const group = groups[groupIndex]
    if (group.created_by !== requesterId) {
      res.status(403).json({ error: "Only group owner can add members" })
      return
    }

    if (group.members.includes(userId)) {
      res.status(400).json({ error: "User is already a member" })
      return
    }

    groups[groupIndex].members.push(userId)
    groups[groupIndex].updated_at = new Date()

    res.json({
      message: "User added to group successfully",
      group: groups[groupIndex],
    })
  } catch (error) {
    logger.error("Error adding user to group:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const removeUserFromGroup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id, userId } = req.params
    const requesterId = req.user!.id || req.user!.userId

    const groupIndex = groups.findIndex((g) => g.id === id)
    if (groupIndex === -1) {
      res.status(404).json({ error: "Group not found" })
      return
    }

    const group = groups[groupIndex]
    if (group.created_by !== requesterId) {
      res.status(403).json({ error: "Only group owner can remove members" })
      return
    }

    const memberIndex = group.members.indexOf(userId)
    if (memberIndex === -1) {
      res.status(400).json({ error: "User is not a member of this group" })
      return
    }

    groups[groupIndex].members.splice(memberIndex, 1)
    groups[groupIndex].updated_at = new Date()

    res.json({
      message: "User removed from group successfully",
      group: groups[groupIndex],
    })
  } catch (error) {
    logger.error("Error removing user from group:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
