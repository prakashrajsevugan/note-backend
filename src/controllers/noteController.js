const noteService = require("../services/noteService");

const createNote = async (req, res, next) => {
  try {
    const note = await noteService.createNote(req.user.id, req.body);

    res.status(201).json({
      success: true,
      note,
    });
  } catch (err) {
    next(err);
  }
};

const getAllNotes = async (req, res, next) => {
  try {
    const notes = await noteService.getAllNotes(req.user.id);

    res.json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const note = await noteService.getNoteById(
      req.params.id,
      req.user.id
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.json({
      success: true,
      note,
    });
  } catch (err) {
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const note = await noteService.updateNote(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      note,
    });
  } catch (err) {
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const result = await noteService.deleteNote(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};