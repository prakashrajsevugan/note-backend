const prisma = require("../config/prisma");

// Create Note
const createNote = async (userId, data) => {
  return await prisma.note.create({
    data: {
      title: data.title,
      description: data.description,
      userId: userId,
    },
  });
};

// Get All Notes
const getAllNotes = async (userId) => {
  return await prisma.note.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get Single Note
const getNoteById = async (id, userId) => {
  return await prisma.note.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });
};

// Update Note
const updateNote = async (id, userId, data) => {
  const note = await prisma.note.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return await prisma.note.update({
    where: {
      id: Number(id),
    },
    data: {
      title: data.title,
      description: data.description,
    },
  });
};

// Delete Note
const deleteNote = async (id, userId) => {
  const note = await prisma.note.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  await prisma.note.delete({
    where: {
      id: Number(id),
    },
  });

  return {
    message: "Note deleted successfully",
  };
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};