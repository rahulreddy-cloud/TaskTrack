const express = require("express");
const app = express();

app.use(express.json());

let resources = [];
let id = 1;

// CREATE - POST
app.post("/resources", (req, res) => {
    const { name, type } = req.body;

    if (!name || !type) {
        return res.status(400).json({
            error: "Name and type are required"
        });
    }

    const resource = { id: id++, name, type };
    resources.push(resource);

    res.status(201).json(resource);
});

// READ - GET ALL
app.get("/resources", (req, res) => {
    res.json(resources);
});

// READ - GET BY ID
app.get("/resources/:id", (req, res) => {
    const resource = resources.find(
        r => r.id === Number(req.params.id)
    );

    if (!resource) {
        return res.status(404).json({
            error: "Resource not found"
        });
    }

    res.json(resource);
});

// UPDATE - PUT
app.put("/resources/:id", (req, res) => {
    const resource = resources.find(
        r => r.id === Number(req.params.id)
    );

    if (!resource) {
        return res.status(404).json({
            error: "Resource not found"
        });
    }

    const { name, type } = req.body;

    if (!name || !type) {
        return res.status(400).json({
            error: "Name and type are required"
        });
    }

    resource.name = name;
    resource.type = type;

    res.json(resource);
});

// DELETE
app.delete("/resources/:id", (req, res) => {
    const index = resources.findIndex(
        r => r.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Resource not found"
        });
    }

    resources.splice(index, 1);

    res.json({
        message: "Resource deleted successfully"
    });
});

// Invalid JSON error handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            error: "Invalid JSON"
        });
    }

    res.status(500).json({
        error: "Internal server error"
    });
});

// Unknown route handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});