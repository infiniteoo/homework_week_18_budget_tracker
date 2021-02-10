// eslint-disable-next-line no-unused-vars
let db

function withDB (callback) {
  const request = indexedDB.open('budget', 1)
  request.onerror = console.error
  request.onsuccess = () => {
    const db = request.result
    callback(db)
  }
  request.onupgradeneeded = () => {
    initdb(request.result, callback)
  }
}

function initdb (db, callback) {
  const store = db.createObjectStore(
    'budget',
    { keyPath: 'total' }
  )

  store.createIndex('total')
}

// eslint-disable-next-line no-unused-vars
function saveRecord (transaction, callback) {
  withDB((db) => {
    const newtrans = db.transaction(['budget', 'readwrite'])

    const budget = newtrans.objectStore('budget')

    const request = budget.write(transaction)
    request.onerror = console.error

    request.onsuccess = () => {
      const record = request.result
      if (record) {
        callback(record)
      } else {
        callback(null)
      }
    }
  })
}
