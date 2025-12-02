"use client";

import { useState, useEffect } from "react";
import { Trophy, Heart, MessageCircle, Award, TrendingUp, Flame } from "lucide-react";

interface Post {
  id: string;
  user: string;
  avatar: string;
  achievement: string;
  description: string;
  likes: number;
  comments: number;
  timestamp: Date;
  badge?: string;
}

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Mock data - in production, this would come from a backend
    const mockPosts: Post[] = [
      {
        id: "1",
        user: "Maria Silva",
        avatar: "MS",
        achievement: "Meta Semanal Atingida! 🎯",
        description: "Consegui manter minha meta de calorias todos os dias esta semana!",
        likes: 24,
        comments: 5,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        badge: "7-day-streak",
      },
      {
        id: "2",
        user: "João Santos",
        avatar: "JS",
        achievement: "Novo Recorde de Treino! 💪",
        description: "Queimei 800 calorias hoje no treino de HIIT. Melhor marca pessoal!",
        likes: 42,
        comments: 8,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: "3",
        user: "Ana Costa",
        avatar: "AC",
        achievement: "Badge Desbloqueado: Mestre do Equilíbrio 🏆",
        description: "30 dias mantendo macros balanceados. Disciplina é tudo!",
        likes: 67,
        comments: 12,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        badge: "balance-master",
      },
      {
        id: "4",
        user: "Pedro Lima",
        avatar: "PL",
        achievement: "Primeira Semana Completa! 🌟",
        description: "Registrei todas as refeições por 7 dias seguidos. Vamos que vamos!",
        likes: 31,
        comments: 6,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ];

    setPosts(mockPosts);
  }, []);

  const formatTimestamp = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return "Agora há pouco";
    if (hours === 1) return "Há 1 hora";
    if (hours < 24) return `Há ${hours} horas`;
    const days = Math.floor(hours / 24);
    return days === 1 ? "Há 1 dia" : `Há ${days} dias`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#00BFFF] to-white bg-clip-text text-transparent">
          Comunidade CalBoost
        </h2>
        <p className="text-white/60">Celebre conquistas e inspire-se com outros usuários</p>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-br from-[#00BFFF]/20 to-[#0080FF]/10 backdrop-blur-xl rounded-2xl p-6 border border-[#00BFFF]/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Trophy className="w-6 h-6 text-[#00BFFF] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1.2k</p>
            <p className="text-xs text-white/60">Conquistas</p>
          </div>
          <div>
            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">45k</p>
            <p className="text-xs text-white/60">Calorias Queimadas</p>
          </div>
          <div>
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">892</p>
            <p className="text-xs text-white/60">Membros Ativos</p>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} formatTimestamp={formatTimestamp} />
        ))}
      </div>

      {/* Empty State for User's Posts */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
        <Award className="w-16 h-16 text-[#00BFFF] mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-white mb-2">Suas Conquistas</h3>
        <p className="text-white/60 mb-4">
          Continue registrando suas refeições e treinos para desbloquear badges e compartilhar suas conquistas!
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <BadgePreview name="Primeira Semana" locked />
          <BadgePreview name="Meta Mensal" locked />
          <BadgePreview name="Streak 30 dias" locked />
          <BadgePreview name="Mestre do Equilíbrio" locked />
        </div>
      </div>
    </div>
  );
}

interface PostCardProps {
  post: Post;
  formatTimestamp: (date: Date) => string;
}

function PostCard({ post, formatTimestamp }: PostCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#0080FF] flex items-center justify-center text-white font-bold">
          {post.avatar}
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold">{post.user}</h4>
          <p className="text-sm text-white/60">{formatTimestamp(post.timestamp)}</p>
        </div>
        {post.badge && (
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">{post.achievement}</h3>
        <p className="text-white/70">{post.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 transition-colors ${
            liked ? "text-red-400" : "text-white/60 hover:text-white"
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          <span className="text-sm font-medium">{post.likes + (liked ? 1 : 0)}</span>
        </button>

        <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.comments}</span>
        </button>
      </div>
    </div>
  );
}

interface BadgePreviewProps {
  name: string;
  locked?: boolean;
}

function BadgePreview({ name, locked }: BadgePreviewProps) {
  return (
    <div
      className={`px-3 py-2 rounded-lg border text-sm ${
        locked
          ? "bg-white/5 border-white/10 text-white/40"
          : "bg-[#00BFFF]/20 border-[#00BFFF]/30 text-[#00BFFF]"
      }`}
    >
      {locked && "🔒 "}
      {name}
    </div>
  );
}
