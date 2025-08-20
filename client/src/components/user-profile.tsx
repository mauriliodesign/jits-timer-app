import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function UserProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                            <AvatarFallback className="bg-[#59FF3A] text-[#121214]">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#17171a] border-[#1e1e21]" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.displayName && (
              <p className="font-medium text-white">{user.displayName}</p>
            )}
            {user.email && (
                              <p className="w-[200px] truncate text-sm text-[#5a5a60]">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator className="bg-[#252529]" />
        <Link href="/profile">
          <DropdownMenuItem className="text-[#5a5a60] hover:bg-[#1e1e21] focus:bg-[#1e1e21] w-full">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil da Academia</span>
          </DropdownMenuItem>
        </Link>
                <DropdownMenuSeparator className="bg-[#252529]" />
        <DropdownMenuItem
          className="text-[#5a5a60] hover:bg-[#1e1e21] focus:bg-[#1e1e21]"
          onClick={handleLogout}
          disabled={loading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading ? "Saindo..." : "Sair"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}