import React, { useState } from 'react'
import styles from './styles.module.css'
import { useGongoLive, useGongoUserId, useGongoOne, useGongoIsPopulated, IsPopulated } from 'gongo-react';

const Collections = ({ setCurrentCollection }) => {
  const collections = [ 'users', 'test' ];
  return <ul>
    {
      collections.map(colName =>
        <a href="#" key={colName} onClick={() => setCurrentCollection(colName) && false}>
          <li>{colName}</li>
        </a>
      )
    }
  </ul>
}

const Collection = ({ colName }) => {
  const rows = useGongoLive( db => db.collection(colName).find() );

  const labels = [];
  rows.forEach(row => {
    const rowLabels = Object.keys(row);
    rowLabels.forEach(label => {
      if (!labels.includes(label))
        labels.push(label);
    });
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
                }}>X</button>
            </td>
            {
              labels.map(label => <td key={label}>{JSON.stringify(row[label])}</td>)
            }
          </tr>
        )
      }
    </tbody>
  </table>
};

const GongoMyAdmin = () => {
  const [currentCollection, setCurrentCollection] = useState('users');

  return <div className={styles.root}>
    <div className={styles.side}>
      <Collections setCurrentCollection={setCurrentCollection} />
    </div>
    <div className={styles.main}>
      <Collection colName={currentCollection} />
    </div>
  </div>
}

export default GongoMyAdmin;
