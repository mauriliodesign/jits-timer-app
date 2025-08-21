import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrimaryLargeButton, SecondaryLargeButton } from "@/components/ui/button-system";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Building2, Trophy, Upload, ArrowLeft, Settings, Volume2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  playStartRoundSound, 
  playEndRoundSound, 
  playRestStartSound, 
  playTrainingCompleteSound,
  enableAudio 
} from "@/lib/sound-utils";
import type { AcademyProfile, InsertAcademyProfile } from "@shared/schema";

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    academyName: "",
    instructorName: "",
    logoUrl: "",
  });

  const { data: profile, isLoading } = useQuery<AcademyProfile>({
    queryKey: ["/api/profile", user?.uid],
    enabled: !!user?.uid,
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: InsertAcademyProfile) =>
      apiRequest("POST", "/api/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile", user?.uid] });
      toast({
        title: "Perfil criado",
        description: "Perfil da academia criado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar perfil da academia.",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<AcademyProfile>) =>
      apiRequest("PUT", `/api/profile/${user?.uid}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile", user?.uid] });
      toast({
        title: "Perfil atualizado",
        description: "Perfil da academia atualizado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar perfil da academia.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        academyName: profile.academyName,
        instructorName: profile.instructorName,
        logoUrl: profile.logoUrl || "",
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        instructorName: user.displayName || user.email || "",
      }));
    }
  }, [profile, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    if (profile) {
      updateProfileMutation.mutate(formData);
    } else {
      createProfileMutation.mutate({
        ...formData,
        userId: user.uid,
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121214] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Você precisa estar logado para acessar o perfil.</p>
          <Link href="/login">
                          <PrimaryLargeButton className="mt-4">Fazer Login</PrimaryLargeButton>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121214] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121214] text-white">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl lg:max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-4 sm:mb-6">
          <Link href="/control">
            <SecondaryLargeButton size="small" className="mr-3 sm:mr-4" icon={<ArrowLeft />}>
              Voltar
            </SecondaryLargeButton>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Configurações</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <form onSubmit={handleSubmit}>
            <Card className="bg-[#17171a] border-[#1e1e21] h-fit">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#59FF3A]" />
                  <span className="text-base sm:text-lg">Informações da Academia</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
              {/* Current User Info */}
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-[#1e1e21] rounded-lg">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback>
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-white text-sm sm:text-base">{user.displayName || user.email}</p>
                  <p className="text-xs sm:text-sm text-[#5a5a60]">Instrutor</p>
                </div>
              </div>

              {/* Academy Logo */}
              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="text-white text-sm sm:text-base">Logo da Academia (URL)</Label>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://exemplo.com/logo.png"
                    className="bg-[#1e1e21] border-[#252529] text-white text-sm sm:text-base"
                  />
                  {formData.logoUrl && (
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarImage src={formData.logoUrl} />
                      <AvatarFallback>
                        <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>

              {/* Academy Name */}
              <div className="space-y-2">
                <Label htmlFor="academyName" className="text-white text-sm sm:text-base">Nome da Academia</Label>
                <Input
                  id="academyName"
                  value={formData.academyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, academyName: e.target.value }))}
                  placeholder="Nome da sua academia"
                  className="bg-[#1e1e21] border-[#252529] text-white text-sm sm:text-base"
                  required
                />
              </div>

              {/* Instructor Name */}
              <div className="space-y-2">
                <Label htmlFor="instructorName" className="text-white text-sm sm:text-base">Nome do Instrutor</Label>
                <Input
                  id="instructorName"
                  value={formData.instructorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructorName: e.target.value }))}
                  placeholder="Seu nome como instrutor"
                  className="bg-[#1e1e21] border-[#252529] text-white text-sm sm:text-base"
                  required
                />
              </div>

              {/* Submit Button */}
              <PrimaryLargeButton
                type="submit"
                disabled={createProfileMutation.isPending || updateProfileMutation.isPending}
                loading={createProfileMutation.isPending || updateProfileMutation.isPending}
                icon={profile ? <Trophy /> : <User />}
                fullWidth
              >
                {profile ? "Atualizar Perfil" : "Criar Perfil"}
              </PrimaryLargeButton>
            </CardContent>
          </Card>
        </form>

        {/* Sound Tests Section */}
        <Card className="bg-[#17171a] border-[#1e1e21]">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#59FF3A]" />
              <span className="text-base sm:text-lg">Testes de Som</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <SecondaryLargeButton
                  onClick={() => {
                    enableAudio();
                    playStartRoundSound();
                  }}
                  className="h-14 sm:h-16"
                >
                  <div className="text-center">
                    <div className="text-base sm:text-lg mb-1">🔊</div>
                    <div className="text-xs sm:text-sm">Início de Round</div>
                  </div>
                </SecondaryLargeButton>
                <SecondaryLargeButton
                  onClick={() => {
                    enableAudio();
                    playEndRoundSound();
                  }}
                  className="h-14 sm:h-16"
                >
                  <div className="text-center">
                    <div className="text-base sm:text-lg mb-1">🔊</div>
                    <div className="text-xs sm:text-sm">Fim de Round</div>
                  </div>
                </SecondaryLargeButton>
                <SecondaryLargeButton
                  onClick={() => {
                    enableAudio();
                    playRestStartSound();
                  }}
                  className="h-14 sm:h-16"
                >
                  <div className="text-center">
                    <div className="text-base sm:text-lg mb-1">🔊</div>
                    <div className="text-xs sm:text-sm">Início de Descanso</div>
                  </div>
                </SecondaryLargeButton>
                <SecondaryLargeButton
                  onClick={() => {
                    enableAudio();
                    playTrainingCompleteSound();
                  }}
                  className="h-14 sm:h-16"
                >
                  <div className="text-center">
                    <div className="text-base sm:text-lg mb-1">🔊</div>
                    <div className="text-xs sm:text-sm">Conclusão do Treino</div>
                  </div>
                </SecondaryLargeButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}