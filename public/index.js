async function fetchData() {
  console.info('Starting fetchData');
  try {
    const response = await fetch('/data');
    const data = await response.json();
    console.log(data);
    const tbody = document.querySelector('#dataTable tbody');
    const results = data.results;
    results.forEach((result) => {
      if (!result.sbc_status === 'ok') {
        const row = document.createElement('tr');
        console.log(result);
        row.innerHTML = `
          <td>${result.timestamp}</td>
          <td>${result.source}</td>
          <td>${result.sbc_status}</td>
          <td>${result.status}</td>
          <td>${result.calls_in}</td>
          <td>${result.calls_out}</td>
        `;
        tbody.append(row);
      }
    });
  } catch (err) {
    console.error('Error retrieving data', err.message);
  }
}

fetchData();
setInterval(fetchData, 5000);
