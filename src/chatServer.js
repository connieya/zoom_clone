import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("chat"));
app.get("/*", (req, res) => res.redirect("/")); // 어떤 URL 을 입력해도 home 로 리다이렉트 해주는 코드

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000);
