// Initialize Firebase
var config = {
    apiKey: 'AIzaSyC3k0r6-t3-lpt0cMg3h2nQMs_D4qNhN0M',
    authDomain: 'hypha-app-dashboard-1a7ed.firebaseapp.com',
    databaseURL: 'https://hypha-app-dashboard-1a7ed.firebaseio.com',
    projectId: 'hypha-app-dashboard-1a7ed',
    storageBucket: 'hypha-app-dashboard-1a7ed.appspot.com',
    messagingSenderId: '882407807561'
};
firebase.initializeApp(config);
// Get a reference to the database service
var db = firebase.firestore();

// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});

function handleForm(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const newFungus = {};
    for (var pair of form.entries()) {
        if (pair[1] === '') {
            showError();
            return false;
        }
        newFungus[pair[0]] = pair[1];
    }

    document.querySelector('.add-new .loader').style.display = 'block';

    db.collection('fungi')
        .add(newFungus)
        .then(res => {
            document.querySelector('.add-new .loader').style.display = 'none';
            e.target.reset();
            showDone();
            reloadData();
        });
}

function showError() {
    const err = document.querySelector('.alert-danger');
    err.style.display = 'block';
    setTimeout(() => {
        err.style.display = 'none';
    }, 2000);
}
function showDone() {
    const err = document.querySelector('.alert-success');
    err.style.display = 'block';
    setTimeout(() => {
        err.style.display = 'none';
    }, 2000);
}

function remove(id) {
    db.collection('fungi')
        .doc(id)
        .delete()
        .then(function() {
            const tr = document.querySelector(`[data-id="${id}"]`);
            tr.style.backgroundColor = 'red';
            tr.style.opacity = 0;
            setTimeout(() => {
                tr.remove();
                const remainingDataLength = document.querySelectorAll('tr')
                    .length;
                if (remainingDataLength === 1) {
                    document.querySelector('table').style.display = 'none';
                    document.querySelector('.empty').style.display = 'block';
                } else {
                    document.querySelector('table').style.display = 'table';
                }
            }, 330);

            console.log('Document successfully deleted!');
        })
        .catch(function(error) {
            console.error('Error removing document: ', error);
        });
}

function reloadData() {
    document.querySelector('.all-data .loader').style.display = 'block';
    document.querySelector('.empty').style.display = 'none';

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    db.collection('fungi')
        .get()
        .then(querySnapshot => {
            document.querySelector('.all-data .loader').style.display = 'none';
            if (querySnapshot.size === 0) {
                document.querySelector('.empty').style.display = 'block';
                return false;
            } else {
                document.querySelector('table').style.display = 'table';
            }
            let i = 0;
            querySnapshot.forEach(doc => {
                const fungus = {
                    id: doc.id,
                    ...doc.data()
                };

                const tr = `
                    <tr data-id="${fungus.id}">
                        <th scope="row">${i + 1}</th>
                        <td>${fungus.name}</td>
                        <td>${fungus.order} / ${fungus.family}</td>
                        <td>
                            <a href="${fungus['source-link']}" target="_blank">
                                Open Link
                            </a>
                        </td>
                        <td>
                            <button 
                                class="btn btn-danger" 
                                onclick="remove('${fungus.id}')"
                            >
                                <img src="./img/bin.svg" />
                            </button>
                        </td>
                    </tr>
                `;

                tbody.innerHTML += tr;
                i++;
            });
        });
}

window.onload = () => {
    reloadData();
};
