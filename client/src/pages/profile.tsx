import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
            <Button className="mt-4">Fazer Login</Button>
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
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/control">
            <Button variant="outline" size="sm" className="mr-4 bg-[#1e1e21] border-[#59FF3A] hover:bg-[#59FF3A] hover:text-[#121214] text-[#59FF3A]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold">Configurações</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-[#17171a] border-[#1e1e21]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Building2 className="h-5 w-5 mr-2 text-[#59FF3A]" />
                Informações da Academia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current User Info */}
              <div className="flex items-center space-x-4 p-4 bg-[#1e1e21] rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback>
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-white">{user.displayName || user.email}</p>
                  <p className="text-sm text-[#5a5a60]">Instrutor</p>
                </div>
              </div>

              {/* Academy Logo */}
              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="text-white">Logo da Academia (URL)</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://exemplo.com/logo.png"
                    className="bg-[#1e1e21] border-[#252529] text-white"
                  />
                  {formData.logoUrl && (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={formData.logoUrl} />
                      <AvatarFallback>
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>

              {/* Academy Name */}
              <div className="space-y-2">
                <Label htmlFor="academyName" className="text-white">Nome da Academia</Label>
                <Input
                  id="academyName"
                  value={formData.academyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, academyName: e.target.value }))}
                  placeholder="Nome da sua academia"
                  className="bg-[#1e1e21] border-[#252529] text-white"
                  required
                />
              </div>

              {/* Instructor Name */}
              <div className="space-y-2">
                <Label htmlFor="instructorName" className="text-white">Nome do Instrutor</Label>
                <Input
                  id="instructorName"
                  value={formData.instructorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructorName: e.target.value }))}
                  placeholder="Seu nome como instrutor"
                  className="bg-[#1e1e21] border-[#252529] text-white"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={createProfileMutation.isPending || updateProfileMutation.isPending}
                className="w-full h-12 bg-[#59FF3A] hover:bg-[#4DEB2E] text-[#121214]"
              >
                {createProfileMutation.isPending || updateProfileMutation.isPending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : profile ? (
                  <>
                    <Trophy className="mr-2 h-5 w-5" />
                    Atualizar Perfil
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-5 w-5" />
                    Criar Perfil
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>

        {/* Sound Tests Section */}
        <div className="mt-8">
          <Card className="bg-[#17171a] border-[#1e1e21]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Volume2 className="h-5 w-5 mr-2 text-[#59FF3A]" />
                Testes de Som
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    enableAudio();
                    playStartRoundSound();
                  }}
                  variant="outline"
                  className="bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white h-16"
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">🔊</div>
                    <div className="text-sm">Início de Round</div>
                  </div>
                </Button>
                <Button
                  onClick={() => {
                    enableAudio();
                    playEndRoundSound();
                  }}
                  variant="outline"
                  className="bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white h-16"
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">🔊</div>
                    <div className="text-sm">Fim de Round</div>
                  </div>
                </Button>
                <Button
                  onClick={() => {
                    enableAudio();
                    playRestStartSound();
                  }}
                  variant="outline"
                  className="bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white h-16"
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">🔊</div>
                    <div className="text-sm">Início de Descanso</div>
                  </div>
                </Button>
                <Button
                  onClick={() => {
                    enableAudio();
                    playTrainingCompleteSound();
                  }}
                  variant="outline"
                  className="bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white h-16"
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">🔊</div>
                    <div className="text-sm">Conclusão do Treino</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}