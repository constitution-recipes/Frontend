import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export default function ChatbotIntro({ input, setInput, handleSubmit, featureCards }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center min-h-screen w-full bg-gradient-primary transition-colors duration-500 z-30 pt-16">
      <div className="w-full max-w-md px-4 flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-green-300 flex items-center justify-center shadow-lg mb-3">
            <span className="text-3xl font-extrabold text-primary">🍃</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">ChiDiet</h1>
          <p className="text-base text-gray-500 font-medium">한의학 기반 맞춤 건강 레시피 챗봇</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full mb-10">
          <div className="relative flex shadow-xl rounded-full bg-white">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="무엇이든 물어보세요..."
              className="pl-6 pr-24 py-6 rounded-full bg-white border-2 border-primary/20 text-lg focus:ring-2 focus:ring-primary/30 transition-all"
              autoFocus
              autoComplete="off"
            />
            <Button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90 h-12 px-6 flex items-center justify-center gap-2 shadow-md text-base"
            >
              <span className="font-semibold">보내기</span>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
        <div className="w-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-5 text-center tracking-tight">자주 사용하는 기능</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {featureCards.map((card, idx) => (
              <button
                key={card.title}
                onClick={card.onClick}
                className="group flex flex-row items-center p-4 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:border-primary/30 transition-all duration-200 hover:scale-[1.03] focus:outline-none w-full gap-3"
                type="button"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mr-2 text-primary group-hover:bg-primary/20 transition-colors text-2xl">
                  {card.icon}
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-base text-gray-900 group-hover:text-primary transition-colors mb-0.5">{card.title}</span>
                  <span className="text-xs text-gray-500 leading-snug">{card.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <p className="mt-8 text-xs text-gray-400 text-center">더 자세한 건강 정보, 선호 음식, 영양소 등을 입력하면 더욱 맞춤화된 레시피를 추천해드려요.</p>
      </div>
    </div>
  );
} 