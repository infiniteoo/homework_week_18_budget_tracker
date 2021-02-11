// initialize the db variable to have global scope
let db

// make request to db to open
const request = indexedDB.open('new_transaction', 1)
request.onerror = console.error
// if no errors, assign a database to the callback of the request

// if transactions db doesn't exist, let's initialize it
request.onupgradeneeded = () => {
// create object store & key path
  const store = db.createObjectStore(
    'new_transaction',
    {
      keyPath: 'value',
      autoIncrement: true
    }

  )
  // create an index for the object store
  store.createIndex('value')
}
request.onsuccess = () => {
  db = event.target.result

  // if we're online, upload any stored transactions
  if (navigator.onLine) { uploadTransaction() }
}

// eslint-disable-next-line no-unused-vars
function saveRecord (record) {
// create transaction object
  db.transaction(['new_transaction', 'readwrite'])
  /*  trans.onerror = console.error */
  // get object store from the transaction object
  const store = db.objectStore('new_transaction')
  // write to the database
  store.add(record)
}

function uploadTransaction () {
  // create transaction object
  const trans = db.transaction(['new_transaction', 'readwrite'])
  trans.onerror = console.error
  // get object store from the transaction object
  const store = trans.objectStore('new_transaction')
  // grab any records stored in the local db
  const allItemsInStore = store.getAll()
  allItemsInStore.onsuccess = () => {
    fetch('/api/transaction', {
      method: 'POST',
      body: JSON.stringify(allItemsInStore.result)
    })
      .then(response => response.json())
      .then(reply => {
        if (reply.message) { throw new Error(reply) }

        const trans = db.transaction(['new_transaction', 'readwrite'])
        trans.onerror = console.error
        // get object store from the transaction object
        const store = trans.objectStore('new_transaction')
        // clear out the object store once we've uploaded the stored data to the server
        store.clear()
        alert('All saved transactions has been submitted!')
      })
      .catch(error => { console.log(error) })
  }
}

window.addEventListener('online', uploadTransaction)
