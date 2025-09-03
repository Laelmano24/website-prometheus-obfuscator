import express from "express"
import multer from "multer"
import { dirname, join, extname } from "path"
import { readFileSync, writeFileSync, unlinkSync } from "fs"
import { fileURLToPath } from "url"
import { exec } from "child_process"
import { stdout } from "process"

const __dirname = dirname(fileURLToPath(import.meta.url))
const prometheusPath = join(__dirname, "prometheus")
const uploadsPath = join(__dirname, "uploads")

const app = express()
const upload = multer({ dest: "./src/uploads/" })

app.set("view engine", "ejs")
app.set("views", join(__dirname, "views"))

app.use(express.static(join(__dirname, "public")))

app.post("/obfuscation", upload.single("file"), (req, res) => {

    const { filename, originalname } = req.file
    if (!filename || !originalname) return res.status(401).json({ message: "???" })

    try {

        const extFiles = [".lua", ".luau", ".txt"]
        const checkExt = extFiles.some(extName => extName === extname(originalname))
        if ( !checkExt ) return res.render("messageError", { messageError: "Insert a file containing the ext .txt .lua .luau" })
        
        const uploadPath = join(uploadsPath, filename)

        const contentClient = readFileSync(uploadPath, "utf-8")
        if ( !contentClient ) return res.render("messageError", { messageError: "Error reading file" })

        const moddiferFile = writeFileSync(join(prometheusPath, "your_file.lua"), contentClient)

        exec(`cd ${join(prometheusPath)} && lua ./cli.lua --preset Medium ./your_file.lua`, (err, stdout, stderr) => {
            
            if ( err || stderr ) return res.render("messageError", { messageError: "Terminal command error" })

            const contentObfuscator = readFileSync(join(prometheusPath, "your_file.obfuscated.lua"), "utf-8")
            if ( !contentObfuscator ) return res.render("messageError", { messageError: "Error reading obfuscated file" })

            unlinkSync(uploadPath)

            return res.render("obfuscation-screen", { content: contentObfuscator, fileName: filename + ".txt" })

        })

    } catch(err) {

        console.log("Erro do servidor \n" + err)
        res.status(500).json({ message: err })

    }

})

app.listen(3000, () => console.log("Server rodando..."))