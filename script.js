// const slider = document.getElementById("fontSizeSlider");
//         const paragraphs = document.querySelectorAll("p"); // Alle <p>-elementen selecteren
//         const fontSizeValue = document.getElementById("fontSizeValue");

//         slider.addEventListener("input", function() {
//             let size = slider.value + "px";
//             fontSizeValue.textContent = size;
            
//             // Loop door alle <p>-elementen en pas de font-size aan
//             paragraphs.forEach(p => {
//                 p.style.fontSize = size;
//             });
//         });

//         const lineHeightSlider = document.getElementById("lineHeightSlider");
//         const lineHeightValue = document.getElementById("lineHeightValue");
        
//         lineHeightSlider.addEventListener("input", function() {
//             let lineHeight = lineHeightSlider.value;
//             lineHeightValue.textContent = lineHeight;
        
//             paragraphs.forEach(p => {
//                 p.style.lineHeight = lineHeight;
//             });
//         });
        
//         const fontWeightSlider = document.getElementById("fontWeightSlider");
//         const fontWeightValue = document.getElementById("fontWeightValue");
        
//         fontWeightSlider.addEventListener("input", function () {
//             let weight = fontWeightSlider.value;
//             fontWeightValue.textContent = weight;
        
//             paragraphs.forEach(p => {
//                 p.style.fontWeight = weight;
//             });
//         });


let noteCount = 0;
let activeSentence = null;
const noteLinksContainer = document.getElementById('note-links');

// Zinnen wrappen
document.querySelectorAll('p').forEach((paragraph, pIndex) => {
  const text = paragraph.innerText;
  const sentences = text.match(/[^\.!\?]+[\.!\?]+["']?|[^\.!\?]+$/g);
  if (!sentences) return;

  paragraph.innerHTML = '';

  sentences.forEach((sentence, sIndex) => {
    const span = document.createElement('span');
    span.classList.add('sentence');
    span.setAttribute('tabindex', '0');

    // Uniek ID per zin
    const sentenceId = `sentence-${pIndex}-${sIndex}`;
    span.setAttribute('id', sentenceId);
    span.innerText = sentence.trim() + ' ';
    paragraph.appendChild(span);
  });

  // Container voor notities onder deze paragraaf
  const noteList = document.createElement('div');
  noteList.className = 'note-list';
  paragraph.appendChild(noteList);
});

// Focus tracking en toetsen
document.querySelectorAll('.sentence').forEach(sentence => {
  sentence.addEventListener('focus', () => {
    activeSentence = sentence;
  });

  sentence.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleNoteBlock([this]);
    }

    const num = parseInt(e.key);
    if (!isNaN(num) && num >= 1 && num <= 9 && activeSentence) {
      e.preventDefault();
      const allSentences = [...activeSentence.closest('p').querySelectorAll('.sentence')];
      const startIndex = allSentences.indexOf(activeSentence);
      const selected = allSentences.slice(startIndex, startIndex + num);

      if (selected.length > 0) {
        toggleNoteBlock(selected);
      }
    }
  });
});

