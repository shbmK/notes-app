import React from "react"
import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import Sidebar from "./components/sidebar"
import Editor from "./components/editor"
import {onSnapshot} from "firebase/firestore"
import Split from "react-split"
import {nanoid} from "nanoid"
import { notesCollection } from "../firebase"

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
    
  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "#markdown note's title" 
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
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
  function deleteNote(event,noteId){
    event.stopPropagation()
    setNotes(old=>old.filter(note=>note.id!==noteId))

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
              {
                  currentNoteId && 
                  notes.length > 0 &&
                  <Editor 
                      currentNote={currentNote} 
                      updateNote={updateNote} 
                  />
              }
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

