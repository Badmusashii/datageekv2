import { Injectable, NestMiddleware } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Middleware pour limiter le nombre de requêtes par adresse IP
@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  // Crée une seule instance du middleware rateLimit
  private limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limite chaque IP à 200 requêtes par fenêtre
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.limiter(req, res, next); // Utilise cette instance unique pour toutes les requêtes
  }
}
