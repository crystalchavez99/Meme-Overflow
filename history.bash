npm install
npm install pg
npm install connect-pg-simple
cp .env.example .env
psql < db_setup.sql
npx dotenv sequelize-cli db:create
npx sequelize-cli model:generate --name User --attributes username:string,hashedPassword:string,email:string,avatarUrl:string,maxLikes:integer,currentLikes:integer
npx dotenv sequelize-cli db:migrate
npx sequelize-cli model:generate --name Question --attributes title:string,description:text,email:string,userId:integer
