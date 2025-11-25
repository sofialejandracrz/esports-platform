"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IconEdit, IconUserPlus, IconTrophy, IconStar, IconDeviceGamepad, IconUsers, IconCoins } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserProfile {
  nickname: string;
  fullName: string;
  avatar: string;
  level: number;
  xp: number;
  maxXp: number;
  balance: number;
  totalEarnings: number;
  bio: string;
  friends: Friend[];
  trophies: Trophy[];
  achievements: Achievement[];
  gameStats: GameStat[];
}

interface Friend {
  id: string;
  nickname: string;
  avatar: string;
  status: "online" | "offline";
}

interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
}

interface GameStat {
  game: string;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  totalMatches: number;
  ranking: number;
}

// Datos mock del usuario
const mockUserData: Record<string, UserProfile> = {
  "jugador1": {
    nickname: "jugador1",
    fullName: "Carlos Méndez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jugador1",
    level: 42,
    xp: 8450,
    maxXp: 10000,
    balance: 1250.50,
    totalEarnings: 15780.00,
    bio: "Jugador profesional de ajedrez y estrategia. Competidor en torneos internacionales.",
    friends: [
      { id: "1", nickname: "pro_player", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pro", status: "online" },
      { id: "2", nickname: "master_chief", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=master", status: "online" },
      { id: "3", nickname: "gamer_99", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gamer", status: "offline" },
      { id: "4", nickname: "chess_king", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chess", status: "offline" },
    ],
    trophies: [
      { id: "1", name: "Campeón Regional", description: "Ganador del torneo regional 2024", icon: "🏆", rarity: "legendary", earnedAt: "2024-10-15" },
      { id: "2", name: "Maestro del Ajedrez", description: "100 victorias en partidas de ajedrez", icon: "♟️", rarity: "epic", earnedAt: "2024-09-20" },
      { id: "3", name: "Racha Imparable", description: "10 victorias consecutivas", icon: "🔥", rarity: "rare", earnedAt: "2024-08-10" },
      { id: "4", name: "Primer Paso", description: "Ganaste tu primera partida", icon: "⭐", rarity: "common", earnedAt: "2024-01-05" },
    ],
    achievements: [
      { id: "1", name: "Maestro de Torneos", description: "Participa en 50 torneos", progress: 35, maxProgress: 50, completed: false },
      { id: "2", name: "Invencible", description: "Gana 500 partidas", progress: 342, maxProgress: 500, completed: false },
      { id: "3", name: "Socialite", description: "Agrega 100 amigos", progress: 45, maxProgress: 100, completed: false },
      { id: "4", name: "Coleccionista", description: "Consigue 25 trofeos", progress: 25, maxProgress: 25, completed: true },
    ],
    gameStats: [
      { game: "Ajedrez", wins: 342, losses: 89, draws: 43, winRate: 72.2, totalMatches: 474, ranking: 156 },
      { game: "Damas", wins: 198, losses: 102, draws: 25, winRate: 60.9, totalMatches: 325, ranking: 423 },
      { game: "Go", wins: 87, losses: 65, draws: 12, winRate: 53.0, totalMatches: 164, ranking: 892 },
      { game: "Poker", wins: 124, losses: 98, draws: 0, winRate: 55.9, totalMatches: 222, ranking: 567 },
    ],
  },
  "default": {
    nickname: "default",
    fullName: "Usuario Invitado",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
    level: 1,
    xp: 0,
    maxXp: 1000,
    balance: 0,
    totalEarnings: 0,
    bio: "Nuevo jugador en la plataforma",
    friends: [],
    trophies: [],
    achievements: [],
    gameStats: [],
  },
};

export default function PerfilUsuarioPage() {
  const params = useParams();
  const nickname = params.nickname as string;
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Simular obtención del usuario actual desde JWT en localStorage
    // En producción, esto se haría con un hook de autenticación
    const mockCurrentUser = "jugador1"; // Este sería el usuario del JWT
    setCurrentUser(mockCurrentUser);

    // Obtener datos del perfil
    const userData = mockUserData[nickname] || mockUserData["default"];
    setProfileData(userData);
  }, [nickname]);

  if (!profileData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin">Cargando...</div>
      </div>
    );
  }

  const isOwnProfile = currentUser === nickname;
  const xpPercentage = (profileData.xp / profileData.maxXp) * 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-r from-yellow-400 to-orange-500";
      case "epic":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "rare":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header del perfil */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                  {/* Avatar y nombre */}
                  <div className="flex flex-col items-center gap-4 md:items-start">
                    <Avatar className="size-24 border-4 border-primary/20 md:size-32">
                      <AvatarImage src={profileData.avatar} alt={profileData.nickname} />
                      <AvatarFallback className="text-2xl">
                        {profileData.nickname.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center gap-1 md:items-start">
                      <h1 className="text-2xl font-bold md:text-3xl">{profileData.fullName}</h1>
                      <p className="text-muted-foreground">@{profileData.nickname}</p>
                    </div>
                  </div>

                  {/* Stats principales */}
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="flex flex-col items-center gap-1 rounded-lg border bg-card/50 p-3">
                        <IconStar className="size-5 text-primary" />
                        <span className="text-xl font-bold">Nivel {profileData.level}</span>
                        <span className="text-xs text-muted-foreground">Experiencia</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg border bg-card/50 p-3">
                        <IconCoins className="size-5 text-yellow-500" />
                        <span className="text-xl font-bold">${profileData.balance.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">Saldo</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg border bg-card/50 p-3">
                        <IconTrophy className="size-5 text-orange-500" />
                        <span className="text-xl font-bold">{profileData.trophies.length}</span>
                        <span className="text-xs text-muted-foreground">Trofeos</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg border bg-card/50 p-3">
                        <IconUsers className="size-5 text-blue-500" />
                        <span className="text-xl font-bold">{profileData.friends.length}</span>
                        <span className="text-xs text-muted-foreground">Amigos</span>
                      </div>
                    </div>

                    {/* Barra de XP */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Experiencia</span>
                        <span className="font-medium">{profileData.xp} / {profileData.maxXp} XP</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all"
                          style={{ width: `${xpPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Botón de acción */}
                    <div className="flex gap-2">
                      {isOwnProfile ? (
                        <Button asChild className="w-full md:w-auto">
                          <Link href="/usuario/configuracion/personal">
                            <IconEdit className="size-4" />
                            Editar perfil
                          </Link>
                        </Button>
                      ) : (
                        <Button className="w-full md:w-auto">
                          <IconUserPlus className="size-4" />
                          Agregar amigo
                        </Button>
                      )}
                    </div>

                    {/* Biografía */}
                    {profileData.bio && (
                      <p className="text-sm text-muted-foreground">{profileData.bio}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs con información detallada */}
          <div className="px-4 lg:px-6">
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
                <TabsTrigger value="stats">
                  <IconDeviceGamepad className="size-4" />
                  Estadísticas
                </TabsTrigger>
                <TabsTrigger value="trophies">
                  <IconTrophy className="size-4" />
                  Trofeos
                </TabsTrigger>
                <TabsTrigger value="achievements">
                  <IconStar className="size-4" />
                  Logros
                </TabsTrigger>
                <TabsTrigger value="friends">
                  <IconUsers className="size-4" />
                  Amigos
                </TabsTrigger>
              </TabsList>

              {/* Estadísticas por juego */}
              <TabsContent value="stats" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                  {profileData.gameStats.map((stat) => (
                    <Card key={stat.game}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{stat.game}</span>
                          <Badge variant="outline">#{stat.ranking}</Badge>
                        </CardTitle>
                        <CardDescription>{stat.totalMatches} partidas jugadas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-green-500">{stat.wins}</span>
                            <span className="text-xs text-muted-foreground">Victorias</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-red-500">{stat.losses}</span>
                            <span className="text-xs text-muted-foreground">Derrotas</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-yellow-500">{stat.draws}</span>
                            <span className="text-xs text-muted-foreground">Empates</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-blue-500">{stat.winRate}%</span>
                            <span className="text-xs text-muted-foreground">% Victoria</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {profileData.gameStats.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <IconDeviceGamepad className="size-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No hay estadísticas disponibles</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Vitrina de trofeos */}
              <TabsContent value="trophies" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {profileData.trophies.map((trophy) => (
                    <Card key={trophy.id} className="overflow-hidden">
                      <div className={`h-2 ${getRarityColor(trophy.rarity)}`} />
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="text-4xl">{trophy.icon}</div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{trophy.name}</CardTitle>
                            <CardDescription className="mt-1 text-xs">
                              {trophy.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="capitalize">
                            {trophy.rarity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(trophy.earnedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {profileData.trophies.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <IconTrophy className="size-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No hay trofeos aún</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Logros */}
              <TabsContent value="achievements" className="mt-4">
                <div className="grid gap-4">
                  {profileData.achievements.map((achievement) => (
                    <Card key={achievement.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{achievement.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {achievement.description}
                            </CardDescription>
                          </div>
                          {achievement.completed && (
                            <Badge variant="default">
                              <IconStar className="size-3" />
                              Completado
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-medium">
                              {achievement.progress} / {achievement.maxProgress}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-secondary">
                            <div
                              className={`h-full transition-all ${
                                achievement.completed
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : "bg-gradient-to-r from-primary to-blue-500"
                              }`}
                              style={{
                                width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {profileData.achievements.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <IconStar className="size-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No hay logros disponibles</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Lista de amigos */}
              <TabsContent value="friends" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {profileData.friends.map((friend) => (
                    <Card key={friend.id}>
                      <CardContent className="flex items-center gap-3 pt-6">
                        <div className="relative">
                          <Avatar className="size-12">
                            <AvatarImage src={friend.avatar} alt={friend.nickname} />
                            <AvatarFallback>
                              {friend.nickname.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-card ${
                              friend.status === "online" ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate font-medium">{friend.nickname}</p>
                          <p className="text-xs capitalize text-muted-foreground">
                            {friend.status}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {profileData.friends.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <IconUsers className="size-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No hay amigos aún</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
