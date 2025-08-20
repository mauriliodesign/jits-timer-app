import { Request, Response, NextFunction } from "express";

// Middleware para verificar se o usuário está autenticado
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Para desenvolvimento local, permitir todas as requisições
  if (process.env.NODE_ENV === "development") {
    return next();
  }

  // Em produção, verificar se há um userId válido
  const userId = req.params.userId || req.body.userId;
  
  if (!userId) {
    return res.status(401).json({ message: "User ID required" });
  }

  // Validar formato do userId (Firebase UID tem 28 caracteres)
  if (typeof userId !== "string" || userId.length < 10) {
    return res.status(401).json({ message: "Invalid user ID format" });
  }

  // Adicionar o userId ao request para uso posterior
  (req as any).userId = userId;
  next();
}

// Middleware para rotas públicas (não precisam de autenticação)
export function publicRoute(req: Request, res: Response, next: NextFunction) {
  next();
}

// Middleware para logging de erros de autenticação
export function logAuthErrors(req: Request, res: Response, next: NextFunction) {
  const originalSend = res.send;
  
  res.send = function(data) {
    if (res.statusCode === 401) {
      console.error(`Auth error for ${req.method} ${req.path}:`, {
        userId: req.params.userId || req.body.userId,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
}
