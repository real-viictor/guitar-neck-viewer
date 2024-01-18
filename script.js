//Pegando o elemento pai da guitarra
let guitarNeck = document.querySelector('.neck');
//Definindo em variável o total de trastes que a guitarra terá
let totalFrets = 22;
//Definindo em variável o total de cordas da guitarra
let totalStrings = 6;

//Pegando o elemento de formulário que controla as escalas exibidas na guitarra
let guitarControls = document.querySelector('#guitar-controls')

//Definindo a ordem de notas (A sequência básica de A -> G#)
const notesOrder = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

//Função que gera os trastes
const createFrets = (totalFrets) => {
    //Para o total de trastes salvo na variável totalFrets, gere um traste com um atributo de numeração do traste ao longo do braço
    for(let fret = 0; fret < totalFrets; fret++) {
        guitarNeck.innerHTML+=`<div class="fret" data-fretIndex="${fret + 1}"></div>`;
    }
}

//Função que gera as cordas nos trastes
const createStrings = (totalStrings) => {
    //Localizando todos os trastes da guitarra
    let guitarFrets = guitarNeck.getElementsByClassName('fret')

    //Rodando um loop para o total de trastes localizado
    for(let fret = 0; fret < guitarFrets.length; fret++) {
        //Rodando um loop para o total de cordas determinado na variável totalStrings, executando para cada traste localizado a criação do número de cordas indicado com um atributo de numeração das cordas 
        for(let string = 0; string < totalStrings; string++) {
            guitarFrets[fret].innerHTML+=`<div class="string" data-stringIndex="${string + 1}"></div>`
        }    
    }
    
}

//Função que cria as bolinhas de notas musicais, que recebe como parâmetro a afinação que a guitarra terá, em números que se referem aos indexes de notas do array notesOrder
const createNotes = (...tuneStrings) => {
    //Localizando todas as cordas geradas na guitarra
    const guitarPositions = Array.from(guitarNeck.getElementsByClassName('string'));

    //Função que pega a posição da nota desejada dentro do array, baseando-se na corda e no traste que a nota se encontra, e retornando um valor para a nota, que deve ser inserido naquela posição
    const getNotePosition = (stringIndex, fretIndex) => {
        //Pegando a afinação passada como parâmetro da corda que chamou a função, somando com o deslocamento do traste para a mudança de notas para cada traste no valor de um semitom (Uma posição no array notesOrder), e por fim realizando uma operação de resto por 12, para que o valor nunca ultrapasse o total de posições possível do array NotesOrder
        let notePosition = (parseInt(tuneStrings[stringIndex - 1]) + parseInt(fretIndex)) % 12;
        //Por fim, retorne a nota encontrada utilizando o resultado da variável notePosition como index no array de notas
        return notesOrder[notePosition];
    };

    //En seguida, para cada nota que deve ser criada em uma posição no braço da guitarra (i.e. combinação de [traste, corda]), realize a verificação da nota que deve ser inserida na posição e adicione-a no braço
    guitarPositions.forEach(position => {
        //Pegando a numeração do traste que a nota ficará
        const fretIndex = position.parentElement.getAttribute('data-fretindex');
        //Pegando a corda que a nota ficará
        const stringIndex = position.getAttribute('data-stringindex');
        //Rodando a função que pega a nota correspondente à posição no braço da guitarra, usando como parâmetro o traste e a corda localizados 
        const note = getNotePosition(stringIndex, fretIndex);

        //Adicionando a nota no braço
        position.innerHTML += `<span class="note" data-stringindex="${stringIndex}" data-fretindex="${fretIndex}">${note}</span>`;
    });
};

