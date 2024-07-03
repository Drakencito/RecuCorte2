import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const messages: { user: string, response: Response }[] = []; 
app.use(express.json());
app.use(cors());

// Endpoint para alumnos
app.get('/alumnos', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

  
    messages.push({ user: 'alumno', response: res });

    req.on('close', () => {
  
        res.end();
    });
});

// Endpoint para maestros
app.get('/maestros', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

   
    messages.push({ user: 'maestro', response: res });

    req.on('close', () => {
     
        res.end();
    });
});


app.post('/message', (req: Request, res: Response) => {
    const { message, user } = req.body;

    
    const clientsToSend = messages.filter(client => client.user === user);

    clientsToSend.forEach(client => {
        client.response.write(`data: ${message}\n`);
        client.response.write(`data: ${user}\n\n`);
    });

    res.status(200).json({ success: true, message: "Mensaje enviado" });
});

app.listen(3000, () => console.log("API corriendo en el puerto 3000"));
