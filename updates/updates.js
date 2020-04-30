const updateList = [
    '04-30-2020.html',
    '04-29-2020.html',
    '04-28-2020.html',
    '04-27-2020.html',
    '04-18-2020.html',
    '12-17-2019.html',
    '12-12-2019.html',
    '12-05-2019.html',
    '11-27-2019.html',
    '11-22-2019.html',
    '11-18-2019.html',
    '11-05-2019.html',
    '11-04-2019.html'
]

const updateContent = document.querySelector('#update_content');

const loadUpdates = async list => {
    try {
        const updatePromises = list.map(item => fetch(`update-files/${item}`))
        const updates = await Promise.all(updatePromises)
        
        updates.forEach(async element => {
            const text = await element.text();
            const parser = new DOMParser();
            const html = parser.parseFromString(text,"text/html");
            const update = html.querySelector('.update');
            Prism.highlightAllUnder(update, true);
            updateContent.appendChild(update)
        })
    } catch (err) {
        console.log(`Failed to fetch page: ${err}`);
    }
}

loadUpdates(updateList)




