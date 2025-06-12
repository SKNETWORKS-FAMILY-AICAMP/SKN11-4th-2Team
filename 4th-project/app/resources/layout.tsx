import { ChatBot } from '@/components/chat/chat-bot';

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ChatBot />
    </>
  );
}
