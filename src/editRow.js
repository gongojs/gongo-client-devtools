import React, { Fragment, useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';

import styles from './editRow.module.css'

const EditRowButton = ({ db, colName, row, close }) => {
  const [showEditor, setShowEditor] = useState(false);
  function close() { setShowEditor(false) };

  return <>
    <button onClick={() => setShowEditor(!showEditor)}>&#x270e;</button>
    {
      showEditor ? <EditRow db={db} colName={colName} doc={row} close={close} /> : null
    }
  </>;
};

const EditRow = ({ db, colName, doc, close }) => {
  const [newDoc, setNewDoc] = useState(null);
  function onChange(data) { setNewDoc(data.jsObject) }
  function save() {
    db.collection(colName).updateId(doc._id, newDoc);
    close();
  }

  return (
    <div className={styles.editRow}>
      <div className={styles.editRowContents}>
        <JSONInput
            id          = 'a_unique_id'
            placeholder = { doc }
            width       = '100%'
            /* colors      = { darktheme } */
            locale      = { locale }
            height      = '100%'
            onChange    = { onChange }
          />
      </div>
      <div className={styles.editRowButtons}>
        <button onClick={close}>Cancel</button>
        <button onClick={save} disabled={!newDoc}>Save</button>
      </div>
    </div>
  )
};

export default EditRowButton;
