import dotenv from "dotenv";
dotenv.config({
    path: ".env.local"
});

import fs from "fs";
import http from "http";
import handler from "./api/send.js";

const server = http.createServer(async (req, res) => {

    // adiciona o método json() igual ao Express
    res.json = (obj) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
    };

    res.status = (code) => {
        res.statusCode = code;
        return res;
    };

    if (req.url === "/" || req.url === "/index.html") {

        const html = fs.readFileSync("./public/index.html");

        res.setHeader("Content-Type", "text/html");

        res.end(html);

        return;

    }

    if (req.url === "/api/send") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {
                req.body = JSON.parse(body || "{}");
            }
            catch {
                req.body = {};
            }

            handler(req, res);

        });

        return;
    }

    res.statusCode = 404;
    res.end("Not Found");

});

server.listen(3000, () => {
    console.log("Servidor iniciado");
    console.log("http://localhost:3000");
});