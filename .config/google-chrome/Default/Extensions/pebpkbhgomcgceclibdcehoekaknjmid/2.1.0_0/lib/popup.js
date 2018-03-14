setTimeout(function() {
    function openUrl(_url) {
        try {
            chrome.tabs.query({ active: true }, function(e) {
                chrome.tabs.update(e.id, { url: _url });
                window.close();
            });
            return;
        } catch (e) {

            chrome.tabs.create({
                url: _url
            });
            window.close();
        }

    }

    function enabled(e) {
        e.preventDefault();
        chrome.runtime.sendMessage({ disableAll: true });
        document.getElementById('disable').text = 'Stop Redirecting Searches';
        document.getElementById('disable').removeEventListener('click', enabled);
        document.getElementById('disable').addEventListener('click', disabled);
    }

    function disabled(e) {
        e.preventDefault();
        chrome.runtime.sendMessage({ disableAll: false });
        document.getElementById('disable').text = 'Start Search Redirection';
        document.getElementById('disable').removeEventListener('click', disabled);
        document.getElementById('disable').addEventListener('click', enabled);
    }

    try {
        chrome.storage.sync.get(['EnableGoogle', 'EnableBing', 'EnableAdditional'], function(response) 
        { 
            if (response.EnableGoogle && response.EnableBing && response.EnableAdditional) {
                document.getElementById('disable').text = 'Stop Redirecting Searches';
                document.getElementById('disable').addEventListener('click', disabled);
            }
            else {
                document.getElementById('disable').text = 'Start Search Redirection';
                document.getElementById('disable').addEventListener('click', enabled);
            } 
            document.getElementById('home').addEventListener('click', function(e) {
                e.preventDefault();
                openUrl('https://www.searchencrypt.com/');
            });
            document.getElementById('about').addEventListener('click', function(e) {
                e.preventDefault();
                openUrl('https://www.searchencrypt.com/about');
            });
            document.getElementById('help').addEventListener('click', function(e) {
                e.preventDefault();
                openUrl('http://support.searchencrypt.com');
            });
            document.getElementById('settings').addEventListener('click', function(e) {
                e.preventDefault();
                openUrl(chrome.extension.getURL('settings.html'));
            });
        });
    } catch (e) {}
}, 250);
