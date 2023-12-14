const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');


const cors = require('cors'); // Import the cors middleware

const PORT = 3000;

// PostgreSQL connection settings
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydatabase',
    password: 'pgadmin',
    port: 5432
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Handle preflight requests
app.options('/save_shapes', cors());

app.post('/save_shapes', async (req, res) => {
    try {
        const { shape_type, geometries } = req.body;


        if (!shape_type || !geometries) {
            console.error('Missing required parameters');
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        console.log('Executing query:', shape_type, geometries);
        var geometry ={
            type :shape_type,
            coordinates :geometries
        }

        const query = 'INSERT INTO my_shapes (feature_type, geometry) VALUES ($1, ST_GeomFromText($2, 4326))';
        await pool.query(query, [shape_type, geometries]);


        res.json({ message: 'Data stored successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error storing data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
