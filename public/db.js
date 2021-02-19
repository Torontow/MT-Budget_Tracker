let db

// Create a request for a databse called "budget", version 1.
const request = indexedDB.open('budget', 1)

// Create an object store called "pending" and increment automatically.
request.onupgradeneeded = e => {
  const db = e.target.result
  db.createObjectStore('pending', { autoIncrement: true })
}

request.onsuccess = e => {
  db = e.target.result
  // Verify that if the app is online before reading from "budget".
  if (navigator.onLine) {
    checkDatabase()
  }
}

// Throw an error if there is an error connecting.
request.onerror = e => {
  console.log('Dang.', e.target.errorCode)
}

const saveRecord = record => {
  // Create a transaction on the "pending" object store
  const transaction = db.transaction(['pending'], 'readwrite')

  // Access "pending" object store
  const store = transaction.objectStore('pending')

  // Add a record to the object store
  store.add(record)
}

// const checkDatabase = () => {
//   // Create a transaction on "pending".
//   const transaction = db.transaction(['pending'], 'readwrite')
//   // Access "pending".
//   const store = transaction.objectStore('pending')
//   // Retrieve all records from the store.
//   const getAll = store.getAll()

//   getAll.onsuccess = () => {
//     if (getAll.result.length > 0) {
//       fetch('/api/transaction/bulk', {
//         method: 'POST',
//         body: JSON.stringify(getAll.result),
//         headres: {
//           Accept: 'application/json, text/plain, */*',
//           'Content-Type': 'application/json'
//         }
//       })
//         .then(response => response.json())
//         .then(() => {
//           // If successful, open a transaction on the "pending" db
//           const transaction = db.transaction(['pending'], 'readwrite')
//           // Access "pending" object store
//           const store = transaction.objectStore('pending')
//           // clear items in store
//           store.clear()
//         })
//     }
//   }
// }

// Check if the app is back online.
window.addEventListener('online', checkDatabase)
