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


  document.addEventListener('DOMContentLoaded', function () {
    const chapterLinks = document.querySelectorAll('header div> a');

    chapterLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault(); // Voorkom de standaard link-gedrag (zoals het springen naar de ankerlink)

        // Vind het hoofdstuk waar de link naar verwijst
        const targetChapter = document.querySelector(link.getAttribute('href'));

        if (targetChapter) {
          // Scroll naar het hoofdstuk, met het hoofdstuk in het midden van het scherm
          targetChapter.scrollIntoView({
            behavior: 'smooth',
            block: 'center' // Zorgt ervoor dat het hoofdstuk in het midden komt
          });

          // Zet de focus op het hoofdstuk
          targetChapter.focus(); // Focus op de <h2> van het hoofdstuk

          // Optioneel: Zet de focus naar de eerste focusbare inhoud binnen dat hoofdstuk
          const firstFocusable = targetChapter.querySelector('p, a, h1');

          if (firstFocusable) {
            firstFocusable.focus(); // Zet de focus op de eerste focusbare inhoud
          }
        }
      });
    });
  });






let noteCount = 0;
let activeSentence = null;

// Stap 1: Wrap zinnen en voeg notitie-container toe onder elke paragraaf
document.querySelectorAll('p').forEach(paragraph => {
  const text = paragraph.innerText;
  const sentences = text.match(/[^\.!\?]+[\.!\?]+["']?|[^\.!\?]+$/g);
  if (!sentences) return;

  paragraph.innerHTML = '';

  sentences.forEach(sentence => {
    const span = document.createElement('span');
    span.classList.add('sentence');
    span.setAttribute('tabindex', '0');
    span.innerText = sentence.trim() + ' ';
    paragraph.appendChild(span);
  });

  const noteList = document.createElement('div');
  noteList.className = 'note-list';
  paragraph.appendChild(noteList);
});

// Focus tracking
document.querySelectorAll('.sentence').forEach(sentence => {
  sentence.addEventListener('focus', function () {
    activeSentence = this;
  });

  sentence.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleNoteBlock([this]);
    }

    const number = parseInt(e.key);
    if (!isNaN(number) && number >= 1 && number <= 9 && activeSentence) {
      e.preventDefault();
      const allSentences = [...activeSentence.closest('p').querySelectorAll('.sentence')];
      const startIndex = allSentences.indexOf(activeSentence);
      const selected = allSentences.slice(startIndex, startIndex + number);

      if (selected.length > 0) {
        toggleNoteBlock(selected);
      }
    }
  });
});

// Notitieblok tonen
function toggleNoteBlock(selectedSentences) {
  const first = selectedSentences[0];
  const paragraph = first.closest('p');
  const noteList = paragraph.querySelector('.note-list');

  // voorkom meerdere invoervelden tegelijk
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

  saveBtn.onclick = () => saveNote();

  textarea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveNote();
    }
  });

  function saveNote() {
    const noteText = textarea.value.trim();
    if (!noteText) return alert('Aantekening is leeg.');

    noteCount++;
    const entry = document.createElement('div');
    entry.className = 'note-entry';

    const zinTekst = selectedSentences.map(s => `"${s.innerText.trim()}"`).join(' ');
    entry.innerHTML = `<strong>Aantekening:</strong> <br> ${noteText}`;
    noteList.appendChild(entry);
    noteList.classList.add('has-notes');

    selectedSentences.forEach(s => {
      s.classList.add('highlighted');
      s.classList.remove('note-active');
    });

    noteBlock.remove();
  }

  selectedSentences.forEach(s => s.classList.add('note-active'));
  noteBlock.appendChild(textarea);
  noteBlock.appendChild(saveBtn);
  noteBlock.appendChild(cancelBtn);

  paragraph.appendChild(noteBlock);
  textarea.focus();
}
