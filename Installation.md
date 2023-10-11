Installation des package

npm install --save @nestjs/swagger swagger-ui-express
npm install dotenv
npm install @nestjs/passport passport
npm install @nestjs/jwt passport-jwt jsonwebtoken
npm install typeorm pg --save
npm install @types/node --save-dev
npm install @nestjs/config
npm i axios

Essaie d'installation d'un Certificat SSL auto-signé
openssl genpkey -out private-key.pem -algorithm RSA -aes256
openssl req -new -key private-key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey private-key.pem -out certificate.pem
