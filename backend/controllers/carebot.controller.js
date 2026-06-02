const { carebotChat, buildSkinRoutine } = require('../services/gemini.service');
const ChatHistory = require('../models/ChatHistory');

// POST /api/carebot/chat
exports.chat = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required.' });

    let chatHistory = await ChatHistory.findOne({ user: req.user._id });
    if (!chatHistory) chatHistory = new ChatHistory({ user: req.user._id, messages: [] });

    chatHistory.messages.push({ role: 'user', content: message });
    const aiResponse = await carebotChat(chatHistory.messages, req.user, context);
    chatHistory.messages.push({ role: 'assistant', content: aiResponse });
    chatHistory.lastMessageAt = new Date();
    chatHistory.totalConversations += 1;

    // Keep last 100 messages
    if (chatHistory.messages.length > 100) {
      chatHistory.messages = chatHistory.messages.slice(-100);
    }
    await chatHistory.save();

    res.json({ success: true, response: aiResponse, messageCount: chatHistory.messages.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/carebot/history
exports.getHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ user: req.user._id });
    if (!chatHistory) return res.json({ success: true, messages: [], routines: [] });
    res.json({ success: true, messages: chatHistory.messages.slice(-50), routines: chatHistory.savedRoutines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/carebot/build-routine
exports.buildRoutine = async (req, res) => {
  try {
    const { goals } = req.body;
    const routine = await buildSkinRoutine(req.user, goals);

    let chatHistory = await ChatHistory.findOne({ user: req.user._id });
    if (!chatHistory) chatHistory = new ChatHistory({ user: req.user._id, messages: [] });
    chatHistory.savedRoutines.push({ title: goals || 'My Skin Routine', steps: [...(routine.morningRoutine || []), ...(routine.eveningRoutine || [])].map(s => s.instruction) });
    await chatHistory.save();

    res.json({ success: true, routine });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/carebot/history
exports.clearHistory = async (req, res) => {
  try {
    await ChatHistory.findOneAndUpdate({ user: req.user._id }, { messages: [] });
    res.json({ success: true, message: 'Chat history cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
