import { Injectable, OnModuleInit } from '@nestjs/common';
import { exec } from 'child_process';
import * as schedule from 'node-schedule';
import { readFileSync, writeFileSync } from 'fs';

@Injectable()
export class CertGenerateService implements OnModuleInit {
  // Date du dernier renouvellement du certificat
  private lastRenewal: Date;
  // Emplacement du fichier où est stockée la date du dernier renouvellement
  private readonly RENEWAL_FILE = './lastRenewal.txt';

  constructor() {
    // Tentative de lecture de la date du dernier renouvellement à partir du fichier
    try {
      const storedDate = readFileSync(this.RENEWAL_FILE, 'utf-8');
      this.lastRenewal = new Date(storedDate);
    } catch (e) {
      console.error(
        'Erreur lors de la lecture de la date du dernier renouvellement.',
        e,
      );
    }
  }

  onModuleInit() {
    // Planifie une vérification quotidienne pour voir si le certificat doit être renouvelé
    schedule.scheduleJob('0 0 1 * *', () => {
      const now = new Date();
      // Vérifie si 11 mois se sont écoulés depuis le dernier renouvellement
      if (
        !this.lastRenewal ||
        now.getTime() - this.lastRenewal.getTime() >=
          11 * 30 * 24 * 60 * 60 * 1000
      ) {
        // Si c'est le cas, renouvelle le certificat
        this.renewCert();
        // Enregistre la date actuelle comme nouvelle date de renouvellement
        this.lastRenewal = now;
        writeFileSync(this.RENEWAL_FILE, now.toISOString());
      }
    });
  }

  // Méthode pour renouveler le certificat
  private renewCert() {
    const CERT_DIR = './';

    // Supprimer les anciens certificats
    exec(`rm -f ${CERT_DIR}/private-key.pem`);
    exec(`rm -f ${CERT_DIR}/certificate.pem`);

    // Générer un nouveau certificat
    exec(
      `openssl req -newkey rsa:4096 -nodes -keyout ${CERT_DIR}/private-key.pem -x509 -days 365 -out ${CERT_DIR}/certificate.pem -subj "/CN=localhost"`,
    );

    // Code pour relancer PM2
    exec('pm2 restart datageek-back', (pm2Err, pm2Stdout, pm2Stderr) => {
      if (pm2Err) {
        console.error(`Erreur lors du redémarrage du serveur : ${pm2Err}`);
        return;
      }
      console.log(`PM2 stdout: ${pm2Stdout}`);
      console.log(`PM2 stderr: ${pm2Stderr}`);
    });
  }
}
