import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const filePath = "data.json";

    // Read the existing file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Internal Server Error");
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            return res.status(500).send("Internal Server Error");
        }

        // Render the index.ejs template with jsonData
        res.render("index.ejs", { entries: jsonData });
    });
});

app.post("/submit", (req, res) => {
    const newEntry = {
        title: req.body.title,
        info: req.body.info
    };

    // Path to your JSON file
    const filePath = "data.json";

    // Read the existing file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Internal Server Error");
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            return res.status(500).send("Internal Server Error");
        }

        // Add the new entry
        jsonData.push(newEntry);

        // Write back to the file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf8", (writeErr) => {
            if (writeErr) {
                console.error("Error writing to file:", writeErr);
                return res.status(500).send("Internal Server Error");
            }

            res.redirect("/");
        });
    });
});

app.post("/delete/:index", (req, res) => {
    const index = req.params.index;
    
    // Read the current entries from data.json
    const filePath = "data.json";
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Internal Server Error");
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            return res.status(500).send("Internal Server Error");
        }

        // Remove the entry at the specified index
        if (index >= 0 && index < jsonData.length) {
            jsonData.splice(index, 1);

            // Write back to the file
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf8", (writeErr) => {
                if (writeErr) {
                    console.error("Error writing to file:", writeErr);
                    return res.status(500).send("Internal Server Error");
                }

                res.redirect("/");
            });
        } else {
            res.status(404).send("Entry not found");
        }
    });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})