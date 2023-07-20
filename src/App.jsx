import React from "react"
import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import Sidebar from "./components/sidebar"
import Editor from "./components/editor"
import { data } from "./components/data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
  const [notes, setNotes] = useState(()=>JSON.parse(localStorage.getItem("notes"))||[])
  const [currentNoteId, setCurrentNoteId] = useState((notes[0] && notes[0].id) || "")
    
  React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
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
  
  function findCurrentNote() {
      return notes.find(note => {
          return note.id === currentNoteId
      }) || notes[0]
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
                  currentNote={findCurrentNote()}
                  setCurrentNoteId={setCurrentNoteId}
                  newNote={createNewNote}
                  deleteNote={deleteNote}
              />
              {
                  currentNoteId && 
                  notes.length > 0 &&
                  <Editor 
                      currentNote={findCurrentNote()} 
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

