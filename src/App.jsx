import React from "react"
import { useState } from 'react'
import { useEffect } from 'react'
import Sidebar from "./components/sidebar"
import Editor from "./components/editor"
import {addDoc, onSnapshot,doc, deleteDoc, setDoc} from "firebase/firestore"
import Split from "react-split"
import './App.css'
import { notesCollection ,db} from "../firebase"

export default function App() {
  const [notes, setNotes] = useState([])

  const [currentNoteId, setCurrentNoteId] = useState("")

  const [tempNoteText,setTempNoteText]=useState("")

  useEffect(()=>{
    if(currentNote){
        setTempNoteText(currentNote.body)
    }

  },[currentNote])

  useEffect(()=>{
   const timeid= setTimeout(()=>{
       if(tempNoteText!==currentNote.body)updateNote(tempNoteText)      //db will be updated on clicking 
                                                                        //another note every time if cond'n not present
    },500)
    return ()=>clearTimeout(timeid)
  },[tempNoteText])

  const sortedNotes=notes.sort((a,b)=>b.updatedAt-a.updatedAt)

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
      body: "#markdown note's title" ,
      createdAt:Date.now(),
      updatedAt:Date.now()
    }
    const newNoteRef=await addDoc(notesCollection,newNote)
    setCurrentNoteId(newNoteRef.id)
  }


  useEffect(()=>{
    if (!currentNoteId){
        setCurrentNoteId(notes[0]?.id)
    }
  },[notes])


  async function updateNote(text) {
    const docRef=doc(db,"notes",currentNoteId)
    await setDoc(docRef,{body:text,updatedAt:Date.now()},{merge:true})
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
                  notes={sortedNotes}
                  currentNote={currentNote}
                  setCurrentNoteId={setCurrentNoteId}
                  newNote={createNewNote}
                  deleteNote={deleteNote}
              />
            <Editor 
                tempNoteText={tempNoteText}
                setTempNoteText={setTempNoteText}
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

