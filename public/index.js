async function fetchData() {
  console.info('Starting fetchData');
  try {
    const response = await fetch('/data');
    const data = await response.json();
    const trPurecloudData = document.getElementById('purecloud-data');
    const trTeamsData = document.getElementById('teams-data');
    const trTelenetData = document.getElementById('telenet-data');
    const trPurecloudError = document.getElementById('purecloud-error');
    const trTeamsError = document.getElementById('teams-error');
    const trTelenetError = document.getElementById('telenet-error');
    const results = data.results;

    results.forEach((result) => {
      console.log(result);
      if (result.sbc_status === 'ok') {
         const cols = `
          <td>${result.source}</td>
          <td>${result.datetime}</td>
          <td>${result.sbc_status}</td>
          <td>${result.status}</td>
          <td>${result.calls_in}</td>
          <td>${result.calls_out}</td>
        `;
        if (result.source === 'Purecloud') {
          trPurecloudData.innerHTML = '';
          trPurecloudData.innerHTML = cols;
        } else if (result.source === 'Teams') {
          trTeamsData.innerHTML = '';
          trTeamsData.innerHTML = cols;
        } else if (result.source == 'Telenet') {
           trTelenetData.innerHTML = '';
           trTelenetData.innerHTML = cols;
        }
      } else {
        const cols = `
          <td>${result.source}</td>
          <td>${result.timestamp}</td>
          <td>${result.sbc_status}</td>
          <td>${result.status}</td>
        `;
        if (result.source === 'Purecloud') {
          trPurecloudError.innerHTML += cols
        } else if (result.source === 'Teams') {
          trTeamsError.innerHTML += cols
        } else if (result.source == 'Telenet') {
           trTelenetError.innerHTML += cols
        }
      }
    });
  } catch (err) {
    console.error('Error retrieving data', err.message);
  }
}

let intervalId;

const startPolling = (delay) => {
  if (intervalId) clearInterval(intervalId);
  
  fetchData();
  
  intervalId = setInterval(fetchData, delay);
  console.log('New interval selected:', delay)
}

const select = document.getElementById('polling-interval');
console.log(Number(select.value))
startPolling(Number(select.value));

select.addEventListener('change', (event) => {
  console.log(event.target.value)
  startPolling(Number(event.target.value));
});
