let guitarNeck = document.querySelector('.neck');
let totalFrets = 22;
let totalStrings = 6;

let guitarControls = document.querySelector('#guitar-controls')

const notesOrder = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

const createFrets = (totalFrets) => {
    for(let fret = 0; fret < totalFrets; fret++) {
        guitarNeck.innerHTML+=`<div class="fret" data-fretIndex="${fret + 1}"></div>`;
    }
}

const createStrings = (totalStrings) => {
    let guitarFrets = guitarNeck.getElementsByClassName('fret')

    for(let fret = 0; fret < guitarFrets.length; fret++) {
        for(let string = 0; string < totalStrings; string++) {
            guitarFrets[fret].innerHTML+=`<div class="string" data-stringIndex="${string + 1}"></div>`
        }    
    }
    
}

const createNotes = (...tuneStrings) => {
    const guitarPositions = Array.from(guitarNeck.getElementsByClassName('string'));

    const getNotePosition = (stringIndex, fretIndex) => {
        let notePosition = (parseInt(tuneStrings[stringIndex - 1]) + parseInt(fretIndex)) % 12;
        return notesOrder[notePosition];
    };

    guitarPositions.forEach(position => {
        const fretIndex = position.parentElement.getAttribute('data-fretindex');
        const stringIndex = position.getAttribute('data-stringindex');
        const note = getNotePosition(stringIndex, fretIndex);

        position.innerHTML += `<span class="note" data-stringindex="${stringIndex}" data-fretindex="${fretIndex}">${note}</span>`;
    });
};

const changeScale = (rootNote, scaleType) => {
    let scaleNotes    
    let guitarNotes = Array.from(guitarNeck.getElementsByClassName('note'))

    const getMajorScale = (rootNote) => {
    
        // Encontrar a posição da nota raiz no array
        const rootIndex = notesOrder.indexOf(rootNote);
    
        // Criar a escala maior
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

        // Encontrar a posição da nota raiz no array
        const rootIndex = notesOrder.indexOf(rootNote);
    
        // Criar a escala menor
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

    switch (scaleType) {
        case 'minor':
            scaleNotes = getMinorScale(rootNote)
            break;
        case 'major':
            scaleNotes = getMajorScale(rootNote)
            break;
    }
    
    guitarNotes.forEach(note => {
        if(scaleNotes.includes(note.innerText)) {
            note.classList.add('active')
        } else {
            note.classList.remove('active')
        }
    })

}


createFrets(totalFrets)
createStrings(totalStrings)
createNotes(7, 2, 10, 5, 0, 7)
changeScale('C', 'major')
guitarControls.addEventListener('submit', (event) => {
    event.preventDefault()
    let scaleNote = (document.querySelector('#scaleNote').value).toUpperCase()
    let scaleType = document.querySelector('#scaleType').value
    changeScale(scaleNote, scaleType)
})