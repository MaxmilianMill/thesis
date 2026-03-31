import express, {} from 'express';
import { globalErrorHandler } from './middlewares/global-error-handler.js';
import v1Router from './routes/index.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/v1", v1Router);
// keep error handler as last use statement
app.use(globalErrorHandler);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map