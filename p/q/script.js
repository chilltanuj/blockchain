document.getElementById('connect-wallet').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            alert('Connected: ' + account);
            // Future steps: Implement account-based login/redirects
        } catch (error) {
            console.error('Connection failed', error);
        }
    } else {
        alert('MetaMask is not installed. Please install it to use the Web3 features.');
    }
});
