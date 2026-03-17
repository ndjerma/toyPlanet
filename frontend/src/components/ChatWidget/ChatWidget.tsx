import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const RASA_URL = 'http://localhost:5005/webhooks/rest/webhook';

const INITIAL_MESSAGE: Message = {
  id: 0,
  text: 'Zdravo! Dobrodošli u prodavnicu igračaka. Mogu da vam pomognem sa pretragom po vrsti, uzrastu, grupi ili ceni. Kako mogu da vam pomognem?',
  sender: 'bot',
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now(), text, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch(RASA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'user', message: text }),
      });

      if (!res.ok) throw new Error('server error');

      const data: Array<{ text?: string }> = await res.json();
      const botMsgs: Message[] =
        data.length > 0
          ? data.map((item, i) => ({
              id: Date.now() + i + 1,
              text: item.text ?? '...',
              sender: 'bot',
            }))
          : [{ id: Date.now() + 1, text: 'Agent trenutno nije dostupan.', sender: 'bot' }];

      setMessages((prev) => [...prev, ...botMsgs]);
      setUnreadCount((prev) => (isOpen ? prev : prev + botMsgs.length));
    } catch {
      const fallbackMsg: Message = {
        id: Date.now() + 1,
        text: 'Agent trenutno nije dostupan.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setUnreadCount((prev) => (isOpen ? prev : prev + 1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {isOpen && (
        <div className="w-[350px] h-[480px] bg-white rounded-xl border border-[#e5e0d8] shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-sage-500 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-300 rounded-full block" />
              <span className="text-white font-medium text-sm">Asistent prodavnice</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/70 hover:text-white text-2xl leading-none"
              aria-label="Zatvori chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sage-500 text-white rounded-br-sm'
                      : 'bg-sage-50 text-gray-800 border border-[#e5e0d8] rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-sage-50 border border-[#e5e0d8] px-3 py-2 rounded-xl rounded-bl-sm">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-sage-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-sage-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-sage-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-[#e5e0d8] flex gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Unesite poruku..."
              disabled={isLoading}
              className="flex-1 border border-[#e5e0d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputText.trim()}
              className="bg-sage-500 hover:bg-sage-700 disabled:opacity-40 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              aria-label="Pošalji"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={toggleChat}
        className="relative w-14 h-14 bg-sage-500 hover:bg-sage-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label={isOpen ? 'Zatvori chat' : 'Otvori chat'}
      >
        {isOpen ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
