async function fetchData() {
  console.info('Starting fetchData');
  try {
    const response = await fetch('/data');
    const data = await response.json();
    const tbodyData = document.querySelector('#dataTable tbody');
    const tbodyError = document.querySelector('#errorTable tbody');
    const results = data.results;
    results.forEach((result) => {
      console.log(result);
      if (result.sbc_status === 'ok') {
        tbodyData.innerHTML = '';
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${result.datetime}</td>
          <td>${result.source}</td>
          <td>${result.sbc_status}</td>
          <td>${result.status}</td>
          <td>${result.calls_in}</td>
          <td>${result.calls_out}</td>
        `;
        tbodyData.append(row);
      } else {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${result.timestamp}</td>
          <td>${result.source}</td>
          <td>${result.sbc_status}</td>
          <td>${result.status}</td>
        `;
        tbodyError.append(row);
      }
    });
  } catch (err) {
    console.error('Error retrieving data', err.message);
  }
}

fetchData();
setInterval(fetchData, 30000);
