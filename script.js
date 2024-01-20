const guitarNeck = document.querySelector('.neck');
const guitarControls = document.querySelector('#guitar-controls')
const tuningControls = document.querySelector('#nut-tuning')

const notesOrder = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

let totalFrets = 22;
let totalStrings = 6;

const createFrets = () => {
    let fretElement

    for(let i = 0; i < totalFrets; i++) {
        fretElement = `<div class="fret" data-fretIndex="${i + 1}"></div>`;
        guitarNeck.innerHTML+=fretElement
    }
}

const createStrings = () => {
    const guitarFrets = Array.from(guitarNeck.querySelectorAll('.fret'))

    guitarFrets.forEach((fret) => {
        for(let i = 0; i < totalStrings; i++) {
            fret.innerHTML+=`<div class="string" data-stringindex="${i + 1}"></div>`
        }
    } )
}

const createNotes = () => {
    const guitarStrings = Array.from(guitarNeck.querySelectorAll('.string'))

    guitarStrings.forEach((string) => {
        let stringIndex = string.getAttribute('data-stringindex')
        let fretIndex = string.parentElement.getAttribute('data-fretindex')
        string.innerHTML+=`<span class="note" data-stringindex="${stringIndex}" data-fretindex="${fretIndex}"></span>`
    })
}

const tuneGuitar = (...TuneNotes) => {
    let guitarNotes = Array.from(guitarNeck.querySelectorAll('.note'))
    let notes

    const clearCurrentTuning = () => {
        guitarNotes.forEach((note) => {
            note.innerHTML = '';
        })
    }

    const getTuneNotes = (...TuneNotes) => {
        let notes = []
        TuneNotes.forEach((note) => {
            notes.push(note)
        })

        return notes
    }

    const insertNoteValues = (TuneNotes) => {
        let fretIndex
        let stringIndex

        guitarNotes.forEach((note) => {
            fretIndex = parseInt(note.getAttribute('data-fretindex'))
            stringIndex = parseInt(note.getAttribute('data-stringindex'))

            note.innerText = notesOrder[(TuneNotes[stringIndex - 1] + fretIndex) % 12]
        })
    }

    notes = getTuneNotes(...TuneNotes)
    clearCurrentTuning
    insertNoteValues(notes)
}

const showAllNotes = (showAllNotes) => {
    let guitarNotes = Array.from(guitarNeck.querySelectorAll('.note'))

    if(showAllNotes) {
        guitarNotes.forEach((note) => {
            note.classList.add('active')
        })
    }
}

const showRelativeKey = (rootNote, isShownRelativeKey, scaleIntention) => {
    let guitarNotes = Array.from(guitarNeck.querySelectorAll('.note'))
    let relativeKey
    let relativeKeyOffset

    switch(scaleIntention) {
        case 'major':
            //São 9 semitons de distância da tônica até a 6º maior (Relativa menor)
            relativeKeyOffset = 9
            break;
        case 'minor':
            //São 3 semitons de distância da 6º maior (Relativa menor) até a tônica
            relativeKeyOffset = 3
            break;
    }

    relativeKey = notesOrder[(notesOrder.indexOf(rootNote) + relativeKeyOffset) % 12] 
    console.log(relativeKey)
    guitarNotes.forEach((note) => {
        if(note.innerText == relativeKey && isShownRelativeKey) {
            note.classList.add('relativeKey')
        } else {
            note.classList.remove('relativeKey')
        }
    })
}

const showNotesAsIntervals = () => {

}

const showKeyNote = (rootNote, isShowKeyNote) => {
    let guitarNotes = Array.from(guitarNeck.querySelectorAll('.note'))

    guitarNotes.forEach((note) => {
        if(note.innerText == rootNote && isShowKeyNote) {
            note.classList.add('keyNote')
        } else {
            note.classList.remove('keyNote')
        }
    })
    
}

