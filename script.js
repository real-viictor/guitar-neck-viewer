const guitarNeck = document.querySelector('.neck');
const guitarControls = document.querySelector('#guitar-controls')
const tuningControls = document.querySelector('#nut-tuning')

const notesOrder = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const intervalsOrder = ['T', '2m', '2M', '3m', '3M', '4J', '4+', '5J', '5+', '6M', '7m', '7M'];

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

const getRootNote = () => {
    return (document.querySelector('#scale-note').value).toUpperCase()
}

const getScaleIntention = () => {
    return document.querySelector('#scale-intention').value
}

const getScaleType = () => {
    return document.querySelector('#scale-type').value
}

const getShowAllNotesStatus = () => {
    return document.querySelector('#show-all-notes').checked
}

const getShowKeyNoteStatus = () => {
    return document.querySelector('#show-key-note').checked
}

const getShowRelativeKeyStatus = () => {  
    return document.querySelector('#show-relative-key').checked
}

const getShowIntervalsStatus = () => {
    return document.querySelector('#show-notes-as-intervals').checked
}

const getDeterminedScale = (rootNote = getRootNote(), scaleIntention = getScaleIntention(), scaleType = getScaleType()) => {
        
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

    let scaleNotes = getNaturalScale(rootNote, scaleIntention)

    if(scaleType == 'pentatonic') {
        scaleNotes = getPentatonicScale(scaleNotes, scaleIntention)
    }

    return scaleNotes
}

const getFreeModeStatus = () => {
    return document.querySelector('#set-free-mode').checked
}

const getAllNotes = () => {
    return Array.from(guitarNeck.querySelectorAll('.note'))
}

const setNoteIntervals = (rootNote = getRootNote()) => {
    let guitarNotes = getAllNotes()
    let interval

    guitarNotes.forEach(note => {
        intervalIndex = (12 + notesOrder.indexOf(note.getAttribute('data-note-value')) - notesOrder.indexOf(rootNote)) % intervalsOrder.length
        interval = intervalsOrder[intervalIndex]
        note.setAttribute('data-interval', interval)
    })
}

const setFreeMode = (isFreeModeOn) => {
    if (isFreeModeOn) {
        guitarNeck.setAttribute('free-mode', '')
    } else {
        guitarNeck.removeAttribute('free-mode', '')
    }
}

const tuneGuitar = (...tuneNotes) => {
    let guitarNotes = getAllNotes()
    let notes

    const getTuneNotes = (...tuneNotes) => {
        let notes = []
        tuneNotes.forEach((note) => {
            notes.push(note)
        })

        return notes
    }

    const setNoteValueAttribute = (tuneNotes) => {
        let fretIndex
        let stringIndex

        guitarNotes.forEach((note) => {
            fretIndex = parseInt(note.getAttribute('data-fretindex'))
            stringIndex = parseInt(note.getAttribute('data-stringindex'))

            note.setAttribute('data-note-value', notesOrder[(tuneNotes[stringIndex - 1] + fretIndex) % 12])
        })
    }

    notes = getTuneNotes(...tuneNotes)
    setNoteValueAttribute(notes)
    insertValueIntoNoteElement(guitarNotes,'data-note-value')
}

const insertValueIntoNoteElement = (guitarNotes, attribute) => {
    guitarNotes.forEach(note => {
        note.innerText = note.getAttribute(attribute)
    })
}

const showAllNotes = (showAllNotes) => {
    if(showAllNotes) {
        guitarNeck.setAttribute('notes-visible', '')
    } else {
        guitarNeck.removeAttribute('notes-visible', '')
    }
}

const showRelativeKey = (rootNote, isShownRelativeKey, scaleIntention) => {
    let guitarNotes = getAllNotes()
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
    guitarNotes.forEach((note) => {
        if(note.getAttribute('data-note-value') == relativeKey && isShownRelativeKey) {
            note.classList.add('relativeKey')
        } else {
            note.classList.remove('relativeKey')
        }
    })
}

const showNotesAsIntervals = (isShownIntervals) => {
    let guitarNotes = getAllNotes()
    
    if (isShownIntervals) {
        insertValueIntoNoteElement(guitarNotes, 'data-interval')
    } else {
        insertValueIntoNoteElement(guitarNotes, 'data-note-value')
    }
}

const showKeyNote = (rootNote, isShowKeyNote) => {
    let guitarNotes = getAllNotes()

    guitarNotes.forEach((note) => {
        if(note.getAttribute('data-note-value') == rootNote && isShowKeyNote) {
            note.classList.add('keyNote')
        } else {
            note.classList.remove('keyNote')
        }
    })
    
}

const showScaleNotes = (scaleNotes) => {
    let guitarNotes = getAllNotes()
    let isNoteInScale

    guitarNotes.forEach((note) => {
        isNoteInScale = scaleNotes.includes(note.getAttribute('data-note-value'))

        if(isNoteInScale) {
            note.classList.add('active')
        } else {
            note.classList.remove('active')
        }
    })
}

const modifyNeck = () => {
    let rootNote = getRootNote()
    let scaleIntention = getScaleIntention()
    let scaleType = getScaleType()
    let isShownKeyNote = getShowKeyNoteStatus()
    let isShownAllNotes = getShowAllNotesStatus()
    let isShownRelativeKey = getShowRelativeKeyStatus()
    let isShownIntervals = getShowIntervalsStatus()
    let isFreeModeOn = getFreeModeStatus()

    changeScale(rootNote, scaleIntention, scaleType)
    showAllNotes(isShownAllNotes)
    showKeyNote(rootNote, isShownKeyNote)
    showRelativeKey(rootNote, isShownRelativeKey, scaleIntention)
    showNotesAsIntervals(isShownIntervals)
    setFreeMode(isFreeModeOn)
}

const changeScale = (rootNote, scaleIntention, scaleType) => {

    let scaleNotes

    scaleNotes = getDeterminedScale(rootNote, scaleIntention, scaleType)
    showScaleNotes(scaleNotes)
    setNoteIntervals(rootNote)
}

const setupApplication = () => {
    createFrets()
    createStrings()
    createNotes()
    tuneGuitar(7,2,10,5,0,7)
    setNoteIntervals()
    modifyNeck()
    guitarControls.addEventListener('change', modifyNeck)
}

document.addEventListener('DOMContentLoaded', setupApplication())