// Toon notitieblok voor geselecteerde zinnen
function toggleNoteBlock(selectedSentences) {
  const first = selectedSentences[0];
  const paragraph = first.closest('p');
  const noteList = paragraph.querySelector('.note-list');

  if (paragraph.querySelector('.note-block')) return;

  const noteBlock = document.createElement('div');
  noteBlock.className = 'note-block';

  const textarea = document.createElement('textarea');
  textarea.setAttribute('aria-label', 'Voer hier je aantekening in');

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Opslaan';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Annuleren';
  cancelBtn.onclick = () => {
    noteBlock.remove();
    selectedSentences.forEach(s => s.classList.remove('note-active'));
  };

  textarea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveNote();
    }
  });

  saveBtn.onclick = () => saveNote();

  function saveNote() {
    const noteText = textarea.value.trim();
    if (!noteText) return alert('Aantekening is leeg.');

    // Voeg de aantekening alleen één keer toe, ongeacht het aantal geselecteerde zinnen
    const sentenceIds = selectedSentences.map(sentence => sentence.id);  // Verzamelt de ID's van de geselecteerde zinnen
    noteCount++;

    // --- Notitie in paragraaf onderaan
    const entry = document.createElement('div');
    entry.className = 'note-entry';

    const entryText = document.createElement('div');
    entryText.innerHTML = `"${noteText}"`; // Toon de tekst van de aantekening

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Bewerken';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Verwijderen';

    editBtn.onclick = () => {
      const editField = document.createElement('textarea');
      editField.value = noteText;

      const saveEditBtn = document.createElement('button');
      saveEditBtn.textContent = 'Opslaan';

      saveEditBtn.onclick = () => {
        const newText = editField.value.trim();
        if (!newText) return alert('Leeg');
        entryText.innerHTML = `"${newText}"`; // Werk de aantekening bij
        entry.replaceChild(entryText, editField);
        entry.appendChild(editBtn);
        entry.appendChild(deleteBtn);
        saveEditBtn.remove();
      };

      entry.replaceChild(editField, entryText);
      entry.removeChild(editBtn);
      entry.removeChild(deleteBtn);
      entry.appendChild(saveEditBtn);
    };

    deleteBtn.onclick = () => {
      selectedSentences.forEach(sentence => {
        sentence.classList.remove('highlighted');
      });
      entry.remove();
      sentenceIds.forEach(id => {
        const topLink = document.getElementById(`note-link-${id}`);
        if (topLink) topLink.remove();
      });
    };

    entry.appendChild(entryText);
    entry.appendChild(editBtn);
    entry.appendChild(deleteBtn);

    noteList.appendChild(entry);

    // --- Bovenaan overzicht toevoegen (één keer, voor de hele selectie)
    const topEntry = document.createElement('div');
    topEntry.className = 'note-entry';
    topEntry.id = `note-link-${sentenceIds.join('-')}`; // Gebruik alle zinnen ID's voor een unieke link

    const link = document.createElement('a');
    link.href = `#${sentenceIds[0]}`; // Link naar de eerste geselecteerde zin
    link.textContent = `${noteText}`;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(sentenceIds[0]);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.focus();
      }
    });

    topEntry.appendChild(link);
    noteLinksContainer.appendChild(topEntry);

    // Verwijder de notitieblok na opslaan
    noteBlock.remove();

    // Focus naar de volgende zin in dezelfde paragraaf
    const allSentences = [...paragraph.querySelectorAll('.sentence')];
    const currentIndex = allSentences.indexOf(first);
    const nextSentence = allSentences[currentIndex + 1];

    if (nextSentence) {
      nextSentence.focus();
    }
  }

  // Highlight geselecteerde zinnen
  selectedSentences.forEach(s => {
    s.classList.add('note-active');
    s.classList.add('highlighted');  // Zorg dat de zinnen gehighlight worden
  });

  noteBlock.appendChild(textarea);
  noteBlock.appendChild(saveBtn);
  noteBlock.appendChild(cancelBtn);
  paragraph.appendChild(noteBlock);
  textarea.focus();
}

document.addEventListener('keydown', function (e) {
  // Controleer of de focus zich in een textarea bevindt
  if (e.target.tagName.toLowerCase() === 'textarea' || e.target.tagName.toLowerCase() === 'input') {
    return; // Stop de 'j' toets als de focus in een textarea of input staat
  }

  // Als de 'j' toets wordt ingedrukt en geen modifier keys zoals Ctrl, Meta, of Alt ingedrukt zijn
  if (e.key === 'j' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const notesSection = document.getElementById('notes-summary');
    if (notesSection) {
      notesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Zoek iets in de sectie om focus op te zetten (zoals de heading)
      const focusTarget = notesSection.querySelector('h2, h1, div, section');
      if (focusTarget) {
        focusTarget.setAttribute('tabindex', '-1'); // Maak tijdelijk focusbaar
        focusTarget.focus();
      }
    }
  }
});


 const speedControl = document.getElementById('speedControl');
    const speedValue = document.getElementById('speedValue');

    // Update de weergave van de snelheid
    speedControl.addEventListener('input', function() {
      speedValue.textContent = speedControl.value;
    });

    function speakText() {
      const text = 'Dit is een voorbeeld van het voorlezen van tekst met aanpasbare snelheid.';
      const utterance = new SpeechSynthesisUtterance(text);

      // Stel de snelheid in op basis van de sliderwaarde
      utterance.rate = parseFloat(speedControl.value);

      // Spreek de tekst uit
      speechSynthesis.speak(utterance);
    };