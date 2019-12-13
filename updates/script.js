let updateList = [
    '12-05-2019.html',
    '11-27-2019.html',
    '11-22-2019.html',
    '11-18-2019.html',
    '11-05-2019.html',
    '11-04-2019.html'
]

let updateContent = document.querySelector('#update_content');

//updateList.forEach(file => updateOutput.push(fetch(`update-files/${file}`)));

Promise.all(updateList.map(file => 
    fetch(`update-files/${file}`)
        .then(response => response.text())
        .catch(err => console.log('Failed to fetch page: ' + err)))
).then(updates => {
    updates.forEach(html => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html,"text/html");

        let update = doc.querySelector('.update');   
        updateContent.appendChild(update);
    })
})
/*
updateList.forEach(file => {
    fetch(`update-files/${file}`)
    .then(response => {
        return response.text();
    })
    .then(html => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html,"text/html");

        let update = doc.querySelector('.update');   
        updateContent.appendChild(update);
    })
    .catch(err => {
        console.log('Failed to fetch page: ' + err);
    });
});*/
