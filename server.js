const express = require('express');
const app = express();
const port = 3000;

let dataHistory = [];

const URLs = ['http://localhost:8000/axa/purecloud/status', 'http://localhost:8000/axa/telenet/status', 'http://localhost:8000/axa/teams/status'];

function normalizeData(sourceUrl, data) {
  let source = sourceUrl.substring(26);
  let cutOff = source.indexOf('/');
  source = source.substring(0, cutOff);
  source = source.charAt(0).toUpperCase() + source.slice(1);

  if (data.details) {
    return {
      source: source,
      datetime: data.datetime,
      sbc_status: data.sbc_status,
      status: data.status,
      calls_in: data.details.calls_in,
      calls_out: data.details.calls_out,
    };
  } else {
    return {
      source: source,
      datetime: data.datetime,
      sbc_status: data.info || null,
      status: data.status_system || null,
      calls_in: 0,
      calls_out: 0,
    };
  }
}

// Middleware to server static files (HTML, JS, CSS)
app.use(express.static('public'));

// Endpoint to retrieve data from server
app.get('/data', async (req, res) => {
  try {
    const results = await Promise.all(URLs.map((url) => fetch(url).then((r) => r.json())));
    const normalized = results.map((result, i) => normalizeData(URLs[i], result));
    console.log(normalized);
    res.json({
      timestamp: new Date().toLocaleString("nl-BE", { timeZone: "CET"}),
      results: normalized,
    });
  } catch (err) {
    console.error('Fout bij ophalen:', err.message);
    res.status(500).json({ error: 'Kon externe data niet ophalen' });
  }
});

app.listen(port, () => {
  console.log(`Server active on http://localhost:${port}`);
});
