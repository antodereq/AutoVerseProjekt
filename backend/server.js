const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080']
}));

// Database connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'autoverse2'
};

app.get('/api/cars', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const query = `
      SELECT DISTINCT
        konfiguracja.id,
        marka.nazwa AS brand,
        model.nazwa AS model,
        CASE
          WHEN model.segment LIKE '%sport%' THEN '["sport"]'
          WHEN model.segment LIKE '%coupe%' THEN '["daily", "sport"]'
          ELSE '["daily"]'
        END AS usageTags,
        typ_nadwozia.nazwa AS bodyType,
        skrzynia.nazwa AS transmission,
        naped.nazwa AS drive,
        typ_paliwa.nazwa AS fuelType,
        uklad_cylindrow.nazwa AS engineLayout,
        silnik.pojemnosc_cm3 AS engineCapacityCc,
        silnik.nazwa_handlowa AS engineName,
        konfiguracja.moc_km AS power,
        konfiguracja.rok_od AS yearFrom,
        konfiguracja.rok_do AS yearTo,
        kraj.nazwa AS country,
        zdjecie_modelu.sciezka AS imageUrl,
        konfiguracja.moc_km * 1000 AS priceMin,
        konfiguracja.moc_km * 1500 AS priceMax,
        konfiguracja.spalanie_srednie AS avgConsumptionLPer100
      FROM konfiguracja
      JOIN generacja_nadwozie ON konfiguracja.generacja_nadwozie_id = generacja_nadwozie.id
      JOIN generacja ON generacja_nadwozie.generacja_id = generacja.id
      JOIN model ON generacja.model_id = model.id
      JOIN marka ON model.marka_id = marka.id
      JOIN kraj ON marka.kraj_id = kraj.id
      JOIN silnik ON konfiguracja.silnik_id = silnik.id
      JOIN typ_nadwozia ON generacja_nadwozie.typ_nadwozia_id = typ_nadwozia.id
      JOIN naped ON konfiguracja.naped_id = naped.id
      JOIN skrzynia ON konfiguracja.skrzynia_id = skrzynia.id
      JOIN typ_paliwa ON silnik.typ_paliwa_id = typ_paliwa.id
      LEFT JOIN uklad_cylindrow ON silnik.uklad_cylindrow_id = uklad_cylindrow.id
      LEFT JOIN zdjecie_modelu ON model.id = zdjecie_modelu.model_id
      ORDER BY marka.nazwa, model.nazwa, konfiguracja.rok_od
    `;

    const [rows] = await connection.execute(query);

    // Normalize response types and parse usageTags
    const cars = rows.map(car => ({
      ...car,
      usageTags: JSON.parse(car.usageTags),
      avgConsumptionLPer100: Number(car.avgConsumptionLPer100) || 0,
      priceMin: Number(car.priceMin) || 0,
      priceMax: Number(car.priceMax) || 0,
      power: Number(car.power) || 0,
      engineCapacityCc: Number(car.engineCapacityCc) || 0,
      yearFrom: Number(car.yearFrom) || 0,
      yearTo: Number(car.yearTo) || 0
    }));

    await connection.end();
    res.json(cars);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/api/filters', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [brands] = await connection.execute(
      'SELECT DISTINCT nazwa FROM marka ORDER BY nazwa'
    );

    const [models] = await connection.execute(
      'SELECT DISTINCT model.nazwa AS name, marka.nazwa AS brand FROM model JOIN marka ON model.marka_id = marka.id ORDER BY marka.nazwa, model.nazwa'
    );

    const [bodyTypes] = await connection.execute(
      'SELECT DISTINCT nazwa FROM typ_nadwozia ORDER BY nazwa'
    );

    const [transmissions] = await connection.execute(
      'SELECT DISTINCT nazwa FROM skrzynia ORDER BY nazwa'
    );

    const [driveTypes] = await connection.execute(
      'SELECT DISTINCT nazwa FROM naped ORDER BY nazwa'
    );

    const [fuelTypes] = await connection.execute(
      'SELECT DISTINCT nazwa FROM typ_paliwa ORDER BY nazwa'
    );

    const [engineLayouts] = await connection.execute(
      'SELECT DISTINCT nazwa FROM uklad_cylindrow WHERE nazwa IS NOT NULL ORDER BY nazwa'
    );

    const [countries] = await connection.execute(
      'SELECT DISTINCT nazwa FROM kraj ORDER BY nazwa'
    );

    await connection.end();

    res.json({
      brands: brands.map(({ nazwa }) => nazwa),
      models: models.map(({ name, brand }) => ({ name, brand })),
      bodyTypes: bodyTypes.map(({ nazwa }) => nazwa),
      transmissions: transmissions.map(({ nazwa }) => nazwa),
      driveTypes: driveTypes.map(({ nazwa }) => nazwa),
      fuelTypes: fuelTypes.map(({ nazwa }) => nazwa),
      engineLayouts: engineLayouts.map(({ nazwa }) => nazwa),
      countries: countries.map(({ nazwa }) => nazwa)
    });
  } catch (error) {
    console.error('Filters error:', error);
    res.status(500).json({ error: 'Unable to load filters' });
  }
});

app.get('/api', (req, res) => {
  res.json({ message: 'AutoVerse backend is running.' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`AutoVerse backend listening at http://localhost:${PORT}`);
});
