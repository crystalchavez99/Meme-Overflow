npm install
npm install pg
npm install connect-pg-simple
cp .env.example .env
psql < db_setup.sql
npx dotenv sequelize-cli db:create
npx sequelize-cli model:generate --name User --attributes username:string,hashedPassword:string,email:string,avatarUrl:string,maxLikes:integer,currentLikes:integer
npx dotenv sequelize-cli db:migrate
npx sequelize-cli model:generate --name Question --attributes title:string,description:text,email:string,userId:integer
npx sequelize-cli model:generate --name Meme --attributes url:string
npx sequelize-cli model:generate --name Answer --attributes questionId:integer,title:string,userId:integer,memeId:integer,memeUrl:string
# add asssosiation between  modeles
npx sequelize-cli model:generate --name Tag --attributes name:string
npx sequelize-cli model:generate --name Comment --attributes userId:integer,answerId:integer,content:text
# add asssosiation between  modeles
npx sequelize-cli model:generate --name UserMeme --attributes userId:integer,memeId:integer
npx sequelize-cli model:generate --name Upvote --attributes userId:integer,answerId:integer
npx sequelize-cli model:generate --name Downvote --attributes userId:integer,answerId:integer
npx sequelize-cli model:generate --name QuestionTag --attributes questionId:integer,tagId:integer
npx dotenv sequelize-cli db:migrate
npm install express-validator csurf

# generate secret in node repl
require("crypto").randomBytes(32).toString("hex");

npm install bcryptjs
 npx dotenv sequelize-cli db:drop
 npx dotenv sequelize-cli db:create
 npx dotenv sequelize-cli db:migrate

npx sequelize-cli seed:generate --name memes
npx sequelize-cli seed:generate --name users
npx sequelize-cli seed:generate --name questions
npx sequelize-cli seed:generate --name answers
npx dotenv sequelize-cli db:seed:all
