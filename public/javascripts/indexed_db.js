// initialize the db variable to have global scope
let db

// make request to db to open
const request = indexedDB.open('transactions', 1)
request.onerror = console.error
// if no errors, assign a database to the callback of the request

// if transactions db doesn't exist, let's initialize it
request.onupgradeneeded = () => {
// create object store & key path
  const store = db.createObjectStore(
    'transactions',
    {
      keyPath: 'value',
      autoIncrement: true
    }

  )
  // create an index for the object store
  store.createIndex('value')
}
request.onsuccess = () => {
  const db = request.result

  // if we're online, upload any stored transactions
  if (navigator.onLine) { uploadTransaction() }
}

function saveRecord (record) {
// create transaction object
  const trans = db.transaction(['transactions', 'readwrite'])
  trans.onerror = console.error
  // get object store from the transaction object
  const store = trans.objectStore('transactions')
  // write to the database
  store.add(record)
}

