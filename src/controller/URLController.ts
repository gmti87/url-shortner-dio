import { config } from '../config/Constants'
import { Request, Response } from 'express'
import shortId from 'shortid'
import { URLModel } from '../database/model/URL'

export class URLController {
    public async shorten(req: Request, response: Response): Promise<void> {
        // Ver se a URL já não existe
        // console.log(req.body)
        const { originURL } = req.body
        const url = await URLModel.findOne({ originURL })
        if(url) {
            response.json(url)
            return
        }
        const hash = shortId.generate()
        const shortURL = `${config.API_URL}/${hash}`
        // Criar o hash pra essa URL
        // Salvar a URL no banco
        // Retornar a URL que a gente criou
        const newURL = await URLModel.create({ hash, shortURL, originURL })
        //response.json({ originURL, hash, shortURL})
        response.json(newURL)
    }

    public async redirect(req: Request, response: Response): Promise<void> {
        // Pegar hash da URL
        const { hash } = req.params
        const url = await URLModel.findOne({ hash })
        
        if(url) {
            response.redirect(url.originURL)
            return
        }
        // Encontrar a URL original pelo hash
        //const url = {
        //    originURL: 'https://cloud.mongodb.com/v2/62865d08e9b25d2ff4be11e8#clusters',
        //    hash: '3fKSDdx8y',
        //   shortURL: 'http://localhost:5000/3fKSDdx8y'
        //}
        // Redirecionar para a URL original a partir do que encontrou no DB
        //response.redirect(url.originURL)
        response.status(400).json({ error: 'URL not found' })
    } 
}