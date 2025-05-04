import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Leaf, ChefHat, BarChart, Sparkles, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatbotIntro({ input, setInput, handleSubmit, featureCards }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-background to-primary/5 transition-colors duration-500 z-30 pt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl px-4 flex flex-col items-center"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-primary/30 flex items-center justify-center shadow-lg mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
          >
            <Leaf className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-foreground mb-2 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            ChiDiet 건강 레시피
          </motion.h1>
          <motion.p 
            className="text-base text-muted-foreground font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            한의학 체질 기반 맞춤 레시피 챗봇이 도와드립니다
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full"
        >
          <Card className="border-none shadow-lg bg-white/70 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="relative flex mb-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="무엇이든 물어보세요..."
                    className="pl-6 pr-24 py-6 rounded-full bg-muted border-none shadow-sm text-base focus:ring-2 focus:ring-primary/30 transition-all"
                    autoFocus
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90 h-12 px-6 flex items-center justify-center gap-2 shadow-md text-base"
                  >
                    <span className="font-medium">보내기</span>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  체질에 맞는 건강 레시피를 물어보세요
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full"
        >
          <Card className="border-none shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center">
                <ChefHat className="w-5 h-5 mr-2 text-primary" />
                <span>자주 사용하는 기능</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {featureCards.map((card, idx) => (
                  <motion.button
                    key={card.title}
                    onClick={card.onClick}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex flex-row items-center p-4 bg-card rounded-2xl shadow-sm border border-border/40 hover:shadow-md hover:border-primary/30 transition-all duration-200 focus:outline-none w-full gap-3"
                    type="button"
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mr-2 text-primary group-hover:bg-primary/20 transition-colors">
                      {card.icon}
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <span className="font-medium text-base text-foreground group-hover:text-primary transition-colors mb-0.5">{card.title}</span>
                      <span className="text-xs text-muted-foreground leading-snug">{card.description}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-xs text-muted-foreground text-center max-w-md"
        >
          건강 상태, 선호하는 음식, 필요한 영양소 등을 알려주시면 더 맞춤화된 레시피를 제공해 드립니다.
        </motion.p>
      </motion.div>
    </div>
  );
} 