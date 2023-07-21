import React from "react"
import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import Sidebar from "./components/sidebar"
import Editor from "./components/editor"
import {addDoc, onSnapshot,doc, deleteDoc} from "firebase/firestore"
import Split from "react-split"

import { notesCollection ,db} from "../firebase"

export default function App() {
  const [notes, setNotes] = useState([])
  const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || "")
  
  const currentNote=notes.find(note => {return note.id === currentNoteId}) || notes[0]
  useEffect(() => {
        const unsubscribe=onSnapshot(notesCollection,function(snapshot){ 
            const notesArr=snapshot.docs.map(doc=>({
                ...doc.data(),
                id:doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    }, [])
    
  async function createNewNote() {
    const newNote = {
      body: "#markdown note's title" 
    }
    const newNoteRef=await addDoc(notesCollection,newNote)

    setCurrentNoteId(newNoteRef.id)
  }
  
  function updateNote(text) {
    setNotes(oldNotes => {
        const newArray = []
        for(let i = 0; i < oldNotes.length; i++) {
            const oldNote = oldNotes[i]
            if(oldNote.id === currentNoteId) {
                newArray.unshift({ ...oldNote, body: text })
            } else {
                newArray.push(oldNote)
            }
        }
        return newArray
    })
  }
  async function deleteNote(noteId){
    const docRef= doc(db,"notes",noteId)
    await deleteDoc(docRef)
  }
  
  
  
 return (
      <main>
      {                                                       //enter js land
          notes.length > 0                                    //if there are more than 0 notes
          ?                                                   //ternary operator
          <Split                                              //split in 30:70 with sidebar and editor inside
              sizes={[30, 70]} 
              direction="horizontal" 
              className="split"
          >
              <Sidebar
                  notes={notes}
                  currentNote={currentNote}
                  setCurrentNoteId={setCurrentNoteId}
                  newNote={createNewNote}
                  deleteNote={deleteNote}
              />
            <Editor 
                currentNote={currentNote} 
                updateNote={updateNote} 
            />
                    
          </Split>                                            //split ends here
          :
          <div className="no-notes">                         {/* if 0 notes present */}
              <h1>You have no notes</h1>
              <button className="first-note" onClick={createNewNote}>Create one now</button>
          </div>
          
      }
      </main>
    )
}

