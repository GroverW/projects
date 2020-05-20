const updateList = [
    '05-19-2020.html',
    '05-18-2020.html',
    '05-05-2020.html',
    '05-04-2020.html',
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
    '11-04-2019.html',
]

const updateContent = document.querySelector('#update_content');
const updatesNav = document.querySelector('#updates_nav');


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
            updateContent.insertBefore(update, updatesNav);
        });
    } catch (err) {
        console.log(`Failed to fetch page: ${err}`);
    }
}

const getPage = (queryString) => {
    const parts = queryString.slice(1).split('&')
    const pageParts = parts.find(part => part.search('page') > -1);
    return pageParts && +pageParts.split('=')[1];
}

const page = getPage(window.location.search) || 1;
const start = (page - 1) * 5;
const end = Math.min(start + 5, updateList.length);

loadUpdates(updateList.slice(start, end));

const createNav = (text, num, cls) => {
    let link = document.createElement('a');
    link.href = `?page=${num}`;
    link.classList.add(cls);
    link.innerText = text;
    updatesNav.appendChild(link);
}

if(start > 0) createNav('Previous', page - 1, 'left');
if(end < updateList.length) createNav('Next', page + 1, 'right');