const modifyNeck = () => {
    let rootNote = (document.querySelector('#scale-note').value).toUpperCase()
    let scaleIntention = document.querySelector('#scale-intention').value
    let scaleType = document.querySelector('#scale-type').value
    let isShownAllNotes =  document.querySelector('#show-all-notes').checked
    let isShownKeyNote =  document.querySelector('#show-key-note').checked
    let isShownRelativeKey =  document.querySelector('#show-relative-key').checked
    let isShownIntervals =  document.querySelector('#show-notes-as-intervals').checked

    changeScale(rootNote, scaleIntention, scaleType)
    showKeyNote(rootNote, isShownKeyNote)
    showAllNotes(isShownAllNotes)
    showRelativeKey(rootNote, isShownRelativeKey, scaleIntention)
}

const changeScale = (rootNote, scaleIntention, scaleType) => {
    
    let scaleNotes

    const getNaturalScale = (rootNote, scaleIntention) => {
        let naturalScale

        const getMajorScale = (rootNote) => {
            const rootIndex = notesOrder.indexOf(rootNote);
            
            const majorScale = [
                notesOrder[rootIndex],
                notesOrder[(rootIndex + 2) % 12],
                notesOrder[(rootIndex + 4) % 12],
                notesOrder[(rootIndex + 5) % 12],
                notesOrder[(rootIndex + 7) % 12],
                notesOrder[(rootIndex + 9) % 12],
                notesOrder[(rootIndex + 11) % 12]
            ];
            
            return majorScale
        }
    
        const getMinorScale = (rootNote) => {
    
            const rootIndex = notesOrder.indexOf(rootNote);
        
            const minorScale = [
                notesOrder[rootIndex],
                notesOrder[(rootIndex + 2) % 12],
                notesOrder[(rootIndex + 3) % 12],
                notesOrder[(rootIndex + 5) % 12],
                notesOrder[(rootIndex + 7) % 12],
                notesOrder[(rootIndex + 8) % 12],
                notesOrder[(rootIndex + 10) % 12]
            ];
    
            return minorScale
        }

        switch(scaleIntention) {
            case 'major':
                naturalScale = getMajorScale(rootNote)
                break;
            case 'minor':
                naturalScale = getMinorScale(rootNote)
                break;
        }

        return naturalScale
    }

    const getPentatonicScale = (scaleNotes, scaleIntention) => {
        switch(scaleIntention) {
            case 'minor':
                [1, 5].forEach(index => scaleNotes[index] = undefined)
                break;
            case 'major':
                [3, 6].forEach(index => scaleNotes[index] = undefined);
                break;
        }
        return scaleNotes
    }

    const getDeterminedScale = (rootNote, scaleIntention, scaleType) => {
        let scaleNotes = getNaturalScale(rootNote, scaleIntention)

        if(scaleType == 'pentatonic') {
            scaleNotes = getPentatonicScale(scaleNotes, scaleIntention)
        }

        return scaleNotes
    }

    const showScaleNotes = (scaleNotes) => {
        let guitarNotes = Array.from(guitarNeck.querySelectorAll('.note'))
        let isNoteInScale

        guitarNotes.forEach((note) => {
            isNoteInScale = scaleNotes.includes(note.innerText)

            if(isNoteInScale) {
                note.classList.add('active')
            } else {
                note.classList.remove('active')
            }
        })
    }

    scaleNotes = getDeterminedScale(rootNote, scaleIntention, scaleType)
    showScaleNotes(scaleNotes)
}

const setupApplication = () => {
    createFrets()
    createStrings()
    createNotes()
    tuneGuitar(7,2,10,5,0,7)
    modifyNeck()
    //TODO: Mudar a função que roda após o evento de change, precisará ser uma função que foque na modificação do braço apenas no que é necessário
    guitarControls.addEventListener('change', modifyNeck)
}

document.addEventListener('DOMContentLoaded', setupApplication())