import nodemailer from "nodemailer";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Método não permitido"
        });
    }

    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    try {

        const {
            nome,
            serial,
            firmware,
            detalhe,
            zipFileName,
            zipContent
        } = req.body;

        // Validação simples
        if (!nome || !serial || !detalhe || !zipFileName || !zipContent) {
            return res.status(400).json({
                success: false,
                error: "Dados incompletos."
            });
        }

        console.log(`[REQ] Recebida requisição de ${serial}`);

        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

        // 👇 CRIAR AQUI (IMPORTANTE)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Monitor UPS" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `Dados recebidos do UPS - ${serial}`,

            html: `
                <h2>Dados recebidos do UPS</h2>

                <table border="1" cellpadding="5" cellspacing="0">
                    <tr>
                        <td><b>Equipamento</b></td>
                        <td>${nome}</td>
                    </tr>

                    <tr>
                        <td><b>Serial</b></td>
                        <td>${serial}</td>
                    </tr>

                    <tr>
                        <td><b>Firmware</b></td>
                        <td>${firmware ?? "Não informado"}</td>
                    </tr>

                    <tr>
                        <td><b>Detalhe</b></td>
                        <td>${detalhe}</td>
                    </tr>

                    <tr>
                        <td><b>Data/Hora</b></td>
                        <td>${new Date().toISOString()}</td>
                    </tr>
                </table>

                <p>O arquivo ZIP contendo os logs está anexado.</p>
            `,

            attachments: [
                {
                    filename: zipFileName,
                    content: zipContent,
                    encoding: "base64",
                    contentType: "application/zip"
                }
            ]
        });

        console.log(`[OK] Email enviado para ${serial}`);

        return res.status(200).json({
            success: true
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message
        });

    }

}