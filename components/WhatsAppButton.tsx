import React from 'react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "Halo Admin, saya butuh bantuan dengan aplikasi Relawan Ring Satu."
}) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-24 right-6 w-16 h-16 bg-white rounded-full shadow-2xl hover:shadow-green-200 transition-all z-50 flex items-center justify-center"
      title="Chat Admin via WhatsApp"
    >
      <img src="logo.jpeg" alt="WhatsApp" className="w-10 h-10" />
    </button>
  );
};