import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { carebotAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Send, Sparkles, AlertCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CareBotScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: `Hey bestie! 🌸 I am CareBot, your AI skincare best friend! I know all about ${user?.skinType || 'your'} skin. What skincare questions or glow goals do we have today? ✨`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick Chat Suggestion Chips
  const suggestions = [
    "Build a personalized routine 🧴",
    "Explain double cleansing 🧼",
    "How to clear hormonal acne? 🌸",
    "Is Retinol safe for sensitive skin? 🛡️"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (text.includes('personalized routine')) {
      navigate('/carebot/routine');
      return;
    }

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const chatPayload = {
        message: text,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      };
      
      const { data } = await carebotAPI.chat(chatPayload);
      
      if (data.success) {
        setMessages((prev) => [...prev, { role: 'bot', content: data.reply }]);
      } else {
        throw new Error(data.message || 'Chat error');
      }
    } catch (err) {
      console.warn('Backend chat offline, triggering conversational bestie fallback.');
      
      // Conversational fallback matches friendly, Gen-Z skin bestie tone!
      setTimeout(() => {
        let reply = "Omg bestie, that is such a good question! 💖 ";
        if (text.toLowerCase().includes('cleansing')) {
          reply += "Double cleansing is literally a game changer! You start with an oil-based cleanser to melt away silicone sunscreens and makeup, then follow up with a gentle water-based wash. It keeps your pores pristine! 🧼";
        } else if (text.toLowerCase().includes('acne')) {
          reply += "Hormonal acne is so real, especially during your luteal phase! 🌸 We want to avoid stripping your barrier. Focus on calming ingredients like Centella Asiatica (Cica), heartleaf, or a low percentage Salicylic Acid to target pores without severe flaking.";
        } else if (text.toLowerCase().includes('retinol')) {
          reply += "Retinol is amazing for cellular renewal, but on sensitive skin it can be a bit spicy! 🌶️ Try the 'sandwich method'—apply moisturizer, wait 5 mins, apply a tiny pea-size retinol, then seal it with moisturizer again. And absolutely wear SPF 30+ in the morning! 🛡️";
        } else {
          reply += "Skincare is a journey, bestie! Keep your routine simple: Cleanser, Hydrator, and Sunscreen. Let me know if you want me to write a custom morning or evening routine for you! 🌟";
        }
        
        setMessages((prev) => [...prev, { role: 'bot', content: reply }]);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="page-header" style={{ borderBottom: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800 }}>CareBot Coach</h1>
          <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>
            🟢 ONLINE & READY TO GLOW
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 16px',
        display: 'flex', flexDirection: 'column', gap: 16
      }}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`chat-bubble ${isUser ? 'user' : 'bot'} animate-scale-in`}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.content}
            </div>
          );
        })}
        {loading && (
          <div className="chat-bubble bot animate-pulse" style={{ alignSelf: 'flex-start', display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 14 }}>CareBot is writing...</span>
            <div className="spinner spinner-sm" style={{ borderTopColor: 'var(--primary)', borderLeftColor: 'transparent', margin: '4px 0 0' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions and input footer */}
      <div style={{ padding: '12px 16px 20px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border-light)' }}>
        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
            {suggestions.map((s) => (
              <button
                key={s}
                className="chip"
                onClick={() => handleSendMessage(s)}
                style={{ whiteSpace: 'nowrap', background: 'white' }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          style={{ display: 'flex', gap: 10 }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="Ask CareBot anything about skin..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            style={{ borderRadius: 'var(--radius-full)', background: 'white', padding: '14px 20px' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputText.trim() || loading}
            style={{ borderRadius: '50%', width: 50, height: 50, padding: 0 }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
