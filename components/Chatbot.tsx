
import React, { useState } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FAQ_RESPONSES: { [key: string]: string } = {
  'ambulance': 'Untuk memanggil ambulance, klik tombol "Panggil Ambulance" di dashboard utama. Pastikan Anda memberikan informasi yang lengkap.',
  'p3k': 'Panduan P3K tersedia di menu utama. Klik "Panduan P3K" untuk melihat langkah-langkah pertolongan pertama.',
  'status': 'Untuk melihat status laporan Anda, buka menu "Riwayat Medis". Anda akan melihat status terbaru dari setiap permohonan.',
  'kontak': 'Untuk keadaan darurat, hubungi 119. Atau gunakan aplikasi ini untuk panggilan terkoordinasi.',
  'relawan': 'Relawan Ring Satu adalah tim sukarela yang siap membantu evakuasi medis 24 jam. Mereka terlatih dalam penanganan darurat.',
  'default': 'Maaf, saya tidak mengerti pertanyaan Anda. Silakan hubungi admin untuk bantuan lebih lanjut atau gunakan menu utama aplikasi.'
};

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Halo! Saya adalah asisten Relawan Ring Satu. Ada yang bisa saya bantu?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const findResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
      if (lowerQuestion.includes(key)) {
        return response;
      }
    }
    return FAQ_RESPONSES.default;
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: findResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-700 transition-all z-50 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-2xl">
          {isOpen ? 'close' : 'chat'}
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 z-40 flex flex-col">
          {/* Header */}
          <div className="p-6 bg-red-600 text-white rounded-t-3xl">
            <h3 className="font-black text-lg">Asisten Relawan Ring Satu</h3>
            <p className="text-sm text-red-100">Tanya tentang layanan kesehatan</p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    message.sender === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
