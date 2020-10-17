import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import styles from './styles.module.css'
import { useGongoLive, useGongoUserId, useGongoOne, useGongoIsPopulated, IsPopulated } from 'gongo-react';

import EditRowButton from './editRow';

const Collections = ({ currentCollection, setCurrentCollection }) => {
  const collections = [ 'users', 'test', 'todos' ].sort();
  return <div>
    {
      collections.map(colName =>
        <button key={colName} disabled={colName === currentCollection}
            onClick={() => setCurrentCollection(colName) && false}>
          {colName}
        </button>
      )
    }
  </div>
}

const Collection = ({ colName, hideMeta=true }) => {
  let db;
  const rows = useGongoLive( _db => {
    db = _db;
    return db.collection(colName).find()
  });

  const labels = [];
  rows.forEach(row => {
    const rowLabels = Object.keys(row);
    rowLabels.forEach(label => {
      if (!labels.includes(label) && (!(hideMeta && label.startsWith('__'))))
        labels.push(label);
    });
  });
  labels.sort();

  const newRow = {};
  labels.forEach(label => {
    if (label === '_id') return;
    switch (typeof rows[0].label) {
      case 'number': newRow[label] = 0; break;
      default: newRow[label] = '';
    }
  });

  return <table className={styles.collection}>
    <thead>
      <tr>
        <th></th>
        {
          labels.map(key => <th key={key}>{key}</th>)
        }
      </tr>
    </thead>
    <tbody>
      {
        rows.map(row =>
          <tr key={row._id} className={styles.colRow}>
            <td>
              <button onClick={() => {
                if (confirm('Are you sure?'))
                  db.collection(colName).removeId(row._id);
                }}>&#x2717;</button>
              <EditRowButton db={db} colName={colName} row={row} />
              <span className={row.__pendingSince?styles.pendingIconTrue:styles.pendingIconFalse}>⇋</span>
            </td>
            {
              labels.map(label => <td key={label}>{JSON.stringify(row[label])}</td>)
            }
          </tr>
        )
      }
      <tr key="new" className={styles.colRow}>
        <td>
          <button disabled="disabled">&#x2717;</button>
          <EditRowButton db={db} colName={colName} row={newRow} />
          <span className={styles.pendingIconFalse}>⇋</span>
        </td>
        {
          labels.map(label => <td key={label}></td>)
        }
      </tr>
    </tbody>
  </table>
};

const GongoMyAdmin = () => {
  const [currentCollection, setCurrentCollection] = useState('todos');

  return <div className={styles.root}>
    <div className={styles.side}>
      <Collections currentCollection={currentCollection} setCurrentCollection={setCurrentCollection} />
    </div>
    <div className={styles.main}>
      <Collection colName={currentCollection} />
    </div>
  </div>
}

function DevTools() {
  return (
    <GongoMyAdmin />
  )
}

const root = document.createElement('div');
window.document.body.appendChild(root);
ReactDOM.render(<DevTools className={styles.root} />, root);
