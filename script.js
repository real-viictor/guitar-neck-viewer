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

const changeScale = (rootNote, scaleIntention, scaleType, showRelativeKey) => {
    let scaleNotes    
    let guitarNotes = Array.from(guitarNeck.getElementsByClassName('note'))

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

    switch (scaleIntention) {
        case 'minor':
            scaleNotes = getMinorScale(rootNote)
            break;
        case 'major':
            scaleNotes = getMajorScale(rootNote)
            break;
    }

    switch (scaleType) {
        case 'pentatonic':
            if (scaleIntention == 'minor') {
                scaleNotes.splice(5,1)
                scaleNotes.splice(1,1)
            } else {
                scaleNotes.splice(6,1)
                scaleNotes.splice(3,1)   
            }
            break;
        case 'arpeggioTriad':
            scaleNotes = [scaleNotes[0], scaleNotes[2], scaleNotes[4]]
            break;
        case 'arpeggioTetrad':
            scaleNotes = [scaleNotes[0], scaleNotes[2], scaleNotes[4], scaleNotes[6]]
            break;
    }
    
    //Para cada nota, tratar com as condições definidas abaixo para determinar se a nota deve ser exibida ou não
    guitarNotes.forEach(note => {
        //Checando se a nota é a tônica da escala, caso positivo, adicione a classe .keyNote para ressaltá-la como a tônica
        if(note.innerHTML == scaleNotes[0]) {
            note.classList.add('keyNote')
        } else {
            //Caso contrário, garanta que as notas não terão a classe .keyNote para que não sejam mostradas como tônica
            note.classList.remove('keyNote')
        } 

        if (note.innerHTML == scaleNotes[5] && showRelativeKey) {
            note.classList.add('relativeKey')
        } else {
            note.classList.remove('relativeKey')
        }
        

        //Se a nota atual do loop constar dentro do array de notas da escala, então adicione a classe .active para mostrá-la
        if(scaleNotes.includes(note.innerText)) {
            note.classList.add('active')
        } else {
            //Caso contrário, remova a classe para ela não ser exibida
            note.classList.remove('active')
        }
    })

}


createFrets(totalFrets)
createStrings(totalStrings)
createNotes(7, 2, 10, 5, 0, 7)
changeScale('C', 'major', 'natural')
guitarControls.addEventListener('change', (event) => {
    event.preventDefault()
    let scaleNote = (document.querySelector('#scaleNote').value).toUpperCase()
    let scaleIntention = document.querySelector('#scaleIntention').value
    let scaleType = document.querySelector('#scaleType').value
    let showRelativeKey = document.querySelector('#relativeKey')
    changeScale(scaleNote, scaleIntention, scaleType, showRelativeKey)
})