//Função que realiza as mudanças na escala apresentada no braço da guitarra, que recebe como parâmetro a tônica, a intenção da escala, o tipo de escala e se a relativa deve ser exibida ou não, variáveis controladas pelo usuário no front-end
const changeScale = () => {
    //Definindo uma variável que receberá um array com as notas finais que devem ser exibidas, preenchido mais à frente na execução do código
    let scaleNotes    
    //Localizando todas as notas criadas no braço da guitarra
    let guitarNotes = Array.from(guitarNeck.getElementsByClassName('note'))

    //Pegando o valor da tônica selecionada pelo usuário e tratando-o para ficar em maiúsculo
    let rootNote = (document.querySelector('#scaleNote').value).toUpperCase()

    //Pegando a intenção da escala escolhida pelo usuário
    let scaleIntention = document.querySelector('#scaleIntention').value

    //Pegando o tipo da escala selecionada pelo usuário
    let scaleType = document.querySelector('#scaleType').value

    //Checando se o usuário deseja ou não exibir a nota tônica relativa
    let showRelativeKey = document.querySelector('#relativeKey').checked

    //Definindo qual será o index para localizar a tônica relativa no array da escala exibida, considerando se a intenção da escala é maior ou menor
    //Se a escala é menor, a tônica deve ser uma terça, caso contrário, deve ser uma sexta
    let relativeKeyNoteIndex = scaleIntention == 'minor' ? 2 : 5

    //Função que gera a escala maior, que recebe como parâmetro a tônica da escala
    const getMajorScale = (rootNote) => {
        
        //Pegando o index da tônica no array de notas
        const rootIndex = notesOrder.indexOf(rootNote);
        
        //Definindo o array majorScale, que pega as notas da escala baseando-se na equação de posição da tônica + distância da próxima nota e de resto 12 para evitar que o index nunca saia do total de elementos do array de notas
        //A equação utilizada representa a regra determinada para obter a escala maior (Tom, Tom, Semitom, Tom, Tom, Tom), sendo um tom representado por uma distância de 2 elementos no array e um semitom representado pela distância de 1 elemento do array
        const majorScale = [
            //Pegando a tônica
            notesOrder[rootIndex],

            //Pegando um tom
            notesOrder[(rootIndex + 2) % 12],

            //Pegando um tom
            notesOrder[(rootIndex + 4) % 12],

            //Pegando um semitom
            notesOrder[(rootIndex + 5) % 12],

            //Pegando um tom
            notesOrder[(rootIndex + 7) % 12],

            //Pegando um tom
            notesOrder[(rootIndex + 9) % 12],

            //Pegando um tom
            notesOrder[(rootIndex + 11) % 12]
        ];
        
        //Retornando array com as notas da escala maior da tônica informada na chamada da função
        return majorScale
    }
    
    //Função que gera a escala menor, baseando-se na nota informada como parâmetro para definir a tônica
    //O funcionamento desta função é idêntico ao getMajorScale, mudando apenas os elementos coletados no array minorScale
    const getMinorScale = (rootNote) => {

        const rootIndex = notesOrder.indexOf(rootNote);
    
        //A ordem da escala menor é Tom, Semitom, Tom, Tom, Semitom, Tom, sendo Tom = 2 elementos do array de distância, e semitom = 1 elemento do array de distância
        const minorScale = [
            //Pegando a tônica
            notesOrder[rootIndex],

            //Pegando um tom
            notesOrder[(rootIndex + 2) % 12],

            //Pegando 1 semitom
            notesOrder[(rootIndex + 3) % 12],

            //Pegando 1 tom
            notesOrder[(rootIndex + 5) % 12],

            //Pegando 1 tom
            notesOrder[(rootIndex + 7) % 12],

            //Pegando 1 semitom
            notesOrder[(rootIndex + 8) % 12],

            //Pegando 1 tom
            notesOrder[(rootIndex + 10) % 12]
        ];

        return minorScale
    }

    //Baseando-se na intenção da escala (Maior ou menor), armazene na variável 'scaleNotes' o array retornado por uma das funções getMajorScale ou getMinorScale, dependendo da escolha do usuário
    switch (scaleIntention) {
        case 'minor':
            scaleNotes = getMinorScale(rootNote)
            break;
        case 'major':
            scaleNotes = getMajorScale(rootNote)
            break;
    }

    //Baseando-se no tipo de escala que deve ser exibido, executa o devido tratamento na escala
    switch (scaleType) {
        //Se a escala for pentatônica, é necessário checar se ela é menor ou maior antes
        case 'pentatonic':
            if (scaleIntention == 'minor') {
                //Se a escala for menor, remova o 2º e o 6º grau da escala, porém mantendo a ordem dos elementos do array que não foram modificados inalterados
                [1, 5].forEach(index => scaleNotes[index] = undefined);
            } else {
                //Caso seja maior, remova o 4º e o 7º grau, ainda respeitando as notas não modificadas já posicionadas no array
                [3, 6].forEach(index => scaleNotes[index] = undefined); 
            }
            break;
        //Caso o usuário deseje ver o arpejo de tríades (1º, 3º, 5º), limpe o array scaleNotes mantendo apenas os graus informados, porém respeitando a posição original dos elementos do array
        //Não é necessário tratamento de intenção da escala, visto que independentemente da escala ser maior ou menor, os graus de uma tríade sempre serão definidos pelos intervalos citados
        case 'arpeggioTriad':
            scaleNotes = [scaleNotes[0], undefined, scaleNotes[2], undefined, scaleNotes[4], undefined, undefined]
            break;
        //Em case de um arpejo de tétrades (1º, 3º, 5º E 7º), realize o mesmo procedimento, porém agora mantendo também o 7º grau
        case 'arpeggioTetrad':
            scaleNotes = [scaleNotes[0], undefined, scaleNotes[2], undefined, scaleNotes[4], undefined, scaleNotes[6]]
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

        //Se a opção de visualizar a tônica da escala relativa for verdadeira, verifique se a nota que está sendo checada no For é a nota relativa, usando o index da nota relativa, definida no início da função, como index no array de notas da escala, buscando pegar o 3º ou o 6º grau, baseado na intenção da escala
        if (note.innerHTML == scaleNotes[relativeKeyNoteIndex] && showRelativeKey) {
            //Se o valor da nota checada for o valor da relativa menor no array de notas da escala, então adicione a classe relativeKey
            note.classList.add('relativeKey')
        } else {
            //Caso não seja, garanta que a classe será removida
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

//Criando os trastes na guitarra
createFrets(totalFrets)

//Criando as cordas na guitarra
createStrings(totalStrings)

//Afinando a guitarra na afinação padrão (Mi,Si,Sol,Ré,Lá,Mi)
createNotes(7, 2, 10, 5, 0, 7)

//Determinando que a escala padrão exibida ao abrir a página será a escala de dó maior natural, sem a exibição da nota tônica da relativa menor
changeScale('C', 'major', 'natural', false)

//Adicionando um eventListener para detectar qualquer alteração nos controles das escalas, e então rodando a função de alteração da escala automaticamente
guitarControls.addEventListener('change', changeScale)