import express from "express";
import authorsRouter from "./routes/authors.js";
import publishersRouter from "./routes/publishers.js";
import categoriesRouter from "./routes/categories.js";
import booksRouter from "./routes/books.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/authors", authorsRouter);
app.use("/api/publishers", publishersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/books", booksRouter);

export default app;
